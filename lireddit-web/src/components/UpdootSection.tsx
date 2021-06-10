import React, {FC, useState} from 'react';
import {IconButton, Link} from '@chakra-ui/react';
import {ChevronDownIcon, ChevronUpIcon} from '@chakra-ui/icons';
import {Flex} from '@chakra-ui/layout';
import {Post, PostSnippetFragment, useVoteMutation, VoteMutation} from '../generated/graphql';
import {gql} from '@urql/core';
import {ApolloCache} from '@apollo/client';

interface UpdootSectionProps {
    post: PostSnippetFragment
}

const updateAfterVote = (value: number, postId: number, cache: ApolloCache<VoteMutation>) => {
  const data = cache.readFragment<{
      id: number;
      points: number;
      voteStatus: number | null;
  }>({
      id: 'Post' + postId,
    fragment: gql`
        fragment _ on Post {
            id
            points
            voteStatus
        }
    `
  })

  if (data) {

      if (data.voteStatus === value) {
          return
      }
      const newPoints = (data.points as number) + ((!data.voteStatus ? 1 : 2) * value)
    cache.writeFragment({
      post: "Post:" + postId,
      fragment: gql`
          fragment _ on Post {
              points
              voteStatus
          }
      `,
        data: {points: newPoints, voteStatus: value}
    })
  }
}


const UpdootSection: FC<UpdootSectionProps> = ({post}) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
    const [vote] = useVoteMutation();
    return (
        <Flex direction="column"
              alignItems="center"
              mr={4}>
            <IconButton aria-label="updoot post"
                        as={Link}
                        colorScheme={post.voteStatus === 1 ? 'green' : undefined}
                        onClick={
                            async () => {
                                if (post.voteStatus === 1) {
                                    return
                                }

                                setLoadingState('updoot-loading');
                                await vote({
                                    variables: {
                                        postId: post.id, value: 1
                                    },
                                    update: (cache) => updateAfterVote(1, post.id, cache)
                                });
                                setLoadingState('not-loading');
                            }
                        }
                        isLoading={loadingState === 'updoot-loading'}
                        icon={<ChevronUpIcon boxSize="24px"/>}/>
            {post.points}
            <IconButton aria-label="downdoot post"
                        as={Link}
                        colorScheme={post.voteStatus === -1 ? 'red' : undefined}
                        isLoading={loadingState === 'downdoot-loading'}
                        onClick={
                            async () => {
                                if (post.voteStatus === -1) {
                                    return
                                }
                                setLoadingState('downdoot-loading')
                                await vote({
                                    variables: {postId: post.id, value: -1},
                                    update: (cache) => updateAfterVote(-1, post.id, cache)
                                })
                                setLoadingState('not-loading');
                            }
                        }
                        icon={<ChevronDownIcon boxSize="24px"/>}/>

        </Flex>
    )
};

export default UpdootSection;
