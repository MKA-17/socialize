import React, { useEffect } from 'react'
import { useAuth } from '../context/auth';
import { useQuery } from '@tanstack/react-query';
import PostCard from '../components/PostCard';
import { useHelmet } from '../context/helmet';
import toast, {Toaster} from "react-hot-toast";

export default function SavedPost() {
    const [auth] = useAuth();
    const [helmetObj, setHelmetObj] = useHelmet()
    useEffect(()=>{
        setHelmetObj((prev)=>({...prev, title: "Saved Posts | Socialize"}))
        return ()=>{setHelmetObj((prev)=>({...prev, title: "Socialize"}))}
    
    }, []);
    let {
        data: getPostsData,
        isLoading: postIsloading,
        isError: postIsError,
        refetch: getPostRefetch,
      } = useQuery({
        queryKey: ["postData"],
        queryFn: async () => {
          let resp = await fetch(`${import.meta.env.VITE_API_URL}/api/user/get-saved-post/`, {
            method: "GET",
            headers: {
              authorization: auth.token,
              "Content-Type": "application/json",
            },
          });
    
          return resp.json();
        },
      });
      // console.log("saved posts data: ", getPostsData);
      if(postIsError)  toast.error('Some Error has occurred.')

    
  return (
    <>
        <Toaster/>

    <h2>Saved Posts</h2>

    <div className="col-md-12">
      
     {/* Display posts here */}
    {postIsloading ? "Loading..." : null}
    {getPostsData &&
      getPostsData?.savedPosts?.map((e) => (
        <PostCard
        key={e._id}
        postData={e}
        getPostRefetch={getPostRefetch}
        />
       ))}
  </div>
  </>

  )

}
