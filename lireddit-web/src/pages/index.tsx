import React, {useState} from 'react';
import {withUrqlClient} from 'next-urql';
import {createUrqlClient} from '../utils/createUrqlClient';
import {useMeQuery, usePostsQuery} from '../generated/graphql';
import {Box, Flex, Stack} from '@chakra-ui/layout';
import {Button, Heading, Text, Link} from '@chakra-ui/react';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import UpdootSection from '../components/UpdootSection';
import EditDeletePostButtons from '../components/EditDeletePostButtons';


const Index = ({}) => {
    const [variables, setVariables] = useState({
        limit: 15,
        cursor: null as null | string
    });

    const [{data, fetching}] = usePostsQuery({
        variables
    });

    if (!fetching && !data) {
        return <div>you got query failed for some reason</div>
    }

    return (
        <Layout>

            {!data?.posts?.posts && fetching ?
                <div>
                    Loading...
                </div>
                :
                <Stack spacing={8}>
                    {data!.posts.posts.map(post => !post ? null : (
                            <Flex key={post.id}
                                  p={5}
                                  shadow="md"
                                  borderWidth="1px">
                                <UpdootSection post={post}/>
                                <Box flex={1}>
                                    <NextLink href="/post/[id]"
                                              as={`/post/${post.id}`}>
                                        <Link>
                                            <Heading fontSize="xl">{post.title}</Heading>
                                        </Link>
                                    </NextLink>

                                    <Text>posted by {post.creator.username}</Text>
                                    <Flex>
                                        <Text mt={4}
                                              flex={1}>
                                            {post.textSnippet}
                                        </Text>
                                       <Box ml="auto">
                                        <EditDeletePostButtons id={post.id}
                                                               creatorId={post.creator.id}/>
                                      </Box>

                                    </Flex>

                                </Box>

                            </Flex>
                        )
                    )}
                </Stack>
            }
            {(data && data.posts.hasMore) &&
            <Flex justify="center"
                  my="4">
              <Button as={Link}
                      onClick={() => {
                          setVariables({
                              limit: variables.limit,
                              cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                          })
                      }}
                      isLoading={fetching}>
                Load more
              </Button>
            </Flex>
            }


        </Layout>

    )
}


export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
