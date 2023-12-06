import { Box, useDisclosure } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import Header from "./Header";


export default function Root(){
    const{isOpen, onClose, onOpen} = useDisclosure();
    return <Box>
        <Header/>
        <Outlet/>
    </Box>;
}