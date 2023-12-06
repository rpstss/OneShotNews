import Cookie from "js-cookie"
import axios from "axios"
const instance = axios.create({
        baseURL: process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000/api/v1/" : "https://prog2.onrender.com/api/v1",
        withCredentials: true,
});

export const getKrNews = () => 
instance.get("news/kr").then((response) => response.data);

export const getEnNews = () => 
instance.get("news/en").then((response) => response.data);


export const getImage = () => 
instance.get("news/image").then((response) => response.data);

export const getMe = () => 
instance.get(`users/me`).then((response) => response.data)

export const logOut = () => instance.post(`users/log-out`, null,{ 
headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
},
}).then((response) =>
response.data);


export const kakaoLogIn = (code:string) => 
instance.post(`/users/kakao`,
{code},
{
        headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
} ).then((response)=>response.status);

export interface IUsernameLoginSuccess{
        ok:string;

}
export interface IUsernameLoginError{
        error:string;
        
}
export interface IUsernameLoginVariables{
        username:string;
        password:string
}
export interface IUsernameSignupVariables{
        username:string;
        password:string
        name:string;
        email:string;
}
export const usernameLogin = ({username, password}:IUsernameLoginVariables) => 
instance.post(`/users/log-in`,
{username, password},
{
        headers: {
                "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
} ).then((response)=>response.data);

export const userSignup = ({username, password, name, email}:IUsernameSignupVariables) => 
instance.post(`/users/signup`,
{username, password, name, email},
 ).then((response)=>response.data);