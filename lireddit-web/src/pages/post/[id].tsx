import React from 'react';
import Layout from '../../components/Layout';
import {Box, Heading} from '@chakra-ui/layout';
import {useGetPostFromUrl} from '../../utils/useGetPostFromUrl';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';
import {withApollo} from '../../utils/withApollo';

const  Post = ({}) => {
    const {data, loading} = useGetPostFromUrl();

    if(loading) {
        return (
            <Layout>
                <div>... loading</div>
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
      <Layout>
          <Heading mb={4}>
              {data?.post?.title}
          </Heading>
          <Box mb={4}>
              {data?.post?.text}
          </Box>

          <EditDeletePostButtons id={data.post.id}
                                 creatorId={data.post.creator.id}/>
      </Layout>
    )
};

export default withApollo({ssr: true})(Post);
