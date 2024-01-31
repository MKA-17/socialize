import React, { useEffect, useId, useState } from "react";
import { Button, Modal } from "antd";
import { useAuth } from "../context/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import PostCard from "../components/PostCard";
import { useNavigate, useParams } from "react-router-dom";
import { useHelmet } from "../context/helmet";
import toast, {Toaster} from "react-hot-toast";


export default function Profile() {
  const [helmetObj, setHelmetObj] = useHelmet()

  const {userId} = useParams();
  const navigate = useNavigate()
  const [isFollowModal, setIsFollowModal] = useState(false);
  const [isFollowingModal, setIsFollowingModal] = useState(false);
  const [auth] = useAuth();
  

 
  let {
    data: profileData,
    isLoading: profileIsloading,
    isError: profileError,
    refetch: profileRefetch,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      let resp = await fetch(`${import.meta.env.VITE_API_URL}/api/user/get-user/${userId}`, {
        method: "GET",
        headers: {
          authorization: auth.token,
          "Content-Type": "application/json",
        },
      });

      return resp.json();
    },
  });

  let {
    data: getPostData,
    isLoading: postIsloading,
    isError: postIsError,
    refetch: getPostRefetch,
  } = useQuery({
    queryKey: ["postData"],
    queryFn: async () => {
      let resp = await fetch(`${import.meta.env.VITE_API_URL}/api/user/get-post-user/${userId}`, {
        method: "GET",
        headers: {
          authorization: auth.token,
          "Content-Type": "application/json",
        },
      });

      return resp.json();
    },
  });

  const followUserMutation = useMutation({
    mutationFn: async (variables) => {
      return (
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/follow-user/${variables.followId}`,
          {
            method: "PUT",
            headers: {
              authorization: auth.token,
            },
          }
        )
      ).json();
    },
    onSuccess: (data, variables, context) => {
      // console.log("Inside follow user mutation: ", data, variables);
      if (data.success) {
        //getPostRefetch();
        profileRefetch();
      }
    },
    onError: (error, variables, context) => {
      // console.log("error: ", error);
      //toast.error('Some Error has been occurred')
    },
  });


  const handleFollow = (followId)=>{
    // console.log("followId :", followId)
    if(followId) followUserMutation.mutate({followId});
  }

  const handleNavigate = (profileId) => {
    // console.log("navigate ids: ", profileId, auth?.user?.id)
   
    profileId === auth?.user?.id
      ? navigate(`/profile`)
      : navigate(`/user-profile/${profileId}`);
  };

 
 
  // console.log("getProfileData: ", profileData)
    useEffect(()=>{
      setHelmetObj((prev)=>({...prev, title: "Profile | Socialize"}))
      return ()=>{setHelmetObj((prev)=>({...prev, title: "Socialize"}))}
  
  }, []);

  if(postIsError || profileError)  toast.error('Some Error has occurred.')


  if (profileIsloading) return <h3>Loading...</h3>;


  return (
    <>
    <Toaster/>  
      {profileData?.success && (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <h1>Profile Page</h1>
          </nav>
          {/* User Profile Section */}
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-4 offset-md-4 text-center">
                {/* User DP */}
                <img
                  src={`${import.meta.env.VITE_API_URL}/api/auth/get-image/${profileData?.userDetails?.id}`}
                  alt="User DP"
                  className="img-thumbnail mb-3"
                  style={{ maxWidth: '300px', maxHeight: '400px' }} 

                />
                {/* User Name */}
                <h3>
                  {profileData?.userDetails?.firstName +
                    " " +
                    profileData?.userDetails?.lastName}
                </h3>
                {/* User Occupation */}
                <p>Occupation: {profileData?.userDetails?.occupation}</p>
                {/* User Residence */}
                <p>Residence: {profileData?.userDetails?.location}</p>
                {/* User Followers and Following */}
                
                 <div 
                 onClick={()=>setIsFollowModal(true)}
                 > 
                 Followers: {profileData?.userDetails?.followers?.length} </div>
                 <div 
                 onClick={()=>setIsFollowingModal(true)}
                 >Following: {profileData?.userDetails?.following?.length} </div> 
               <br />
                  
              <button className="btn btn-primary" 
              onClick={()=>handleFollow(profileData?.userDetails?.id)}
              >
                {
                  profileData?.userDetails?.followers?.some(element => element._id === auth?.user?.id) ?
                  "Following"
                  : "Follow"
                }
                 
              </button>
              </div>
            </div>
          </div>
          <hr />
          <h2>Your Posts</h2>
          {/* User Posts Section */}
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                {/* List of Posts */}
                {/* Display posts here */}
                {postIsloading ? "Loading..." : null}
                {getPostData?.post?.length ?
                  getPostData?.post?.map((e) => (
                    <PostCard
                      key={e._id}
                      postData={e}
                      getPostRefetch={getPostRefetch}
                    />
                  ))
                : "No posts."
                }
              </div>
            </div>
          </div>
        </div>
      )}

  {/*Followers  */}
      <Modal
        title="Followers."
        open={isFollowModal}
        footer={null}
        onCancel={() => {
          setIsFollowModal(false);
        }}
      >
        {profileData?.userDetails?.followers
          ? 
          profileData.userDetails.followers?.map((e, index) => (
              <div
                className="card-header d-flex align-items-center"
                key={e._id}
              >
                  <img
                  src={`${import.meta.env.VITE_API_URL}/api/auth/get-image/${e._id}`}
                  alt="User Profile"
                  className="rounded-circle mr-2"
                  style={{ width: "40px", height: "40px" }}
                  onClick={() => {
                    // console.log("liked id: ", e._id)
                    handleNavigate(e._id)
                  }}
                />
                 <div className="d-flex justify-content-between">
                  <h6 className="mb-0">{e?.firstName + " " + e?.lastName}</h6>
                 </div>
              </div>
            ))
          : "No Follower."}
      </Modal>
    

  {/*Following  */}
  <Modal
  title="Following."
  open={isFollowingModal}
  footer={null}
  onCancel={() => {
    setIsFollowingModal(false);
  }}
>
  {profileData?.userDetails?.following
    ? 
    profileData.userDetails.following?.map((e, index) => (
        <div
          className="card-header d-flex align-items-center"
          key={e._id}
        >
            <img
            src={`${import.meta.env.VITE_API_URL}/api/auth/get-image/${e._id}`}
            alt="User Profile"
            className="rounded-circle mr-2"
            style={{ width: "40px", height: "40px" }}
            onClick={() => {
              // console.log("liked id: ", e._id)
              handleNavigate(e._id)
            }}
          />
           <div className="d-flex justify-content-between">
            <h6 className="mb-0">{e?.firstName + " " + e?.lastName}</h6>
           </div>
        </div>
      ))
    : "Not following anyone."}
</Modal>
</>
  );
}
