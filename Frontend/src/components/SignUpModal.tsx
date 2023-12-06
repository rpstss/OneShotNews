import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Box, VStack } from "@chakra-ui/layout";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { FaLock, FaUserAstronaut, FaEnvelope, FaUserCircle } from "react-icons/fa";
import SocialLogin from "./SocialLogin";
import { useForm } from "react-hook-form";
import { useToast, Text} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userSignup } from "../routes/api";

interface SignUpModalProps{
    isOpen:boolean;
    onClose: () => void;
}

interface ISForm{
    username:string;
    password:string;
    name:string;
    email:string;

}

export default function SignUpModal({isOpen, onClose}:SignUpModalProps) {
    const {register, handleSubmit, formState:{errors}, reset} = useForm<ISForm>();
    const toast = useToast();
    const queryClient = useQueryClient();
    const mutation = useMutation(userSignup, {
       
        onSuccess: () =>{
           
            toast({
                title:"Welcome to OneShotNews!",
                status: "success",
            })
            onClose();
            
            queryClient.refetchQueries(['me'])
            reset();
        },
        
    });
    const onSubmit = ({username, password, name, email}:ISForm) => {
        console.log("Submit clicked", { username, password, name, email });
        console.log("Mutation state", mutation);
        mutation.mutate({username, password, name, email})
    }
    return (
        <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Sign up</ModalHeader>
            <ModalCloseButton/>
            <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
                <VStack>
                <InputGroup>
                    <InputLeftElement children={<Box color="gray.500">
                    <FaUserCircle/></Box>}/>
                    <Input isInvalid={Boolean(errors.name?.message)} {...register("name", {required:"Please write a name",})} variant={"filled"} placeholder="Name"/>
                </InputGroup>
                <InputGroup>
                    <InputLeftElement children={<Box color="gray.500">
                    <FaEnvelope/></Box>}/>
                    <Input isInvalid={Boolean(errors.email?.message)} {...register("email", {required:"Please write a Email", pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                        }})}variant={"filled"} placeholder="Email"/>
                </InputGroup>
                <InputGroup>
                    <InputLeftElement children={<Box color="gray.500">
                        <FaUserAstronaut/></Box>}/>
                    <Input isInvalid={Boolean(errors.username?.message)} {...register("username", {required:"Please write a username", })}variant={"filled"} placeholder="Username"/>
                </InputGroup>
                <InputGroup>
                    <InputLeftElement children={<Box color="gray.500">
                    <FaLock/></Box>}/>
                    <Input isInvalid={Boolean(errors.password?.message)} {...register("password", {required:"Please write a password",})}variant={"filled"} placeholder="password"/>
                </InputGroup>
                </VStack>
                {mutation.isError? (<Text color="red.500" textAlign={"center"} fontSize={"sm"}>Please check again.</Text>
                ) : null} 
                <Button isLoading={mutation.isLoading} type="submit" mt= {4} colorScheme="red" w="100%">Sign up</Button>
                <SocialLogin/>
                
            </ModalBody>

        </ModalContent>
    </Modal>
    )
}