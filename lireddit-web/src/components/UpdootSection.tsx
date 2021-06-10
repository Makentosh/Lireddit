import React, {FC, useState} from 'react';
import {IconButton, Link} from '@chakra-ui/react';
import {ChevronDownIcon, ChevronUpIcon} from '@chakra-ui/icons';
import {Flex} from '@chakra-ui/layout';
import {PostSnippetFragment, useVoteMutation} from '../generated/graphql';
import {withUrqlClient} from 'next-urql';
import {createUrqlClient} from '../utils/createUrqlClient';

interface UpdootSectionProps  {
    post: PostSnippetFragment
}

const UpdootSection: FC<UpdootSectionProps> = ({post}) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
    const [, vote] = useVoteMutation();
    return (
        <Flex direction="column"
              alignItems="center"
              mr={4}>
            <IconButton aria-label="updoot post"
                        as={Link}
                        colorScheme={post.voteStatus === 1 ? "green" : undefined}
                        onClick={
                            async () => {
                                if(post.voteStatus === 1) {
                                    return
                                }

                                setLoadingState('updoot-loading');
                                await vote({postId: post.id, value: 1});
                                setLoadingState('not-loading');
                            }
                        }
                        isLoading={loadingState === 'updoot-loading'}
                        icon={ <ChevronUpIcon boxSize="24px"/>}/>
            {post.points}
            <IconButton aria-label="downdoot post"
                        as={Link}
                        colorScheme={post.voteStatus === -1 ? "red" : undefined}
                        isLoading={loadingState === 'downdoot-loading'}
                        onClick={
                            async () => {
                                if(post.voteStatus === -1) {
                                    return
                                }
                                setLoadingState('downdoot-loading')
                                await vote({postId: post.id, value: -1})
                                setLoadingState('not-loading');
                            }
                        }
                        icon={<ChevronDownIcon boxSize="24px"/>}/>

        </Flex>
    )
};

export default withUrqlClient(createUrqlClient)(UpdootSection);
