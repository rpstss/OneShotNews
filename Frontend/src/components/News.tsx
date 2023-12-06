import { Box, Divider, HStack, Heading, Image, Text, VStack, useColorModeValue } from "@chakra-ui/react"


interface INewsProps {
    newssummary: string;
    image_data?: string; // 'image_data'는 선택적으로 설정
}

export default function News({newssummary, image_data }:INewsProps ){
    
    const gray = useColorModeValue("gray.0", "gray.700")
    return (
    <Box borderWidth="1px" borderColor="gray.400" bgColor={gray}
        p={4} rounded={"2xl"} maxW="400px" boxShadow={"md"} >
        
      <VStack  spacing={4}>
        {image_data && (
        <Image  
          rounded={"2xl"}
          src={image_data}
          
        />
        )}
        <HStack my={8}>
                <Divider  w={"110px"} borderColor={"gray.300"}/>
                <Text textTransform={"uppercase"}
                color="gray.500" fontSize={"xs"} as="b">AI News</Text>
                <Divider  w={"110px"} borderColor={"gray.300"}/>
        </HStack>
        <Box>
          <Text fontSize={"md"}>
            {newssummary}
          </Text>
        </Box>
      </VStack>
      
    </Box>
    // <VStack alignItems={"center"}>
    //         <Box display='flex' overflow="hidden" mb="2" rounded="3xl" >

    //             <Image h="280" 
    //              src={image_data}
    //              />
    //         </Box>
    //         <Heading noOfLines={1} fontSize={"md"}>
    //             {newssummary}
    //         </Heading>
         
    //     </VStack>
    )
}