import React, { useState } from "react";
import { useAuth } from "../context/auth";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import SearchModal from "./SearchModal";
import toast, { Toaster } from "react-hot-toast";

export default function Navbar() {
  const [auth, setAuth] = useAuth();
  const [isSearchModal, setIsSearchModal] = useState(false);

  const handleLogout = () => {
    window.localStorage.removeItem("auth");
    setAuth((prev) => ({ token: "", user: "" }));
    toast.success("Logging out...");
  };

  return (
    <>
      <Toaster />

      <nav className="navbar  navbar-expand-md bg-primary navbar-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <b>Socialize</b>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              {auth.token ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      Profile
                    </Link>
                  </li>
                </>
              ) : null}

              <li className="nav-item">
                {auth.token ? (
                  <Link className="nav-link" to="/login" onClick={handleLogout}>
                    Logout
                  </Link>
                ) : (
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                )}
              </li>
              {!auth.token && (
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
        </div>
      </nav>
      <nav className="navbar  navbar-expand-md bg-primary navbar-dark">
<div className="container">
 
{auth.token ? (
   <div className="card-body d-flex align-items-start"
   onClick={() => setIsSearchModal(true)}  

   >
   <div className="flex-grow-1">
     <input
       className="form-control"
        id="searchInput"
  placeholder="Search people"        
     />
   </div>
   <button
     type="button"
     className="btn btn-primary ms-2"
      >
     <FontAwesomeIcon icon={faSearch} color="white" />
   </button>
 </div>
          ) : null}
 
  
</div>
</nav>
      <SearchModal
        isSearchModal={isSearchModal}
        setIsSearchModal={setIsSearchModal}
      />
    </>
  );
}
