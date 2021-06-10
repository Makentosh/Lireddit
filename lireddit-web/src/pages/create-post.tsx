// @ts-nocheck
import React from 'react';
import {Form, Formik} from 'formik';
import {InputField} from '../components/InputField';
import {Box} from '@chakra-ui/layout';
import {Flex} from '@chakra-ui/react';
import {Button} from '@chakra-ui/button';
import {useCreatePostMutation} from '../generated/graphql';
import {useRouter} from 'next/router';
import {withUrqlClient} from 'next-urql';
import {createUrqlClient} from '../utils/createUrqlClient';
import Layout from '../components/Layout';
import {useIsAuth} from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    useIsAuth();
    const [, createPost] = useCreatePostMutation();

    return (
        <Layout variant="small">
            <Formik initialValues={{title: '', text: ''}}
                    onSubmit={async (values) => {
                        const {error} = await createPost({input: values})

                        if(error?.message.includes("Not authenticated")) {
                            router.push('/login')
                        }
                        if(!error){
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

export default withUrqlClient(createUrqlClient)(CreatePost)
