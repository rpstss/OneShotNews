import { Button, IconButton } from "@chakra-ui/button";
import { Box, HStack, Text } from "@chakra-ui/layout";
import { FaNewspaper } from "react-icons/fa6";
import LoginModal from "./LoginModal";
import { useDisclosure } from "@chakra-ui/hooks";
import { FaMoon, FaSun,  } from "react-icons/fa";
import SignUpModal from "./SignUpModal";
import { Avatar, LightMode, Menu, MenuButton, MenuItem, MenuList, ToastId, useColorMode, useColorModeValue, useToast } from "@chakra-ui/react";
import useUser from "../lib/useUser";
import { logOut } from "../routes/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

export default function Header(){
    const{userLoading, isLoggedIn, user} = useUser();
    const{isOpen:isLoginOpen, onClose:onLoginClose, onOpen:onLoginOpen} = useDisclosure();
    const{isOpen:isSignUpOpen, onClose:onSignUpClose, onOpen:onSignUpOpen} = useDisclosure();
    const{toggleColorMode} = useColorMode();
    const logoColor = useColorModeValue("green.500", "green.300");
    const Icon = useColorModeValue(FaMoon, FaSun);
    const toast = useToast();
    const queryClient = useQueryClient()
    const toastId = useRef<ToastId>();
    const mutation = useMutation(logOut, {
        onMutate:() => {
            toastId.current = toast({
                title:"Login out...",
                description:"see you later",
                status:"loading",
                position:"bottom-right"
            })
        },
        onSuccess:() => {
            if (toastId.current){
            queryClient.refetchQueries(['me'])
            toast.update(toastId.current,{
                status:"success",
                title:"Done!",
                description:"Bye!",
                duration:3000,
            });
        }
        }
    })
    const onLogOut = async() => {
        mutation.mutate()
        
    }
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
        return timeString;
    };
    return (
        <HStack justifyContent={"space-between"} py={5} px={40} borderBottomWidth={1}>
            <HStack>

                <Box color={logoColor}>
                    <FaNewspaper size={"48"} />
                </Box>
                <Text ml={2} fontWeight={"bold"} fontSize={"2xl"}>OneShotNews</Text>
            </HStack>
            <HStack spacing={2}>
                <Text pr="10" fontSize={15} fontWeight={"bold"}>{getCurrentTime()}</Text>
                <IconButton onClick={toggleColorMode} variant={"ghost"} 
                aria-label="Toggle dark mode" 
                icon={<Icon/>} />
                    { !userLoading ? (
                    !isLoggedIn ? (
                    <>
                    <Button onClick={onLoginOpen}>Log in</Button>
                <LightMode>

                    <Button onClick={onSignUpOpen} colorScheme="red">Sign up</Button>
                </LightMode>
                </>):( 
                <Menu >
                    <MenuButton >
                        <HStack>

                            <Avatar name={user.name} src={user?.avatar} size={"md"}/>
                            <Text  fontWeight={"bold"} >{user.name}</Text> 
                        </HStack>
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={onLogOut}>Log out</MenuItem>
                    </MenuList>
                </Menu>
                )):null}
            </HStack>
                <LoginModal isOpen={isLoginOpen} onClose={onLoginClose}/>
                <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose}/>
        </HStack>
    )
}