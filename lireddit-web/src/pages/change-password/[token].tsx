// @ts-nocheck
import React, {useState} from 'react';
import {NextPage} from 'next';
import {Wrapper} from '../../components/Wrapper';
import {Form, Formik} from 'formik';
import {InputField} from '../../components/InputField';
import {Button} from '@chakra-ui/button';
import {useChangePasswordMutation} from '../../generated/graphql';
import {toErrorMap} from '../../utils/toErrorMap';
import {useRouter} from 'next/router';
import {Box, Flex, Link} from '@chakra-ui/react';
import {createUrqlClient} from '../../utils/createUrqlClient';
import {withUrqlClient} from 'next-urql';
import NextLink from 'next/link';

const ChangePassword: NextPage = () => {
    const [, changePassword] = useChangePasswordMutation()
    const router = useRouter();
    const [tokenError, setTokenError] = useState('');


    return (
        <Wrapper variant="small">
            <Formik initialValues={{newPassword: ''}}
                    onSubmit={async (values, {setErrors}) => {
                        const response = await changePassword({
                            newPassword: values.newPassword,
                            token: router.query.token === 'string' ? router.query.token : ''
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


export default withUrqlClient(createUrqlClient)(ChangePassword);
