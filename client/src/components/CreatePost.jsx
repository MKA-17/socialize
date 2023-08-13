import React, { useState } from "react";
import { useAuth } from "../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faTimes,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function CreatePost({ getPostRefetch }) {
  const [auth] = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Toaster />

      <div className="container ">
        <div className="card ">
          <div className="card-header d-flex align-items-center">
            <img
              src={`http://localhost:3001/api/auth/get-image/${auth?.user?.id}`}
              alt="User Profile"
              className="rounded-circle mr-2"
              style={{ width: "40px", height: "40px" }}
              onClick={() => navigate("/profile")}
            />

            {auth?.user?.name}
          </div>
          <div className="card-body">
            <form>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="postText"
                  placeholder="What's on your mind?"
                  defaultValue={""}
                  onClick={() => setIsModalOpen((prev) => !prev)}
                />
              </div>
              <hr />
            </form>
          </div>
        </div>
        <CreatePostModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          getPostRefetch={getPostRefetch}
        />
      </div>
    </>
  );
}

const CreatePostModal = ({ isModalOpen, setIsModalOpen, getPostRefetch }) => {
  const [auth] = useAuth();
  const [postData, setPostData] = useState({
    content: "",
    image: "",
    userId: auth?.user?.id,
  });

  const createPostMutation = useMutation({
    mutationFn: async (variables) => {
      let dataform = new FormData();
      Object.keys(variables).forEach((e) => dataform.append(e, variables[e]));
      console.log("productdata: ", dataform);

      return (
        await fetch(`http://localhost:3001/api/post/create-post`, {
          method: "POST",
          headers: {
            authorization: auth.token,
          },
          body: dataform,
        })
      ).json();
    },
    onSuccess: (data, variables, context) => {
      console.log("Inside create post mutation: ", data, variables);
      if (data.success) {
        setIsModalOpen(false);
        setPostData({
          content: "",
          image: "",
          userId: auth?.user?.id,
        });
        getPostRefetch();
        //toast.success(data.message)
      }
    },
    onError: (error, variables, context) => {
      console.log("error: ", error);
      toast.error("Some Error has been occurred");
    },
  });

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (postData.content.trim() || postData.image)
      createPostMutation.mutate(postData);
    console.log("postData: ", postData);
  };

  const ClipboardReader = async () => {
    try {
      const textFromClipboard = await navigator.clipboard.readText();
      setPostData((prev) => ({
        ...prev,
        content: textFromClipboard,
      }));
    } catch (error) {
      console.error("Error reading text from clipboard:", error);
    }
  };

  return (
    <Modal
      title="Create Post."
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        setIsModalOpen(false);
      }}
    >
      <div className="container ">
        <div className="card">
          <div className="card-header">
            <img
              src={`http://localhost:3001/api/auth/get-image/${auth?.user?.id}`}
              alt="User Profile"
              className="rounded-circle mr-2"
              style={{ width: "40px", height: "40px" }}
            />

            {auth?.user?.name}
          </div>
          <div className="card-body">
            <form onSubmit={handlePostSubmit}>
              <div className="form-group">
                <textarea
                  className="form-control"
                  id="postText"
                  rows={3}
                  placeholder="What's on your mind?"
                  value={postData.content}
                  onChange={(e) =>
                    setPostData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                />
              </div>
              <div onClick={ClipboardReader}>
                <FontAwesomeIcon icon={faClipboard} color="red" size="lg" />
              </div>
              <hr />
              <div className="form-group">
                <label htmlFor="postImage">
                  Upload Image
                  <br />
                  <FontAwesomeIcon icon={faImage} color="yellow" size="2x" />
                </label>
                <input
                  type="file"
                  className="form-control-file"
                  id="postImage"
                  onChange={(e) =>
                    setPostData((prev) => ({
                      ...prev,
                      image: e.target.files[0],
                    }))
                  }
                  style={{ display: "none" }}
                />
                <br />
                {postData.image && (
                  <>
                    <div
                      onClick={() =>
                        setPostData((prev) => ({ ...prev, image: "" }))
                      }
                    >
                      <FontAwesomeIcon icon={faTimes} color="red" size="lg" />
                    </div>
                    <img
                      src={URL.createObjectURL(postData.image) || ""}
                      alt="Post Image"
                      className="post-image img-fluid mb-3"
                    />
                  </>
                )}
              </div>

              <button type="submit" className="btn btn-primary">
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
