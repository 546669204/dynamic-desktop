import dynamic from "next/dynamic";
import React from "react";

const Client = dynamic(() => import("./client"), { ssr: false });


const Page = () => {
  return <Client></Client>
}

export default Page;