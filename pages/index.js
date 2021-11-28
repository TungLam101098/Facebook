import Head from "next/head";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Login from "../components/Login";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Loading from "../components/Loading";
import CallNotification from "../components/CallNotification";
import { useEffect, useState } from "react";
import Admin from "../components/Admin";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isActive, setIsActive] = useState(false);

  if (loading) return <Loading />;
  if (!user) return <Login />;
  
  if (user) {
    const getData = async () => {
      const userRef = db.collection("users").doc(user.uid);
      const doc = await userRef.get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        if (doc.data().isActive) {
          setIsActive(true);
          if (doc.data().isAdmin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsActive(false);
          alert("Tài khoản của bạn đã bị khoá!!!");
        }
      }
    };
    getData();  
  }
    
  return (
    <>
    {
      isActive ? (
        <>
          {
        isAdmin && (
        <>
          <Header user={user} />
          <Admin />
        </>
      ) 
    }
    {
      !isAdmin && (
        <div className="h-screen bg-gray-100 overflow-hidden relative">
        <CallNotification user={user} />
        <Head>
          <title>Facebook</title>
        </Head>
        <Header user={user} />
        <main className="flex">
          <Sidebar />
          <Feed user={user} />
          <Widgets user={user} />
        </main>
      </div>
      )
    }
        </>
      ) : (
        <Login />
      )
    }
    </>
  );
}
