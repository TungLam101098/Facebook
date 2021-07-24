import Header from "../../components/Header";
import HeaderUser from "../../components/HeaderUser";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import Posts from "../../components/Posts";
import { useEffect, useState } from "react";
import Login from "../../components/Login";
import Loading from "../../components/Loading";

function User({ uid }) {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const userRef = db.collection("users").doc(uid);
      const doc = await userRef.get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        setUserData(doc.data());
      }
    };
    getData();
  }, [uid]);
  if (loading) {
    return <Loading />
  }
  if (!user) return <Login />;
  return (
    <div>
      <Header user={user} />
      <main>
        <HeaderUser userData={userData} id={uid} />
        <div className="flex justify-center bg-gray-200">
          <div className="w-full sm:w-3/6">
            <Posts />
          </div>
        </div>
      </main>
    </div>
  );
}

export default User;

export async function getServerSideProps(context) {
  const uid = context.query.id;
  // Can get Data here
  return {
    props: {
      uid: uid,
    },
  };
}
