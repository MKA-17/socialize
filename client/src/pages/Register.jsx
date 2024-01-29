import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faImage,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useHelmet } from "../context/helmet";
import toast, {Toaster} from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const [helmetObj, setHelmetObj] = useHelmet();
const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    image: "",
    occupation: "",
    location: "",
  });

  const registerMutation = useMutation({
    mutationFn: async (variables) => {
      let dataform = new FormData();
      Object.keys(variables).forEach((e) => dataform.append(e, variables[e]));
      // console.log("productdata: ", dataform);

      return (
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
          method: "POST",
          body: dataform,
        })
      ).json();
    },
    onSuccess: (data, variables, context) => {
      // console.log("Inside registerForm mutation: ", data, variables);
      if (data.success) {
        toast.success(data.message)
        //navigate("/login")
      }
      if(data.success === false)   toast.error(data.message)
    },
    onError: (error, variables, context) => {
      // console.log("error: ", error);
      toast.error('Some Error has been occurred')
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    // console.log(formData);
    registerMutation.mutate(formData);
  };

  useEffect(() => {
    setHelmetObj((prev) => ({ ...prev, title: "Register | Socialize" }));
    return () => {
      setHelmetObj((prev) => ({ ...prev, title: "Socialize" }));
    };
  }, []);

  return (
    <>
    <Toaster/>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            required
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                firstName: e.target.value.trim(),
              }));
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
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                lastName: e.target.value.trim(),
              }));
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            required
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                email: e.target.value.trim(),
              }));
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
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                occupation: e.target.value.trim(),
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
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                location: e.target.value.trim(),
              }));
            }}
          />
        </div>
        <br />
        <div className="form-group">
          <label
            htmlFor="postImage"
            //   onClick={handleImageUploadClick}
          >
            Profile Photo
            <br />
            <FontAwesomeIcon icon={faImage} color="yellow" size="2x" />
          </label>
          <input
            type="file"
            className="form-control-file"
            id="postImage"
            onChange={(e) => {
              // console.log(e.target.files[0]);
              setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
            }}
            style={{ display: "none" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                password: e.target.value.trim(),
              }));
            }}
          />
        </div>
        <br />
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </>
  );
}
