import React from "react";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/auth";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [auth] = useAuth();
  // const [helmetObj, setHelmetObj] = useHelmet()
  //   useEffect(()=>{
  //       setHelmetObj((prev)=>({...prev, title: "About us E-Commerce App"}))
  //       return ()=>{setHelmetObj((prev)=>({...prev, title: "Socialize"}))}

  //   }, []);

  let {
    data: getPostsData,
    isLoading,
    isError,
    refetch: getPostRefetch,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      let resp = await fetch(`http://localhost:3001/api/post/get-post`, {
        method: "GET",
        headers: {
          authorization: auth.token,
          "Content-Type": "application/json",
        },
      });

      return resp.json();
    },
  });

  if (isError) toast.error("Some Error has occurred.");

  return (
    <>
      <Toaster />
      <div className="col-md-12">
        {/* Main content area */}
        <div className="card-body">
          {/* Add post form here */}
          {/* <form>
              <div className="form-group">
                <textarea className="form-control" placeholder="Write something..." defaultValue={""} />
              </div>
              <button type="submit" className="btn btn-primary">Post</button>
            </form> */}

          <CreatePost getPostRefetch={getPostRefetch} />
        </div>
        <div className="card mb-3"></div>
        {/* Display posts here */}
        {isLoading ? "Loading..." : null}
        {getPostsData &&
          getPostsData?.post?.map((e) => (
            <PostCard
              key={e._id}
              postData={e}
              getPostRefetch={getPostRefetch}
            />
          ))}
      </div>
    </>
  );
}
