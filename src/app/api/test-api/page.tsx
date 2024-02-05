"use client";
import axios from "axios";
import { FC, useEffect } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  useEffect(() => {
    const res = axios.post("/api/uploadthing");
    console.log(res);
  }, []);
  return <div>page</div>;
};

export default page;
