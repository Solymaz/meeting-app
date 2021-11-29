import React from "react";

export default function NotFound() {
  return (
    <article className="d-flex justify-content-center my-5">
      <img
        src={`${process.env.PUBLIC_URL}/404.png`}
        alt="page not found"
        className="img-fluid"
      />
    </article>
  );
}
