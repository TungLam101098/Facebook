import Header from "../../components/Header";
import HeaderUser from "../../components/HeaderUser";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

function User({ uid }) {
  const [user] = useAuthState(auth);
  if (!user) return null;
  // console.log(uid);
  return (
    <div>
      <Header user={user} />
      <main>
      <HeaderUser />
      </main>
    </div>
  );
}

export default User;

// export async function getServerSideProps(context) {
//   const uid = context.query.id;
//   // Can get Data here
//   return {
//     props: {
//       uid: uid,
//     },
//   };
// }
