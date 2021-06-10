import React, {useState} from 'react';
import {Form, Formik} from 'formik';
import {InputField} from '../components/InputField';
import {Box, Flex} from '@chakra-ui/react';
import {Button} from '@chakra-ui/button';
import {Wrapper} from '../components/Wrapper';
import {useForgotPasswordMutation} from '../generated/graphql';
import {withApollo} from '../utils/withApollo';


const ForgotPassword: React.FC<{}> = ({}) => {
    const [forgotPassword] = useForgotPasswordMutation();
    const [complete, setComplete] = useState(false);

    return (
        <Wrapper variant="small">
            <Formik initialValues={{email: ''}}
                    onSubmit={async (values) => {
                        await forgotPassword({variables: values});
                        setComplete(true)
                    }}>
                {({isSubmitting}) => !complete ? (
                    <Form>
                        <InputField placeholder="email"
                                    name="email"
                                    type="email"
                                    label="Email"/>
                        <Flex align="center" mt={4}>
                            <Button type="submit"
                                    isLoading={isSubmitting}
                                    colorScheme="teal">
                                Send forgot passsword
                            </Button>
                        </Flex>


                    </Form>
                ) :
                    <Box>
                        if an account with that email exist, we sent you can email
                    </Box>
                }
            </Formik>
        </Wrapper>
    )
};

export default withApollo({ssr: false})(ForgotPassword);
