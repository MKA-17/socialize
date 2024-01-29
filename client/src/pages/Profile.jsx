import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { useAuth } from "../context/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import PostCard from "../components/PostCard";
import { Link, useNavigate } from "react-router-dom";
import { useHelmet } from "../context/helmet";
import toast, {Toaster} from "react-hot-toast";

export default function Profile() {
  const [helmetObj, setHelmetObj] = useHelmet();

  const [profileModal, setProfileModal] = useState(false);
  const [auth] = useAuth();
  const [userData, setUserData] = useState(null);
  const [isPasswordUpdate, setisPasswordUpdate] = useState(false);
  const [isFollowModal, setIsFollowModal] = useState(false);
  const [isFollowingModal, setIsFollowingModal] = useState(false);
  const navigate = useNavigate();
  let {
    data: profileData,
    isLoading: profileIsloading,
    isError: profileError,
    refetch: profileRefetch,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      let resp = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/get-user/${auth?.user?.id}`,
        {
          method: "GET",
          headers: {
            authorization: auth.token,
            "Content-Type": "application/json",
          },
        }
      );

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
      let resp = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/get-post-user/${auth?.user?.id}`,
        {
          method: "GET",
          headers: {
            authorization: auth.token,
            "Content-Type": "application/json",
          },
        }
      );

      return resp.json();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (variables) => {
      let dataForm = new FormData();
      Object.keys(variables).forEach((e) => dataForm.append(e, variables[e]));

      return (
        await fetch(`${import.meta.env.VITE_API_URL}/api/user/update-user`, {
          method: "PUT",
          headers: {
            authorization: auth.token,
          },
          body: dataForm,
        })
      ).json();
    },
    onSuccess: (data, variables, context) => {
      // console.log("Inside userUpdate mutation: ", data, variables);
      if (data.success) {
        //toast.success(data.message)
        profileRefetch();
        setProfileModal(false);
        //navigate("/dashboard/admin/products-list")
      }
      //if(data.success === false)   toast.error(data.message)
    },
    onError: (error, variables, context) => {
      // console.log("error: ", error);
      toast.error('Some Error has been occurred')
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    // console.log(userData);
    updateUserMutation.mutate(userData);
    //setProfileModal(false);
  };

  const handleModal = () => {
    setUserData(() => {
      const { followers, following, ...data } = profileData?.userDetails;
      return data;
    });
    setProfileModal(true);
  };

  const handleNavigate = (profileId) => {
    //console.log("navigate ids: ", profileId, auth?.user?.id)

    profileId === auth?.user?.id
      ? navigate(`/profile`)
      : navigate(`/user-profile/${profileId}`);
  };
  //console.log("getPostData: ", getPostData)
  useEffect(() => {
    setHelmetObj((prev) => ({ ...prev, title: "Profile | Socialize" }));
    return () => {
      setHelmetObj((prev) => ({ ...prev, title: "Socialize" }));
    };
  }, []);

  if(postIsError || profileError)  toast.error('Some Error has occurred.')

  if (profileIsloading) return <h1>Loading...</h1>;

  return (
    <>
    <Toaster/>
      {profileData?.success && (
        <div>
          <nav className="navbar navbar-expand-md bg-primary navbar-dark">
             
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#profileNavbar"
              aria-controls="profileNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="profileNavbar">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/saved-posts">
                    Saved Posts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/liked-posts">
                    Liked Posts
                  </Link>
                </li>
              </ul>
            </div>
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
                <div onClick={() => setIsFollowModal(true)}>
                  Followers: {profileData?.userDetails?.followers?.length}{" "}
                </div>
                <div onClick={() => setIsFollowingModal(true)}>
                  Following: {profileData?.userDetails?.following?.length}{" "}
                </div>
                <br />
                {/* Edit Profile Button */}
                {profileData?.userDetails?.firstName &&
                  profileData?.userDetails?.lastName &&
                  profileData?.userDetails?.occupation &&
                  profileData?.userDetails?.location && (
                    <button className="btn btn-primary" onClick={handleModal}>
                      Edit Profile
                    </button>
                  )}
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
                {getPostData?.post?.length
                  ? getPostData?.post?.map((e) => (
                      <PostCard
                        key={e._id}
                        postData={e}
                        getPostRefetch={getPostRefetch}
                      />
                    ))
                  : "No Posts."}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      <Modal
        title="Edit Profile."
        open={profileModal}
        footer={null}
        onCancel={() => {
          setProfileModal(false);
        }}
      >
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            {typeof userData?.newImage === "object" ? (
              <img
                src={URL.createObjectURL(userData.newImage)}
                alt="User DP"
                className="img-thumbnail mb-1"
                style={{ width: "220px" }}
              />
            ) : (
              <img
                src={`${import.meta.env.VITE_API_URL}/api/auth/get-image/${profileData?.userDetails?.id}`}
                alt="User DP"
                className="img-thumbnail mb-1"
                style={{ width: "220px" }}
              />
            )}
            <br />
            <label htmlFor="postImage">
              Change DP.
              <br />
              <FontAwesomeIcon icon={faImage} color="yellow" size="2x" />
            </label>
            <input
              type="file"
              className="form-control-file"
              id="postImage"
              onChange={(e) => {
                // console.log(e.target.files[0]);
                setUserData((prev) => ({
                  ...prev,
                  newImage: e.target.files[0],
                }));
              }}
              style={{ display: "none" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              required
              value={userData?.firstName}
              onChange={(e) => {
                setUserData((prev) => ({ ...prev, firstName: e.target.value }));
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              required
              value={userData?.lastName}
              onChange={(e) => {
                setUserData((prev) => ({ ...prev, lastName: e.target.value }));
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="occupation">Occupation</label>
            <input
              type="text"
              className="form-control"
              id="occupation"
              required
              value={userData?.occupation}
              onChange={(e) => {
                setUserData((prev) => ({
                  ...prev,
                  occupation: e.target.value,
                }));
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              className="form-control"
              id="location"
              required
              value={userData?.location}
              onChange={(e) => {
                setUserData((prev) => ({ ...prev, location: e.target.value }));
              }}
            />
          </div>

          {isPasswordUpdate ? (
            <>
              <div className="form-group">
                <label htmlFor="previousPassword">Previous Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="previousPassword"
                  required
                  onChange={(e) => {
                    setUserData((prev) => ({
                      ...prev,
                      previousPassword: e.target.value.trim(),
                    }));
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  required
                  onChange={(e) => {
                    setUserData((prev) => ({
                      ...prev,
                      newPassword: e.target.value.trim(),
                    }));
                  }}
                />
              </div>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setisPasswordUpdate((prev) => !prev)}
            >
              Change Password
            </button>
          )}
          <hr />
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </form>
      </Modal>

      {/* Followers Modal */}
      <Modal
        title="Followers."
        open={isFollowModal}
        footer={null}
        onCancel={() => {
          setIsFollowModal(false);
        }}
      >
        {profileData?.userDetails?.followers
          ? profileData.userDetails.followers?.map((e, index) => (
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
                    // console.log("liked id: ", e._id);
                    handleNavigate(e._id);
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
          ? profileData.userDetails.following?.map((e, index) => (
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
                    // console.log("liked id: ", e._id);
                    handleNavigate(e._id);
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
