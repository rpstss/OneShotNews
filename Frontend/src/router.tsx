import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import KakaoConfirm from "./routes/KakaoConfrim";




const router= createBrowserRouter([{
    path:"/",
element:<Root/>,
errorElement:<NotFound/>,
children:[
    {
        path:"",
        element:<Home/>
    },
    {
        path:"social",
        children: [
            {
                path:"kakao",
                element: <KakaoConfirm />
            }
        ]
    }
  
]},])

export default router;