export const getUserStorage = () =>{
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
}

export const setUserStorage = (user) =>{
    localStorage.setItem("user",JSON.stringify(user));
}
