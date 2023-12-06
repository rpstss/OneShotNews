import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Box, VStack } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { FaLock, FaUserAstronaut } from "react-icons/fa";
import SocialLogin from "./SocialLogin";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, useToast } from "@chakra-ui/react"
import { error } from "console";
import { IUsernameLoginError, IUsernameLoginSuccess, IUsernameLoginVariables, usernameLogin } from "../routes/api";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { title } from "process";
interface LoginModalProps{
    isOpen:boolean;
    onClose: () => void;
}

interface IForm{
    username:string;
    password:string;
}
export default function LoginModal({isOpen, onClose}:LoginModalProps) {
    const {register, handleSubmit, formState:{errors}, reset} = useForm<IForm>();
    const toast = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation(usernameLogin, {
       
        onSuccess: () =>{
           
            toast({
                title:"welcome back",
                status: "success",
            })
            onClose();
            
            queryClient.refetchQueries(['me'])
            reset();
        },
        
    });
    const onSubmit = ({username, password}:IForm) => {
        mutation.mutate({username, password})
    }
    
    return (
        <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Log in</ModalHeader>
            <ModalCloseButton/>
            <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack>
            <InputGroup size={"md"}>
                <InputLeftElement children={<Box color="gray.500">
                    <FaUserAstronaut/></Box>}/>
                <Input isInvalid={Boolean(errors.username?.message)} {...register("username", {required:"Please write a username",})} variant={"filled"} placeholder="username"/>
                
            </InputGroup>
            <InputGroup>
                <InputLeftElement children={<Box color="gray.500">
                <FaLock/></Box>}/>
                <Input isInvalid={Boolean(errors.password?.message)} {...register("password", {required:"Please write a password",})}  type="password" variant={"filled"} placeholder="password"/>
                
            </InputGroup>
            
            </VStack>
            {mutation.isError? (<Text color="red.500" textAlign={"center"} fontSize={"sm"}>Username or Password are wrong</Text>
            ) : null} 
            <Button isLoading={mutation.isLoading} type="submit" mt= {4} colorScheme="red" w="100%">Log in</Button>
            <SocialLogin/>
            
            </ModalBody>

        </ModalContent>
    </Modal>
    )
}