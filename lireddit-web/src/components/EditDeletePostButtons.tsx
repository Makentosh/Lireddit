import React, {FC} from 'react';
import NextLink from 'next/link';
import {Box, IconButton, Link} from '@chakra-ui/react';
import {DeleteIcon, EditIcon} from '@chakra-ui/icons';
import {useDeletePostMutation, useMeQuery} from '../generated/graphql';

interface EditDeletePostButtons {
    id: number
    creatorId: number
}

const EditDeletePostButtons: FC<EditDeletePostButtons> = ({id, creatorId}) => {
    const [, deletePost] = useDeletePostMutation();
    const [{data}] = useMeQuery();

    if (data?.me?.id !== creatorId) {
        return null
    }

    return (
        <Box>
            <NextLink href="/post/edit/[id]"
                      as={`/post/edit/${id}`}>
                <IconButton icon={<EditIcon/>}
                            mr="2"
                            as={Link}
                            colorScheme="blue"
                            aria-label="edit-post"/>
            </NextLink>
            <IconButton icon={<DeleteIcon/>}
                        colorScheme="red"
                        aria-label="delete-post"
                        onClick={() => deletePost({id: id})}/>

        </Box>
    )
};

export default EditDeletePostButtons
