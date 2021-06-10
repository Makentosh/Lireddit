import React from 'react';
import Layout from '../../../components/Layout';
import {Form, Formik} from 'formik';
import {InputField} from '../../../components/InputField';
import {Box} from '@chakra-ui/layout';
import {Flex} from '@chakra-ui/react';
import {Button} from '@chakra-ui/button';
import {usePostQuery, useUpdatePostMutation} from '../../../generated/graphql';
import {useGetIntId} from '../../../utils/useGetIntId';
import {useRouter} from 'next/router';
import {withApollo} from '../../../utils/withApollo';

const  EditPost= ({}) => {
    const intId = useGetIntId();
    const [updatePost] = useUpdatePostMutation();
    const router = useRouter();

    const {data, loading} = usePostQuery({
        skip: intId === -1,
        variables: {
            id: intId
        }
    })

    if(loading) {
        return (
            <Layout>
                <div>loading ....</div>
            </Layout>
        )
    }

    if(!data?.post) {
        return (
            <Layout>
                <Box>
                    Cloud not find post
                </Box>
            </Layout>
        )
    }


    return (
        <Layout variant="small">
            <Formik initialValues={{title: data.post.title, text: data.post.text}}
                    onSubmit={async (values) => {
                        updatePost({
                            variables: {id: intId,  ...values}
                        })
                        router.back()
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
                                Update Post
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
};

export default withApollo({ssr: false})(EditPost);
