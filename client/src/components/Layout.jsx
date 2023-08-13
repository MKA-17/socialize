import React from "react";
import Navbar from "./Navbar";
import { Helmet } from "react-helmet";
import { useHelmet } from "../context/helmet";

export default function Layout({ children }) {
  const [helmetObj] = useHelmet();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={helmetObj.description} />
        <meta name="keywords" content={helmetObj.keywords} />
        <meta name="author" content={helmetObj.author} />
        <title>{helmetObj.title}</title>
      </Helmet>
      <Navbar />
      <div className="container mt-4">
        <div className="row">{children}</div>
      </div>
    </>
  );
}
