import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, useAuth } from "../../../firebase";
import Navbar from "../../NavBar/navBar";
import Article from "../Postari/Article/Article";
import "./favorite.css";

const Favorite = () => {
  const [postsCollectionRef, setPostsCollectionRef] = useState(
    collection(db, "posts")
  );
  const [userCData, setUserCData] = useState();
  const [posts, setPosts] = useState();
  const [postsL, setPostsL] = useState();
  const user = useAuth();
  const [postsA, setPostsA] = useState();

  const getUserData = async () => {
    if (user) {
      console.log("User data");
      const uid = user.uid;
      const userCollectionRef = doc(db, "users", uid);
      const docSnap = await getDoc(userCollectionRef);
      if (docSnap.exists()) {
        setUserCData(docSnap.data());
        // console.log(docSnap.data());
      } else {
        console.log("Error docSnap");
      }
    }
  };
  useEffect(() => {
    getUserData();
  }, [user]);

  useEffect(() => {
    const getPosts = async () => {
      //   const data = await getDocs(postsCollectionRef);
      const data = await getDocs(postsCollectionRef);
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setPostsL(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, []);
  useEffect(() => {
    if (userCData && posts) {
      const filteredPosts = async () => {
        const upvotedUser = userCData.upvoted;
        const saved = userCData.saved;
        const sortedPostsA = posts.filter((post) => {
          const bookd = saved.includes(post.id);
          return bookd;
        });
        setPostsA(sortedPostsA);

        const sortedPosts = posts.filter((post) => {
          const bookd = upvotedUser.includes(post.id);
          return bookd;
        });
        setPostsL(sortedPosts);
      };
      // console.log("AAAA");
      filteredPosts();
    } else {
      // console.log("PPPP");
    }
  }, [userCData, posts]);

  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <Navbar backgroundColor="black" />
      <h2 style={{ position: "absolute", top: "220px", left: "8%" }}>Liked</h2>
      <div className="favorite-pg-postari">
        {postsL &&
          userCData &&
          postsL.map((post) => {
            const date = post.data.seconds * 1000;
            const finalDate = new Date(date);
            const upvotedUser = userCData.upvoted;
            const downvotedUser = userCData.downvoted;
            // console.log(upvotedUser);
            const liked = upvotedUser.includes(post.id);
            const unliked = downvotedUser.includes(post.id);
            // console.log("FRESH");
            // // console.log(`liked ${liked} unliked ${unliked}`);

            // console.log(
            //   `postID: ${post.id}, liked ${liked}, unliked ${unliked}`
            // );

            const savedArray = userCData.saved;
            const isSaved = savedArray.includes(post.id);
            // console.log(isSaved);
            // console.log(finalDate.toLocaleString());
            return (
              <Article
                key={post.id}
                imgUrl={post.urls[0]}
                date={finalDate.toLocaleString()}
                titlu={post.titlu}
                categorie={post.tproblema}
                status={post.status}
                id={post.id}
                upvoted={liked}
                downvoted={unliked}
                upvotes={post.upvotes}
                downvotes={post.downvotes}
                userid={user.uid}
                upvotedUser={userCData.upvoted}
                downvotedUser={userCData.downvoted}
                saved={isSaved}
                savedArray={savedArray}
              />
            );
          })}
      </div>
      <h2 style={{ position: "relative", top: "290px", left: "-37%" }}>
        Bookmarked
      </h2>
      <div className="favorite-pg-postari">
        {postsA &&
          userCData &&
          postsA.map((post) => {
            const date = post.data.seconds * 1000;
            const finalDate = new Date(date);
            const upvotedUser = userCData.upvoted;
            const downvotedUser = userCData.downvoted;
            // console.log(upvotedUser);
            const liked = upvotedUser.includes(post.id);
            const unliked = downvotedUser.includes(post.id);
            // console.log("FRESH");
            // // console.log(`liked ${liked} unliked ${unliked}`);

            // console.log(
            //   `postID: ${post.id}, liked ${liked}, unliked ${unliked}`
            // );

            const savedArray = userCData.saved;
            const isSaved = savedArray.includes(post.id);
            // console.log(isSaved);
            // console.log(finalDate.toLocaleString());
            return (
              <Article
                key={post.id}
                imgUrl={post.urls[0]}
                date={finalDate.toLocaleString()}
                titlu={post.titlu}
                categorie={post.tproblema}
                status={post.status}
                id={post.id}
                upvoted={liked}
                downvoted={unliked}
                upvotes={post.upvotes}
                downvotes={post.downvotes}
                userid={user.uid}
                upvotedUser={userCData.upvoted}
                downvotedUser={userCData.downvoted}
                saved={isSaved}
                savedArray={savedArray}
              />
            );
          })}
        {/* <h2 style={{position:"absolute", top:"100px"}}>Bookmarked</h2> */}
      </div>
    </div>
  );
};

export default Favorite;
