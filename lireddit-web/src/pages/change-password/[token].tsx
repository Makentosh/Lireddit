import React, {useState} from 'react';
import {NextPage} from 'next';
import {Wrapper} from '../../components/Wrapper';
import {Form, Formik} from 'formik';
import {InputField} from '../../components/InputField';
import {Button} from '@chakra-ui/button';
import {MeDocument, MeQuery, useChangePasswordMutation} from '../../generated/graphql';
import {toErrorMap} from '../../utils/toErrorMap';
import {useRouter} from 'next/router';
import {Box, Flex, Link} from '@chakra-ui/react';
import NextLink from 'next/link';
import {withApollo} from '../../utils/withApollo';

const ChangePassword: NextPage = () => {
    const [changePassword] = useChangePasswordMutation()
    const router = useRouter();
    const [tokenError, setTokenError] = useState('');


    return (
        <Wrapper variant="small">
            <Formik initialValues={{newPassword: ''}}
                    onSubmit={async (values, {setErrors}) => {
                        const response = await changePassword({
                            variables: {
                                newPassword: values.newPassword,
                                token: router.query.token === 'string' ? router.query.token : ''
                            },
                            update: (cache, {data}) => {
                                cache.writeQuery<MeQuery>({
                                    query: MeDocument,
                                    data: {
                                        __typename: "Query",
                                        me: data?.changePassword.user,
                                    }
                                })
                            }
                        });
                        if(response.data?.changePassword.errors) {
                            const errorMap = toErrorMap(response.data.changePassword.errors)
                            if('token' in errorMap) {
                                setTokenError(errorMap.token)
                            }

                            setErrors(errorMap)
                        } else if(response.data?.changePassword.user) {
                            router.push('/')
                        }
                    }}>
                {({isSubmitting}) => (
                    <Form>
                        <InputField placeholder="new password"
                                    name="newPassword"
                                    type="password"
                                    label="New password"/>
                        {tokenError &&
                        <Flex>
                          <Box mr={2}
                               color="red">
                              {tokenError}
                          </Box>
                          <NextLink href="/forgot-password">
                            <Link>
                              Go forget it again
                            </Link>
                          </NextLink>

                        </Flex>

                        }
                        <Button type="submit"
                                isLoading={isSubmitting}
                                mt={4}
                                colorScheme="teal">
                            Change password
                        </Button>

                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
};


export default withApollo({ssr: false})(ChangePassword);
