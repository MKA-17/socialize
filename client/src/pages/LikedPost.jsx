import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { useAuth } from '../context/auth';
import PostCard from '../components/PostCard';
import { useHelmet } from '../context/helmet';
import toast, {Toaster} from "react-hot-toast";

export default function LikedPost() {
  const [helmetObj, setHelmetObj] = useHelmet()
  useEffect(()=>{
      setHelmetObj((prev)=>({...prev, title: "Liked Posts | Socialize"}))
      return ()=>{setHelmetObj((prev)=>({...prev, title: "Socialize"}))}
  
  }, []);
    const [auth] = useAuth();
    let {
        data: getPostsData,
        isLoading: postIsloading,
        isError: postIsError,
        refetch: getPostRefetch,
      } = useQuery({
        queryKey: ["postData"],
        queryFn: async () => {
          let resp = await fetch(`http://localhost:3001/api/user/get-liked-post`, {
            method: "GET",
            headers: {
              authorization: auth.token,
              "Content-Type": "application/json",
            },
          });
    
          return resp.json();
        },
      });
      //console.log("getPostData: ", getPostsData);
      if(postIsError)  toast.error('Some Error has occurred.')

  return (
    <>
        <Toaster/>

    <h2>Liked Posts</h2>

    <div className="col-md-12">
      
     {/* Display posts here */}
    {postIsloading ? "Loading..." : null}
    {getPostsData &&
      getPostsData?.likedPosts?.map((e) => (
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
