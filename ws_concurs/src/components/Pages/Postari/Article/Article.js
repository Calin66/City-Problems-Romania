import React, { useEffect, useState } from "react";
import "./article.css";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineHeart,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import {BsClockHistory} from 'react-icons/bs';
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, useAuth } from "../../../../firebase";
import { Link } from "react-router-dom";
const Article = ({
  imgUrl,
  date,
  titlu,
  categorie,
  id,
  upvoted,
  downvoted,
  upvotes,
  downvotes,
  userid,
  upvotedUser,
  downvotedUser,
  saved,
  savedArray,
  status,
  // reset,
}) => {
  // const [bgcolor, setBgcolor] = useState("black");
  const [reset, setReset] = useState(false);
  const [upvotedL, setUpvotedL] = useState(upvoted);
  const [downvotedL, setDownvotedL] = useState(downvoted);
  const user = useAuth();
  const [userCData, setUserCData] = useState();

  const [upvotesL, setUpvotesL] = useState(upvotes);
  const [downvotesL, setDownvotesL] = useState(downvotes);

  const [savedL, setSavedL] = useState(saved);
  const [savedArrayL, setSavedArrayL] = useState(savedArray);

  const [postCData, setPostCData] = useState();
  const infoRef = doc(db, "posts", id);
  const userRef = doc(db, "users", userid);
  const getPostI = async () => {
    const docSnap = await getDoc(infoRef);
    if (docSnap.exists()) {
      setPostCData(docSnap.data());
    }
  };
  useEffect(() => {
    getPostI();

    console.log("DDDDD");
  }, []);
  const getUserPostData = async () => {
    if (userCData) {
      const upvotedUser = userCData.upvoted;
      const downvotedUser = userCData.downvoted;
      // console.log(upvotedUser);
      const liked = upvotedUser.includes(id);
      const unliked = downvotedUser.includes(id);
      setDownvotedL(unliked);
      setUpvotedL(liked);
    }
  };
  useEffect(() => {
    getUserPostData();
  }, [userCData]);
  const getUserData = async () => {
    if (user) {
      const uid = user.uid;
      const userCollectionRef = doc(db, "users", uid);
      const docSnap = await getDoc(userCollectionRef);
      if (docSnap.exists()) {
        setUserCData(docSnap.data());
        // if (userCData) {
        //   const upvotedUser = userCData.upvoted;
        //   const downvotedUser = userCData.downvoted;
        //   // console.log(upvotedUser);
        //   const liked = upvotedUser.includes(id);
        //   const unliked = downvotedUser.includes(id);
        //   setDownvotedL(unliked);
        //   setUpvotedL(liked);
        // }
        // console.log(docSnap.data());
      } else {
        console.log("Error docSnap");
      }
    }
  };
  useEffect(() => {
    getUserData();
  }, [user]);
  const handleSave = async () => {
    if (savedL) {
      setSavedL(false);
      const indexSaved = savedArrayL.indexOf(id);
      savedArrayL.splice(indexSaved, 1);
      await updateDoc(userRef, { saved: savedArrayL });
    } else {
      setSavedL(true);
      savedArrayL.push(id);
      await updateDoc(userRef, { saved: savedArrayL });
    }
  };
  const handleUpvote = async () => {
    console.log(id);
    if (upvotedL) {
      setUpvotedL(false);
      const indexUpvoted = upvotedUser.indexOf(id);
      const updateUpvoted = upvotedUser.splice(indexUpvoted, 1);
      await updateDoc(infoRef, { upvotes: upvotesL - 1 });
      setUpvotesL(upvotesL - 1);
      await updateDoc(userRef, { upvoted: userCData.upvoted });
    } else if (downvotedL) {
      setUpvotedL(true);
      setDownvotedL(false);
      const indexDownvoted = downvotedUser.indexOf(id);
      downvotedUser.splice(indexDownvoted, 1);
      await updateDoc(userRef, { downvoted: downvotedUser });
      await updateDoc(infoRef, { upvotes: upvotesL + 1 });
      setUpvotesL(upvotesL + 1);
      await updateDoc(infoRef, { downvotes: downvotesL - 1 });
      setDownvotesL(downvotesL - 1);
      const updateUpvoted = upvotedUser.push(id);
      await updateDoc(userRef, { upvoted: upvotedUser });
    } else {
      setUpvotedL(true);
      // console.log(upvotedUser);
      upvotedUser.push(id);
      await updateDoc(infoRef, { upvotes: upvotesL + 1 });
      setUpvotesL(upvotesL + 1);
      await updateDoc(userRef, { upvoted: upvotedUser });
    }
  };
  const handleDownvote = async () => {
    if (downvotedL) {
      setDownvotedL(false);
      const indexDownvoted = downvotedUser.indexOf(id);
      const updateDownvoted = downvotedUser.splice(indexDownvoted, 1);
      await updateDoc(infoRef, { downvotes: downvotesL - 1 });
      setDownvotesL(downvotesL - 1);
      await updateDoc(userRef, { downvoted: downvotedUser });
    } else if (upvotedL) {
      setDownvotedL(true);
      setUpvotedL(false);
      const indexUpvoted = upvotedUser.indexOf(id);
      upvotedUser.splice(indexUpvoted, 1);
      await updateDoc(userRef, { upvoted: upvotedUser });
      await updateDoc(infoRef, { upvotes: upvotesL - 1 });
      setUpvotesL(upvotesL - 1);
      await updateDoc(infoRef, { downvotes: downvotesL + 1 });
      setDownvotesL(downvotesL + 1);
      const updateDownvoted = downvotedUser.push(id);
      await updateDoc(userRef, { downvoted: downvotedUser });
    } else {
      setDownvotedL(true);
      // console.log(downvotedUser);
      downvotedUser.push(id);

      await updateDoc(infoRef, { downvotes: downvotesL + 1 });
      setDownvotesL(downvotesL + 1);
      await updateDoc(userRef, { downvoted: downvotedUser });
    }
  };
  // if (!reset) {
  //   // setUpvotedL(upvoted);
  //   // setDownvotedL(downvoted);
  //   console.log(`upvotedL: ${upvotedL}`);
  //   console.log(`downvotedL:${downvotedL}`);
  // }
  return (
    <div className="gpt3blog-container_article">
      <div style={{ position: "relative" }}>
        <div className="afp-ct">
          <h4>{categorie}</h4>
        </div>
        <div className="afp-status">
          <BsClockHistory size="28px" style={{position:"relative", bottom:"3px"}}/>
          <h4>{status}</h4>
        </div>
        {!savedL ? (
          <BsBookmark className="cp-bookmark" onClick={handleSave} />
        ) : (
          <BsFillBookmarkFill className="cp-bookmark" onClick={handleSave} />
        )}
      </div>
      <div className="gpt3blog-container_article-image">
        <img src={imgUrl} alt="blog_image" />
      </div>
      <div className="gpt3__blog-container_article-content">
        <div>
          <p>{date}</p>
          <Link to="/vezipostare" state={{id, userid}} style={{textDecoration:"none", color:"black"}}><h3>{titlu}</h3></Link>

        </div>
        <div
          style={{
            display: "flex",
            width: "90%",
            justifyContent: "space-between",
            position: "absolute",
            bottom: "10px",
            left: "20px",
          }}
        >
          <Link to="/vezipostare" state={{id, userid}} style={{textDecoration:"none", color:"black"}}><p className="cp-vezipos">Vezi postare</p></Link>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {!upvotedL ? (
              <AiOutlineLike className="cp-vote" onClick={handleUpvote} />
            ) : (
              <AiFillLike className="cp-vote" onClick={handleUpvote} />
            )}
            {!downvotedL ? (
              <AiOutlineDislike className="cp-vote" onClick={handleDownvote} />
            ) : (
              <AiFillDislike className="cp-vote" onClick={handleDownvote} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
