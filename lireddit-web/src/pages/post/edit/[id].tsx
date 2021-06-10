import React from 'react';
import Layout from '../../../components/Layout';
import {createUrqlClient} from '../../../utils/createUrqlClient';
import {withUrqlClient} from 'next-urql';
import {Form, Formik} from 'formik';
import {InputField} from '../../../components/InputField';
import {Box} from '@chakra-ui/layout';
import {Flex} from '@chakra-ui/react';
import {Button} from '@chakra-ui/button';
import {usePostQuery, useUpdatePostMutation} from '../../../generated/graphql';
import {useGetIntId} from '../../../utils/useGetIntId';
import {useRouter} from 'next/router';

const  EditPost= ({}) => {
    const intId = useGetIntId();
    const [, updatePost] = useUpdatePostMutation();
    const router = useRouter();

    const [{data, fetching}] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId
        }
    })

    if(fetching) {
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
                        updatePost({id: intId,  ...values})
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

export default withUrqlClient(createUrqlClient)(EditPost);
