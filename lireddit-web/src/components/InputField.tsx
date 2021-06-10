// @ts-nocheck
import React, {InputHTMLAttributes} from 'react';
import {FormControl, FormErrorMessage, FormLabel} from '@chakra-ui/form-control';
import {Input} from '@chakra-ui/input';
import {Textarea} from '@chakra-ui/textarea';
import {useField} from 'formik';

type inputFieldProps =  InputHTMLAttributes<HTMLInputElement> & {
    name: string
    label: string
    placeholder: string
    type: string
    children: React.ReactNode,
    textarea?: boolean
}

export const InputField: inputFieldProps = ({label, textarea, size: _, ...props}) => {
    const [field, {error}] = useField(props)

    let InputOrTextarea = Input;
    if (textarea) {
        InputOrTextarea = Textarea
    }

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextarea {...field}
                   id={field.name}
                   type={props.type}
                   placeholder={props.placeholder}/>
            {error ?  <FormErrorMessage>{error}</FormErrorMessage> : null}

        </FormControl>
    )
}
