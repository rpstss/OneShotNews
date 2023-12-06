import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";

export default function NewsSkeleton(){
    return (
        <Box>
            <Skeleton rounded="2xl" height={400} mb={6} />
            {/* <SkeletonText noOfLines={3}/> */}
        </Box>
    )
}