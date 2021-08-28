import Head from "next/head";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Login from "../components/Login";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Loading from "../components/Loading";
import CallNotification from "../components/CallNotification";

export default function Home() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return (
    <>
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
    </>
  );
}
