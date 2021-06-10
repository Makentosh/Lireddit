import React from 'react';
import {Form, Formik} from 'formik';
import {useCreatePostMutation} from '../generated/graphql';
import {useRouter} from 'next/router';
import Layout from '../components/Layout';
import {useIsAuth} from '../utils/useIsAuth';
import {InputField} from '../components/InputField';
import {Box, Flex} from '@chakra-ui/layout';
import {Button} from '@chakra-ui/button';
import {withApollo} from '../utils/withApollo';


const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    useIsAuth();
    const [createPost] = useCreatePostMutation();

    return (
        <Layout variant="small">
            <Formik initialValues={{title: '', text: ''}}
                    onSubmit={async (values) => {
                        const {errors} = await createPost({
                            variables: {input: values},
                            update: (cache) => {
                                cache.evict({
                                    fieldName: 'posts:{}'
                                })
                            }
                        })

                        if(errors?.message.includes("Not authenticated")) {
                            router.push('/login')
                        }
                        if(!errors){
                            router.push('/')
                        }

                    }}>
                {({isSubmitting}) => (
                    <Form>
                        <InputField placeholder="Title"
                                    name="title"
                                    type="text"
                                    label="Title"/>
                        <Box mt={4}>
                            <InputField placeholder="Text..."
                                        name="text"
                                        type="text"
                                        textarea
                                        label="Text"/>
                        </Box>

                        <Flex align="center" mt={4}>
                            <Button type="submit"
                                    isLoading={isSubmitting}
                                    colorScheme="teal">
                                Create Post
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
};

export default withApollo({ssr: false})(CreatePost);
