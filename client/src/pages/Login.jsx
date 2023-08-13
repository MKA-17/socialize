import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import { useHelmet } from '../context/helmet';
import toast, {Toaster} from "react-hot-toast";

export default function Login(){
    
  const [helmetObj, setHelmetObj] = useHelmet()
  useEffect(()=>{
      setHelmetObj((prev)=>({...prev, title: "Login | Socialize"}))
      return ()=>{setHelmetObj((prev)=>({...prev, title: "Socialize"}))}
  
  }, []);

    const [formData, setFormData] = useState({   
    email: '',
    password: '',
    });
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();
    const loginMutation =  useMutation({
        mutationFn: async (variables) => {
          
          return (
            await fetch(`http://localhost:3001/api/auth/login`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json' // Setting the Content-Type header to JSON
              },
              body: JSON.stringify(variables),
            })
          ).json();
        },
        onSuccess: (data, variables, context) => {
          console.log("Inside LoginForm mutation: ", data, variables)
          if(data.success) {
            toast.success(data.message)
          if(data.isPassword) 
           { 
            setAuth((prev)=>{
              console.log("meow", JSON.stringify({ user: auth.user, token: auth.token }))
              window.localStorage.setItem(
                "auth",
                JSON.stringify({ token: data.token, user: data.user })
              );
              return ({...prev, token: data.token, user: data.user})
            });
            navigate("/")
           }
          }
          if(data.success === false)   toast.error(data.message) 
         },
        onError: (error, variables, context) => {
          console.log("error: ", error.message);
          toast.error('Some Error has been occurred') 
        },
      });   


    const handleSubmit = (e)=>{
        e.preventDefault();
        //console.log(e.target);
        console.log(formData);
      

        loginMutation.mutate(formData)
    }

  return (
    <>
    <Toaster/>
    <h2>Login</h2>
<form onSubmit={handleSubmit}>
 
  <div className="form-group">
    <label htmlFor="email">Email address</label>
    <input type="email" className="form-control" id="email" required onChange={e=>{
        setFormData(prev=>({...prev, email: e.target.value.trim()}))
    }}/>
  </div>
  <div className="form-group">
    <label htmlFor="password">Password</label>
    <input type="password" className="form-control" id="password"  required onChange={e=>{
        setFormData(prev=>({...prev, password: e.target.value.trim()}))
    }}/>
  </div>
  <br />
  <button type="submit" className="btn btn-primary">Login</button>

</form>
</>
  )
}
