import NewsSkeleton from "../components/NewsSkeleton";
import News from "../components/News";
import { useQuery } from "@tanstack/react-query";
import { Button, Center, Flex, Grid } from "@chakra-ui/react";
import { getImage, getKrNews, getEnNews } from "./api";
import { useEffect, useState } from "react";
import EnNews from "../components/EnNews";

interface INews{
        "newsid":string,
        "newstitle":string, 
        "newsdomain" :string,
        "imageid":string,
        "newsdate" :string,
        "newscompany":string,
        "newscommentnum":string,
        "newsrelatednum":string,
        "commentweight":string,
        "relatednewsweight":string, 
        "weight":string,
        "selectresult":string,
        "newssummary":string, 
        
}

interface IENews{
        "newsid":string, 
        "newstitle":string, 
        "newsdomain":string, 
        "newssummary":string, 
        "newstranslation":string, 
        "imageid":string,
}

interface Iimage{
    "imageid":string,
    
    "image_width":string, 
    "image_height":string,
    "image_data":string,
   
}

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("kr");

  const { isLoading, data } = useQuery<INews[]>([`${selectedLanguage}newses`], selectedLanguage === "kr" ? getKrNews : getEnNews);
  const { data:imageData } = useQuery<Iimage[]>(["images"], getImage);

  const handleLanguageToggle = () => {
    // Toggle between "kr" and "en" when the button is clicked
    setSelectedLanguage((prevLanguage) => (prevLanguage === "kr" ? "en" : "kr"));
  };

  return (
    
    <Grid mt={10} px={40} columnGap={4} rowGap={8} templateColumns={"repeat(3, 1fr)"}>
        <Center gridColumnStart={1} gridColumnEnd={4}>
            <Button onClick={handleLanguageToggle}  mb={4}>
                {selectedLanguage === "kr" ? "Go to EnNews" : "Go to KrNews"}
            </Button>
        </Center>

        {isLoading ? (
        <>
            <NewsSkeleton/>
            <NewsSkeleton/>
            <NewsSkeleton/>
            <NewsSkeleton/>
            <NewsSkeleton/>
            <NewsSkeleton/>

        </>

        ) : null}
        

        {data?.map((news) => {
           
          if (!imageData) {
            console.log("no image")
            return (
              selectedLanguage === "en" ? (
                <EnNews
                  newssummary={news.newssummary}
                  //image_data={image.image_data}
                />
              ) : (
                <News
                  //image_data={image.image_data}
                  newssummary={news.newssummary}
                />
              )
            );
          }

          
          else {
            const image = imageData.find((img) => img.imageid === news.imageid);
           
            if (image) {
                
              return (
                
                selectedLanguage === "en" ? (
                  <EnNews
                    image_data={`data:image/jpeg;base64,${image.image_data}`}
                    newssummary={news.newssummary}
                    //newstranslation={news.newssummary}
                  />
                ) : (
                  <News
                    image_data={`data:image/jpeg;base64,${image.image_data}`}
                    newssummary={news.newssummary}
                  />
                )
              );
            } else {
              return (
                selectedLanguage === "en" ? (
                  <EnNews 
                  newssummary={news.newssummary} 
                  image_data={"https://media.bunjang.co.kr/product/171179718_1_1637991743_w360.jpg"}
                  //newstranslation={news.newssummary} 
                  />
                ) : (
                  <News 
                  newssummary={news.newssummary} 
                  image_data={"https://media.bunjang.co.kr/product/171179718_1_1637991743_w360.jpg"}
                  />
                )
              );
            }
          }
        })}
      </Grid>
    
  );
}

// export default function Home(){
//     const { isLoading, data } = useQuery<INews[]>(["newses"], getKrNews);
//     const { data: imageData } = useQuery<Iimage[]>(["images"], getImage);

//     return (<Grid mt = {20} px={40} columnGap={4} rowGap={8} templateColumns={"repeat(3, 1fr)"}>
        
//         {isLoading ? (
//         <>
//             <NewsSkeleton/>
//             <NewsSkeleton/>
//             <NewsSkeleton/>
//             <NewsSkeleton/>
//             <NewsSkeleton/>
//             <NewsSkeleton/>

//         </>

//         ) : null}
//        {data?.map((news) => {
//     // imageData가 정의되지 않았을 때 처리
//     if (!imageData) {
//         return (
//         <News 
//                 //image_data={image.image_data}
//             newssummary={news.newstitle}
//             />);
//     }

//     // 해당 뉴스에 해당하는 이미지 데이터 찾기
//     else{
//         const image = imageData.find((img) => img.newsid === news.newsid);
//         if (image) {
        
//             return (
//                 <News 
//                     image_data={"https://media.bunjang.co.kr/product/171179718_1_1637991743_w360.jpg"}
//                     newssummary={news.newstitle}
//                 />
//             );
//         } else {
//             return (
//                 <News 
//                     newssummary={news.newstitle}
//                 />
//             );
//         }}
// })}




        
//     </Grid>
//     );
// }