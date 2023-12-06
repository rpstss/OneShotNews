import { Button } from "@chakra-ui/button";
import { Box, Divider, HStack, Text, VStack } from "@chakra-ui/layout";
import {FaMoon, FaUserAstronaut, FaLock, FaComment} from "react-icons/fa"

export default function SocialLogin() {
    const kakaoParams = {
        client_id: "c363b85f0cf5caee02510251ae2dd457",
        redirect_uri:"https://prog2-frontend.onrender.com/social/kakao",
        response_type: "code",
    };
    // const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?${new URLSearchParams(
    //     kakaoParams
    //   ).toString()}`;
    const params = new URLSearchParams(kakaoParams).toString()
    console.log(params)
    return(
        <Box mb={4}>
            <HStack my={8}>
                <Divider/>
                <Text textTransform={"uppercase"}
                color="gray.500" fontSize={"xs"} as="b">Or</Text>
                <Divider/>
            </HStack>
            <VStack>

                <Button as="a" href={`https://kauth.kakao.com/oauth/authorize?${params}`} w="100%" leftIcon={<FaComment />} colorScheme=
                "yellow">Continue with KaKaoTalk</Button>

            </VStack>
        </Box>
    )
}