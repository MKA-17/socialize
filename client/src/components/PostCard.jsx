import React, { useState } from "react";
import { useAuth } from "../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faImage,
  faHeart,
  faComment,
  faPaperPlane,
  faDeleteLeft,
  faEllipsisV,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { timeSince } from "../helpers/timeSince";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import toast, {Toaster} from "react-hot-toast";
import "../styles/postCard.css";

export default function PostCard({ postData, getPostRefetch }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [auth, setAuth] = useAuth();
  const [isLikeModal, setIsLikeModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [deletePostModal, setDeletePostModal] = useState(false);
  const [editPost, setEditPost] = useState({
    content: "",
    previous: true,
    image: "",
  });
  const [isCommentModal, setIsCommentModal] = useState(false);
  const [postComment, setPostComment] = useState("");

  const likePostMutation = useMutation({
    mutationFn: async (variables) => {
      return (
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/like-post/${variables.postId}/${variables.userId}`,
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
      // console.log("Inside likePost mutation: ", data, variables);
      if (data.success) {
        getPostRefetch();
      }
    },
    onError: (error, variables, context) => {
      console.log("error: ", error);
      toast.error('Some Error has been occurred')
    },
  });

  const sharePostMutation = useMutation({
    mutationFn: async (variables) => {
      return (
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/share-post/${variables.postId}`,
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
      // console.log("Inside sharePost mutation: ", data, variables);
      if (data.success) {
        getPostRefetch();
      }
    },
    onError: (error, variables, context) => {
      console.log("error: ", error);
      toast.error('Some Error has been occurred')
    },
  });

  const savePostMutation = useMutation({
    mutationFn: async (variables) => {
      return (
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/save-post/${variables.postId}/${variables.userId}`,
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
      // console.log("Inside savePost mutation: ", data, variables);
      if (data.success) {
        getPostRefetch();
        //savedPostRefetch();
      }
    },
    onError: (error, variables, context) => {
      console.log("error: ", error);
      toast.error('Some Error has been occurred')
    },
  });

  const editPostMutation = useMutation({
    mutationFn: async (variables) => {
      let dataForm = new FormData();
      Object.keys(variables.data).forEach((e) =>
        dataForm.append(e, variables.data[e])
      );

      return (
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/edit-post/${variables.postId}`,
          {
            method: "PUT",
            headers: {
              authorization: auth.token,
            },
            body: dataForm,
          }
        )
      ).json();
    },
    onSuccess: (data, variables, context) => {
      // console.log("Inside editPost mutation: ", data, variables);
      if (data.success) {
        getPostRefetch();
        setIsEditModal(false);
      }
    },
    onError: (error, variables, context) => {
      console.log("error: ", error);
      toast.error('Some Error has been occurred')
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (variables) => {
      return (
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/delete-post/${variables.postId}`,
          {
            method: "DELETE",
            headers: {
              authorization: auth.token,
            },
          }
        )
      ).json();
    },
    onSuccess: (data, variables, context) => {
      // console.log("Inside DeletePost mutation: ", data, variables);
      if (data.success) {
        getPostRefetch();
        toast.success('Post has been deleted')
        setDeletePostModal(false);
      }
    },
    onError: (error, variables, context) => {
      console.log("error: ", error);
      toast.error('Some Error has been occurred')
    },
  });

  const commentPostMutation = useMutation({
    mutationFn: async (variables) => {
      return (
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/comment-post/${variables.postId}/${variables.userId}`,
          {
            method: "PUT",
            headers: {
              authorization: auth.token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: variables.content }),
          }
        )
      ).json();
    },
    onSuccess: (data, variables, context) => {
      // console.log("Inside Comemnt mutation: ", data, variables);
      if (data.success) {
        setPostComment("");
        getPostRefetch();
      }
    },
    onError: (error, variables, context) => {
      console.log("error: ", error);
      toast.error('Some Error has been occurred')
    },
  });

  const deleteCommentPostMutation = useMutation({
    mutationFn: async (variables) => {
      return (
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/post/delete-comment-post/${variables.postId}/${variables.commentId}`,
          {
            method: "DELETE",
            headers: {
              authorization: auth.token,
            },
          }
        )
      ).json();
    },
    onSuccess: (data, variables, context) => {
      // console.log("Inside delete Comemnt mutation: ", data, variables);
      if (data.success) {
        toast.success('Comment has been deleted')
        getPostRefetch();
      }
    },
    onError: (error, variables, context) => {
      console.log("error: ", error);
      toast.error('Some Error has been occurred')
    },
  });

  const handleLike = (postId, userId) => {
    likePostMutation.mutate({ postId, userId });
  };

  const handleSave = (postId, userId) => {
    savePostMutation.mutate({ postId, userId });
  };

  const handleComment = (userId, postId) => {
    if (postComment.trim()) {
      // console.log("postComment: ", { content: postComment, userId, postId });
      commentPostMutation.mutate({ content: postComment, userId, postId });
    }
  };

  const handleCommentDelete = (postId, commentId) => {
    deleteCommentPostMutation.mutate({ postId, commentId });
  };

  const handleEditPostSubmit = (event) => {
    event.preventDefault();
    // if (editPost) {
      console.log("edit: ", editPost)
      editPostMutation.mutate({ postId: postData._id, data: editPost });
    // }
  };

  const handleDeletePost = () => {
    deletePostMutation.mutate({ postId: postData._id });
  };

  const handleShare = (postId) => {
    // console.log("ShareId: ", postId);
    if (postId) sharePostMutation.mutate({ postId });
  };

  const handleNavigate = (profileId) => {
    //console.log("navigate ids: ", profileId, auth?.user?.id)

    profileId === auth?.user?.id
      ? navigate(`/profile`)
      : navigate(`/user-profile/${profileId}`);
  };

  //console.log("postData: ", postData);

  return (
    <>
    <Toaster/>
      <div className="card mb-4">
        {/* Menu */}
        <div className="dropdown position-absolute top-0 end-0 m-1">
          <button
            className="btn"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FontAwesomeIcon icon={faEllipsisV} color="black" />
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            {postData.userId?._id === auth?.user?.id && (
              <>
                {!postData?.shared?.isShare && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setEditPost(() => ({
                          content: postData.content,
                          image: "",
                          previous: true,
                        }));
                        setIsEditModal(true);
                      }}
                    >
                      Edit
                    </button>
                  </li>
                )}
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setDeletePostModal(true);
                    }}
                  >
                    Delete
                  </button>
                </li>
              </>
            )}
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleSave(postData?._id, auth?.user?.id)}
              >
                Save/Unsave
                {/*                  
                {auth?.user?.savedPosts?.some(
                  (element) => element  === postData?._id
                )
                  ? "Unsave"
                  : "Save"} */}
              </button>
            </li>
          </ul>
        </div>
        {/* isShared */}
        {postData?.shared?.isShare && (
          <div className="card-header d-flex align-items-center">
            <div className="d-flex flex-column">
              <span className="mb-2">Shared from</span>
              <b
                onClick={() => handleNavigate(postData?.shared?.sharedFrom?.id)}
              >
                {postData?.shared?.sharedFrom?.name}
              </b>
            </div>
          </div>
        )}
        {/* isEdited */}

        {/* Edited information on the right */}
        {postData?.edited?.isEdit && (
          <div className="card-header d-flex justify-content-between align-items-center">
            <div className="d-flex flex-column text-end">
              <span className="mb-2 text-muted">
                Edited {timeSince(postData?.edited?.editedAt)}
              </span>
            </div>
          </div>
        )}

        {/* Card Header: User Profile Picture, Name, and Timestamp */}
        <div className="card-header d-flex align-items-center">
          <img
            src={`${import.meta.env.VITE_API_URL}/api/auth/get-image/${postData?.userId?._id}`}
            alt="User Profile"
            className="rounded-circle mr-2"
            style={{ width: "40px", height: "40px" }}
            onClick={() => handleNavigate(postData?.userId?._id)}
          />
          <div>
            <h6 className="mb-0">
              {postData?.userId?.firstName + " " + postData?.userId?.lastName}
            </h6>
            <p className="text-muted mb-0">{timeSince(postData?.createdAt)}</p>
          </div>
        </div>
        {/* Card Body: Post Content and Image (if any) */}
        <div className="card-body">
          <p className="post-content">
            {isExpanded ? postData?.content : postData?.content?.slice(0, 150)}
            {postData?.content?.length > 150 && (
              <button
                className="btn btn text-decoration-none text-muted"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "See Less" : "See More"}
              </button>
            )}
          </p>
          {postData?.isImage && (
            <img
              src={`${import.meta.env.VITE_API_URL}/api/post/get-image/${postData?._id}`}
              alt="Post Image"
              className="post-image img-fluid mb-3"
              style={{ maxWidth: '300px', maxHeight: '400px' }} 
             />
          )}
          {/* Like, Comment, and Share Buttons */}
          <div className="d-flex flex-wrap justify-content-between">
            <button
              className={`btn btn-thumbs-up`}
              onClick={() => handleLike(postData?._id, auth?.user?.id)}
            >
              <FontAwesomeIcon
                icon={faHeart}
                color={
                  postData?.likes?.some(
                    (element) => element._id === auth?.user?.id
                  )
                    ? "red"
                    : "gray"
                }
              />
              {postData?.likes?.some(
                (element) => element._id === auth?.user?.id
              )
                ? " Liked"
                : " Like"}
            </button>
            <button
              className="btn  btn-thumbs-up"
              onClick={() => {
                setIsCommentModal(true);
              }}
            >
              <FontAwesomeIcon icon={faComment} color="gray" /> comments
            </button>

            <button
              className="btn btn"
              onClick={() => {
                handleShare(postData?._id);
              }}
            >
              <FontAwesomeIcon icon={faShare} color="gray" /> Share
            </button>
            <button className="btn btn-link"></button>
          </div>
        </div>
        {/* Card Footer: Like, Comment, and Share Counts */}
        <div className="card-footer text-muted">
          <div
            onClick={() => {
              setIsLikeModal(true);
            }}
          >
            {postData?.likes?.length || 0} Likes
          </div>
          <div>{postData?.comments?.length || 0} Comments</div>
        </div>
      </div>

      {/* Modals */}
      {/* Like Modal */}

      <Modal
        title="Likes."
        open={isLikeModal}
        footer={null}
        onCancel={() => {
          setIsLikeModal(false);
        }}
      >
        {postData?.likes
          ? postData?.likes?.map((e, index) => (
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
                  <FontAwesomeIcon icon={faHeart} color={"red"} />
                </div>
              </div>
            ))
          : "No Likes."}
      </Modal>

      {/* Comment Box Modal */}
      <Modal
        title="Comment Box."
        open={isCommentModal}
        footer={null}
        onCancel={() => {
          setIsCommentModal(false);
        }}
      >
        <div
          className="container-fluid"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {postData?.comments?.length
            ? postData.comments.map((e) => (
                <div className="row mt-3" key={e._id}>
                  <div className=" ">
                    <div className="card">
                      <div className="card-body">
                        {e?.user?._id === auth?.user?.id && (
                          <div
                            className="btn position-absolute top-0 end-0 m-1"
                            onClick={() =>
                              handleCommentDelete(postData?._id, e?._id)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faDeleteLeft}
                              color={"red"}
                            />
                          </div>
                        )}

                        <div className="media ">
                          <img
                            src={`${import.meta.env.VITE_API_URL}/api/auth/get-image/${e?.user._id}`}
                            alt="User 2"
                            className="mr-3 rounded-circle"
                            style={{ width: 40, height: 40 }}
                            onClick={() => handleNavigate(e?.user?._id)}
                          />
                          {`${e?.user?.firstName} ${e?.user?.lastName}`}
                          <div className="media-body">
                            <span className="text-muted">
                               {timeSince(e?.time)}
                            </span>
                          </div>
                        </div>
                        <p>{e?.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : "No comments yet."}
        </div>
        {/* Add more comment instances as needed */}

        <div className="container mt-4">
          <div className="row">
            <div className="card">
              <div className="card-body d-flex align-items-start">
                <img
                  src={`${import.meta.env.VITE_API_URL}/api/auth/get-image/${auth?.user?.id}`}
                  alt="User Profile"
                  className="rounded-circle mr-2"
                  style={{ width: "40px", height: "40px" }}
                  onClick={() => navigate("/profile")}
                />

                <div className="flex-grow-1">
                  <textarea
                    className="form-control"
                    rows={1}
                    placeholder="Write a comment..."
                    id="commentInput"
                    onInput={(e) => autoResizeTextarea(e.target)}
                    value={postComment}
                    style={{ overflow: "hidden" }}
                    onChange={(event) =>
                      setPostComment(() => event.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  className="btn ms-2"
                  onClick={() => handleComment(auth?.user?.id, postData?._id)}
                >
                  <FontAwesomeIcon icon={faPaperPlane} color="blue" size="2x" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Post Modal */}

      <Modal
        title="Edit Post."
        open={isEditModal}
        footer={null}
        onCancel={() => {
          setIsEditModal(false);
        }}
      >
        <div className="container ">
          <div className="card">
            <div className="card-body">
              <form onSubmit={(event) => handleEditPostSubmit(event)}>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    id="postText"
                    rows={3}
                    placeholder="What's on your mind?"
                    value={editPost.content}
                    onChange={(e) =>
                      setEditPost((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                  />
                </div>
                <hr />
                <div className="form-group">
                  <label htmlFor="postImage">
                    Upload Image
                   </label>
                    <br />
                  <input
                    type="file"
                    className="form-control-file"
                    id="postImage"
                    onChange={(e) =>{
                      // console.log("newImage: ", e.target.files[0])
                      setEditPost((prev) => ({
                        ...prev,
                        image: e.target.files[0],
                        previous: false,
                      }))}
                    }
                    // style={{ display: "none" }}
                  />
                  <br />
                  {editPost.image && (
                    <div
                      onClick={(e) =>{
                        // console.log("remove image")
                        setEditPost((prev) => ({
                          ...prev,
                          image: "",
                          previous: false,
                        }))}
                      }
                    >
                      {/* {console.log("edit post data: ", editPost)} */}
                      <FontAwesomeIcon icon={faTimes} color="red" size="lg" />
                    </div>
                  )}
                  {editPost.image && (
                    
                    <img
                      src={URL.createObjectURL(editPost.image)}
                      alt="Post Image"
                      className="post-image img-fluid mb-3"
                      style={{ maxWidth: '300px', maxHeight: '200px' }}   
                   />
                  )}

                  {/* URL.createObjectURL(postData.image) || '' */}
                  {postData.isImage && !editPost.image && editPost.previous && (
                    <>
                      <div
                        onClick={() =>
                          
                          setEditPost((prev) => ({
                            ...prev,
                            image: "",
                            previous: false,
                          }))
                        }
                      >
                        <FontAwesomeIcon icon={faTimes} color="red" size="lg" />
                      </div>
                      <img
                        src={`${import.meta.env.VITE_API_URL}/api/post/get-image/${postData._id}`}
                        alt="Post Image"
                        className="post-image img-fluid mb-3"
                      />
                    </>
                  )}
                </div>
                <br />
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Post Modal */}

      <Modal
        title="Delete Post."
        open={deletePostModal}
        footer={null}
        onCancel={() => {
          setDeletePostModal(false);
        }}
      >
        <button className="btn btn-danger" onClick={handleDeletePost}>
          Delete Post
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            setDeletePostModal(false);
          }}
        >
          Cancel
        </button>
      </Modal>
    </>
  );
}

function autoResizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}
