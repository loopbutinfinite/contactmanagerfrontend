import { Token, UserInfo } from "@/interfaces/userInterface"

const url = "https://contactmanagerbe-h7bvahgfczddh6h7.westus3-01.azurewebsites.net/User/";

export const CreateUser = async (user:UserInfo) => {
    const res = await fetch(url + "CreateUser", {
        method: "POST", 
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(user)
    });

    if(!res.ok){
        const data = await res.json();
        const message = data.message;

        console.log(message);
        return data.success;
    }

    const data = await res.json();
    return data.success;
}

export const Login = async (user: UserInfo) => {
    const res = await fetch(url + "Login", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(user)
    });

    if(!res.ok){
        const data = await res.json();
        const message = data.message;
        console.log(message);
        return null;
    }

    const data: Token = await res.json();
    return data;
};

export const GetUserByUsername = async (username: string) => {
    const res = await fetch(url + `GetUserByUsername/${username}`);
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
};

//This allows for the function to check for the user's token through LocalStorage(if they clicked remember me) or the Session Storage that will disappear when the user closes the window.
export const IsTokenValid = (): boolean => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token != null;
};

export const GrabToken = (): string => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ?? "";
};

export const LoggedInUser = () => JSON.parse(localStorage.getItem("user")!);
