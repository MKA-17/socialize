import React, { useEffect } from "react";
import { useHelmet } from "../context/helmet";
import { Link } from "react-router-dom";

export default function UnAuthorizedPage() {
    const [helmetObj, setHelmetObj] = useHelmet()
    useEffect(()=>{
        setHelmetObj((prev)=>({...prev, title: "UnAuthorized Access"}))
        return ()=>{setHelmetObj((prev)=>({...prev, title: "Socialize"}))}
    
    }, []);

  return (
    <div>
      <div className="container d-flex justify-content-center align-items-center  ">
        <div className="card p-4 shadow" style={{ maxWidth: 400 }}>
          <div className="card-body text-center">
            <h1 className="card-title">Unauthorized Access</h1>
            <p className="card-text">
              You do not have permission to access this page.
            </p>
            <Link to="/login" className="btn btn-primary">
              Login First
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
