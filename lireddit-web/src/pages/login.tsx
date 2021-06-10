import React from 'react';
import {Form, Formik} from 'formik';
import {Wrapper} from '../components/Wrapper';
import {InputField} from '../components/InputField';
import {Box} from '@chakra-ui/layout';
import {Button} from '@chakra-ui/button';
import {MeDocument, MeQuery, useLoginMutation} from '../generated/graphql';
import {toErrorMap} from '../utils/toErrorMap';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import {Flex, Link} from '@chakra-ui/react';
import {withApollo} from '../utils/withApollo';


export const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [login] = useLoginMutation();

    return (
        <Wrapper variant="small">
            <Formik initialValues={{usernameOrEmail: '', password: ''}}
                    onSubmit={async (values, {setErrors}) => {
                        const response = await login({
                            variables: values,
                            update: (cache, {data}) => {
                                cache.writeQuery<MeQuery>({
                                    query: MeDocument,
                                    data: {
                                        __typename: "Query",
                                        me: data?.login.user,
                                    }
                                })
                                cache.evict({fieldName: "posts:{}"})
                            }
                        });

                        if (response.data?.login.errors) {
                            setErrors(toErrorMap(response.data.login.errors))
                        } else if (response.data?.login.user) {
                            router.push('/')
                        }
                    }}>
                {({isSubmitting}) => (
                    <Form>
                        <InputField placeholder="usernameOrEmail"
                                    name="usernameOrEmail"
                                    type="text"
                                    label="username Or Email"/>
                        <Box mt={4}>
                            <InputField placeholder="password"
                                        name="password"
                                        type="password"
                                        label="Password"/>
                        </Box>

                        <Flex align="center" mt={4}>
                            <Button type="submit"
                                    isLoading={isSubmitting}
                                    colorScheme="teal">
                                Login
                            </Button>

                            <NextLink href="/forgot-password">
                                <Link ml={2}>
                                    Go forget it again
                                </Link>
                            </NextLink>
                        </Flex>


                    </Form>
                )}
            </Formik>
        </Wrapper>

    );
}
export default withApollo({ssr: false})(Login);
