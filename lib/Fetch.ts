import { ContactInterface } from "@/interfaces/contactInterface";

const url = "https://contactmanagerbe-h7bvahgfczddh6h7.westus3-01.azurewebsites.net/Contact/";

export const AddContact = async (contact: ContactInterface) => {
    const response = await fetch(url + "AddContact", {
        method: "POST", 
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(contact)
    });

    if(!response.ok){
        const data = await response.json();
        const message = data.message;

        console.log(message);
        return false;
    }

    const data = await response.json();
    return data.success;
};

export const GetContacts = async (token: string) => {
    const response = await fetch(url + "GetContacts");
    
    if(!response.ok){
        const data = await response.json();
        const message = data.message;

        return [];
    }

    const data = await response.json();
    return data;
};

export const GetContactsByName = async (name: ContactInterface, token: string) => {
    const response = await fetch(url + name)
    
    if(!response.ok){
        const data = await response.json();
        const message = data.message;

        console.log(message);
        return [];
    }

    const data = await response.json();
    return data.contacts;
};

export const GetContactsByPhoneNumber = async (phoneNumber: ContactInterface, token: string) => {
    const response = await fetch(url + phoneNumber)
    
    if(!response.ok){
        const data = await response.json();
        const message = data.message;

        console.log(message);
        return [];
    }

    const data = await response.json();
    return data.contacts;
};

export const GetContactsByEmail = async (email: ContactInterface, token: string) => {
    const response = await fetch(url + email)
    
    if(!response.ok){
        const data = await response.json();
        const message = data.message;

        console.log(message);
        return [];
    }

    const data = await response.json();
    return data.contacts;
};

export const EditContact = async (contact: ContactInterface, token: string) => {
    const response = await fetch(url + "EditContact", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contact),
    });

    if(!response.ok){
        const data = await response.json();
        const message = data.message;

        console.log(message);
        return false;
    }

    const data = await response.json();
    return data;
};

export const DeleteContact = async (contact: ContactInterface, token: string) => {
    const response = await fetch(url + "DeleteContact", {
        method:"DELETE",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contact),
    });

    if(!response.ok){
        const data = await response.json();
        const message = data.message;

        console.log(message);
        return false;
    }

    const data = response.json();
    return data;
};