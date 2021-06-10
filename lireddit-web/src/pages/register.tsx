// @ts-nocheck
import React from 'react';
import {Form, Formik} from 'formik';
import {Wrapper} from '../components/Wrapper';
import {InputField} from '../components/InputField';
import {Box} from '@chakra-ui/layout';
import {Button} from '@chakra-ui/button';
import {useRegisterMutation} from '../generated/graphql';
import {toErrorMap} from '../utils/toErrorMap';
import {useRouter} from 'next/router';
import {createUrqlClient} from '../utils/createUrqlClient';
import {withUrqlClient} from 'next-urql';

interface registerProps {

}


export const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();
    return (
        <Wrapper variant="small">
            <Formik initialValues={{email: '', username: '', password: ''}}
                    onSubmit={async (values, {setErrors}) => {
                        const response = await register({options: values});

                        if(response.data?.register.errors) {
                            setErrors(toErrorMap(response.data.register.errors))
                        } else if(response.data?.register.user) {
                            router.push('/')
                        }

                        console.log(response, 'user???')
                    }}>
                {({isSubmitting}) => (
                    <Form>
                        <InputField placeholder="username"
                                    name="username"
                                    type="text"
                                    label="Username"/>
                        <Box mt={4}>
                            <InputField placeholder="email"
                                        name="email"
                                        type="email"
                                        label="Email"/>
                        </Box>
                        <Box mt={4}>
                            <InputField placeholder="password"
                                        name="password"
                                        type="password"
                                        label="Password"/>
                        </Box>
                        <Button type="submit"
                                isLoading={isSubmitting}
                                mt={4}
                                colorScheme="teal">
                            Register
                        </Button>

                    </Form>
                )}
            </Formik>
        </Wrapper>

    );
}
export default withUrqlClient(createUrqlClient)(Register);
