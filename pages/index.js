import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { getSession, signOut, useSession } from 'next-auth/react'

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const { data: session } = useSession()

  function handleSignOut(){
    signOut()
  }


  return (
    <div>
      <Head>
        <title>Home page</title>
      </Head>
      {session ? AuthUser({ session, handleSignOut }) : Guest()}
    </div>
  );
}
//Guest User  
function Guest() {
  return (
    <main className="container mx-auto text-center py-20">
      <h3 className="text-4xl font-bold">Guest Homepage</h3>
      <div className="flex justify-center">
        <Link href={'/login'} className="mt-5 px-10 py-1 rounded-sm bg-amber-800 text-gray-200">Sign In</Link>
      </div>

    </main>
  )
}

//Authorized user
function AuthUser({ session, handleSignOut }) {
  return (
    <main className="container mx-auto text-center py-20">
      <h3 className="text-4xl font-bold">Authorized User homepage</h3>

      <div className="details">
        <h5>{session.user.name}</h5>
        <h5>{session.user.email}</h5>
      </div>

      <div className="flex justify-center">
        <button onClick={handleSignOut} className="mt-5 px-10 py-1 rounded-sm bg-emerald-600">
          Sign Out
        </button>
      </div>
      <div className="flex justify-center">
        <Link href={'/profile'} className="mt-5 px-10 py-1 rounded-sm bg-amber-800 text-gray-200">Profile Page</Link>
      </div>

    </main>
  )
}

export async function getServerSideProps({req}){
  const session = await getSession({req})


  if(!session){
    return{
      redirect:{
        destination:'/login',
        permanent:false
      }
    }
  }

  return{
    props:{session}
  }
}