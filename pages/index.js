import Head from "next/head";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Login from "../components/Login";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Loading from "../components/Loading";

export default function Home() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <Head>
        <title>Facebook</title>
      </Head>
      <Header user={user} />
      <main className="flex">
        {/* Sidebar */}
        <Sidebar />
        <Feed user={user} />
        {/* Widgets */}
        <Widgets />
      </main>
    </div>
  );
}

