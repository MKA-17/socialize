import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Modal } from "antd";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function SearchModal({ isSearchModal, setIsSearchModal }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [auth] = useAuth();
  const navigate = useNavigate();

  const searchUserMutation = useMutation({
    mutationFn: async (variables) => {
      return (
        await fetch(`http://localhost:3001/api/user/find-user`, {
          method: "POST",
          headers: {
            authorization: auth.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(variables),
        })
      ).json();
    },
    onSuccess: (data, variables, context) => {
      console.log("Inside SearchQuery mutation: ", data, variables);
      if (data.success && data?.userDetails) {
        setSearchList(data.userDetails);
      }
    },
    onError: (error, variables, context) => {
      console.log("error: ", error);
      toast.error("Some Error has been occurred");
    },
  });

  const handleSearch = () => {
    console.log("search: ", searchQuery);
    if (searchQuery.trim()) searchUserMutation.mutate({ searchQuery });
  };

  const handleNavigate = (profileId) => {
    console.log("navigate ids: ", profileId, auth?.user?.id);

    profileId === auth?.user?.id
      ? navigate(`/profile`)
      : navigate(`/user-profile/${profileId}`);
    setIsSearchModal(false);
  };

  return (
    <div>
      <Toaster />

      <Modal
        title="Search User."
        open={isSearchModal}
        footer={null}
        onCancel={() => {
          setIsSearchModal(false);
        }}
      >
        <div className="card-body d-flex align-items-start">
          <div className="flex-grow-1">
            <input
              className="form-control"
              placeholder="Write a comment..."
              id="searchInput"
              value={searchQuery}
              style={{ overflow: "hidden" }}
              onChange={(event) => {
                //if(event.target.value.trim()) searchUserMutation.mutate({searchQuery: event.target.value})
                setSearchQuery(() => event.target.value);
              }}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary ms-2"
            onClick={handleSearch}
          >
            <FontAwesomeIcon icon={faSearch} color="white" />
          </button>
        </div>
        {searchList?.length
          ? searchList?.map((e, index) => (
              <div
                className="card-header d-flex align-items-center"
                key={e._id}
              >
                <img
                  src={`http://localhost:3001/api/auth/get-image/${e._id}`}
                  alt="User Profile"
                  className="rounded-circle mr-2"
                  style={{ width: "40px", height: "40px" }}
                  onClick={() => {
                    console.log("liked id: ", e._id);
                    handleNavigate(e._id);
                  }}
                />
                <div className="d-flex justify-content-between">
                  <h6 className="mb-0">{e?.firstName + " " + e?.lastName}</h6>
                </div>
              </div>
            ))
          : " "}
      </Modal>
    </div>
  );
}
