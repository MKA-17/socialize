import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [auth, setAuth] = useState({
        user: '',
        token: ''
    });
    
    const [isTokenModal, setIsTokenModal] = useState(false);
    

//console.log("inside authcontent")
    //Since when we reload page, all the states got refresh to their initial state, 
    //thus to persist our value in the sate, we'll use localStorage.
    // console.log(auth)

    useEffect(()=>{
        let data = JSON.parse(window.localStorage.getItem("auth"));
        
        if(data) setAuth((prev)=>({...prev, token: data?.token, user: data?.user}));

        if(auth?.token){
            let tokenExpiry = JSON.parse(atob(auth.token.split(".")[1]))?.exp * 1000
            // console.log("expire token: ", data, new Date(tokenExpiry ), tokenExpiry - Date.now())
            const intervalId = setInterval(() => {
                // console.log("inside interval")
                window.localStorage.removeItem("auth");
                setAuth(({
                    user: '',
                    token: ''
                }))
                setIsTokenModal(true);
                clearInterval(intervalId);
            }, tokenExpiry - Date.now());

            
        }

    }, [auth.token])

 

    return (
        <AuthContext.Provider value={[auth, setAuth, isTokenModal, setIsTokenModal]}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = ()=> useContext(AuthContext);