import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Post from "./Post";

const Posts = ({ posts, uid }) => {
  const [realtimePosts] = useCollection(
    db.collection("users").doc(uid).collection('posts').orderBy("timestamp", "desc")
  );

  if (!realtimePosts) return null;
  
  return (
    <div>
      {
        realtimePosts && (realtimePosts.docs.map((post) => (
          <Post
            key={post.id}
            name={post.data().name}
            message={post.data().message}
            email={post.data().email}
            timestamp = {post.data().timestamp}
            image={post.data().image}
            postImage={post.data().postImage}
            comments={post.data().comments}
            likes={post.data().likes}
            shares={post.data().shares}
          />
        ))) 
      }
    </div>
  );
};

export default Posts;
