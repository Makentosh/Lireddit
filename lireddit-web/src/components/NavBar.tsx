import React from 'react';
import {Box, Flex, Link} from '@chakra-ui/layout';
import NextLink from 'next/link'
import {useLogoutMutation, useMeQuery} from '../generated/graphql';
import {Button} from '@chakra-ui/button';
import {isServer} from '../utils/isServer';
import {useRouter} from 'next/router';

interface NavbarProps {

}

const NavBar: React.FC<NavbarProps> = ({}) => {
    const router = useRouter();
    const [{data, fetching}] = useMeQuery({
        pause: isServer()
    });
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();


    let body = null;
    //data is loading
    if (fetching) {

        // user not logged in
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href={'/login'}>
                    <Button variant="link"
                            color="white"
                            mr={2}>
                        Login
                    </Button>
                </NextLink>

                <NextLink href={'/register'}>
                    <Button color="white"
                            variant="link">
                        Register
                    </Button>
                </NextLink>
            </>
        )
        // user is logged in
    } else {
        body = (
            <Flex align="center">
                <NextLink href={'/create-post'}>
                    <Button as={Link} mr="2">
                        Create post
                    </Button>

                </NextLink>
                <Box mr={2}>
                    {data.me.username}
                </Box>
                <Button variant="link"
                        as={Link}
                        color="white"
                        isLoading={logoutFetching}
                        onClick={async () => {
                            await logout();
                            router.reload();
                            }
                        }>
                    Logout
                </Button>
            </Flex>

        )
    }

    return (
        <Flex p={4}
              position="sticky"
              zIndex={2}
              top={0}
              align="center"
              bg="tomato">

            <Flex maxW={800}
                  flex={1}
                  margin='auto'
                  align="center">
                <NextLink href="/">
                    <Link>
                        Lireddit
                    </Link>
                </NextLink>
                <Box ml={'auto'}>
                    {body}
                </Box>
            </Flex>

        </Flex>
    )
};

export default NavBar;
