import React from 'react';

import dynamic from "next/dynamic";

const Client = dynamic(() => import("./client"), { ssr: false });


function Page() {
  return <Client />
}

// eslint-disable-next-line import/no-unused-modules
export default Page;