import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "@/components/nav";
import { useAccount } from "wagmi";
import Attest from "@/components";

export default function Home() {
  const { address } = useAccount();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (address) {
      setLoggedIn(true);
    } else {
      localStorage.removeItem("did");
    }
  }, [address]);

  return (
    <>
      <Head>
        <title>Event Attendance Demo</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      {!loggedIn && (
          <div className="flex min-h-screen min-w-full flex-col items-center justify-center">
            <h1 className="mt-6 text-center text-lg font-extrabold tracking-tight text-white sm:text-2xl md:text-5xl">
              Connect your wallet to get started
            </h1>
          </div>
        )}
        {loggedIn && (
          <h1 className="mt-6 text-center text-lg font-extrabold tracking-tight text-white sm:text-2xl md:text-5xl">
            Connected with{" "}
            <span className="text-[hsl(280,100%,70%)]">
              {" "}
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </h1>
        )}
        <div className="flex min-h-screen min-w-full flex-col items-center justify-start">
          {loggedIn && <Attest />}
        </div>
      </div>
    </>
  );
}
