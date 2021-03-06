import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { db, useAuth } from "../../../firebase";
import Navbar from "../../NavBar/navBar";
import Article from "./Article/Article";
import "./Postari.css";
import Sortare from "./Sortare/Sortare";
import { SortareSwipe } from "./Sortare/sortareSwipe";
import Footer from "../../containers/footer/Footer";
import { Link } from "react-router-dom";
const Postari = () => {
  const [postsCollectionRef, setPostsCollectionRef] = useState(
    collection(db, "posts")
  );
  const [slide, setSlide] = useState(false);
  const user = useAuth();

  const [posts, setPosts] = useState([]);
  const [postsL, setPostsL] = useState([]);
  const [postsLiked, setPostsLiked] = useState([]);
  const [userCData, setUserCData] = useState();
  const [dataCrescator, setDataCrescator] = useState(true);
  const [voturiCrescator, setVoturiCrescator] = useState(true);

  //Filtrare
  const [intCrescator, setIntCrescator] = useState(false);
  const [propCrescator, setPropCrescator] = useState(false);
  const [probCrescator, setProbCrescator] = useState(false);
  const [likeCrescator, setLikeCrescator] = useState(false);
  const [bookCrescator, setBookCrescator] = useState(false);

  const [crescData, setCrescData] = useState(true);
  const [crescNr, setCrescNr] = useState(true);

  const handleToggle = () => {
    setSlide(!slide);
  };
  const handleFilterInt = () => {
    if (!intCrescator) {
      const sortedPosts = posts.filter(
        (post) => post.tproblema === "intrebari"
      );
      setPostsL(sortedPosts);
      // console.log(sortedPosts);
      // setPostsCollectionRef(collection(db, "posts"), where("tproblema", "==", "intrebari"))
    } else if (intCrescator) {
      // setPostsCollectionRef(collection(db, "posts"))
      setPostsL(posts);
    }
    setIntCrescator(!intCrescator);
    setPropCrescator(false);
    setProbCrescator(false);
    setLikeCrescator(false);
    setBookCrescator(false);
    setSlide(false);
  };
  const handleFilterProp = () => {
    if (!propCrescator) {
      const sortedPosts = posts.filter(
        (post) => post.tproblema === "propuneri"
      );
      setPostsL(sortedPosts);
      // console.log(sortedPosts);
    } else if (propCrescator) {
      setPostsL(posts);
    }
    setPropCrescator(!propCrescator);
    setProbCrescator(false);
    setLikeCrescator(false);
    setBookCrescator(false);
    setIntCrescator(false);
    setSlide(false);
  };
  const handleFilterProb = () => {
    if (!probCrescator) {
      const sortedPosts = posts.filter((post) => post.tproblema === "probleme");
      setPostsL(sortedPosts);
      // console.log(sortedPosts);
    } else if (probCrescator) {
      setPostsL(posts);
    }
    setProbCrescator(!probCrescator);
    setLikeCrescator(false);
    setBookCrescator(false);
    setIntCrescator(false);
    setPropCrescator(false);
    setSlide(false);
  };
  const handleFilterLike = () => {
    setSlide(false);

    if (!likeCrescator) {
      const upvotedUser = userCData.upvoted;
      const sortedPosts = posts.filter((post) => {
        const liked = upvotedUser.includes(post.id);
        return liked;
      });
      setPostsL(sortedPosts);
      // console.log(sortedPosts);
    } else if (likeCrescator) {
      setPostsL(posts);
    }
    setLikeCrescator(!likeCrescator);
    setProbCrescator(false);
    setBookCrescator(false);
    setIntCrescator(false);
    setPropCrescator(false);
  };
  const handleFilterBook = () => {
    setSlide(false);

    if (!bookCrescator) {
      const upvotedUser = userCData.saved;
      const sortedPosts = posts.filter((post) => {
        const bookd = upvotedUser.includes(post.id);
        return bookd;
      });
      setPostsL(sortedPosts);
      // console.log(sortedPosts);
    } else if (bookCrescator) {
      setPostsL(posts);
    }
    setBookCrescator(!bookCrescator);
    setLikeCrescator(false);
    setProbCrescator(false);
    setIntCrescator(false);
    setPropCrescator(false);
  };

  //Filtrare
  //Sortare
  const handleSortareData = () => {
    setSlide(false);
    if (dataCrescator) {
      const sortedPosts = postsL.sort((a, b) => {
        return b.data.seconds - a.data.seconds;
      });
      setPostsL(sortedPosts);
      //   console.log(sortedPosts);
    } else if (!dataCrescator) {
      const sortedPosts = postsL.sort((a, b) => {
        return a.data.seconds - b.data.seconds;
      });
      setPostsL(sortedPosts);
    }
    setDataCrescator(!dataCrescator);
    setVoturiCrescator(true);
  };
  const handleSortareVoturi = () => {
    setSlide(false);
    if (voturiCrescator) {
      const sortedPosts = postsL.sort((a, b) => {
        return b.upvotes - b.downvotes - a.upvotes - a.downvotes;
      });
      setPostsL(sortedPosts);
    } else if (!voturiCrescator) {
      const sortedPosts = postsL.sort((a, b) => {
        return a.upvotes - a.downvotes - b.upvotes - b.downvotes;
      });
      setPostsL(sortedPosts);
      //   console.log(sortedPosts);
    }
    setVoturiCrescator(!voturiCrescator);
    setDataCrescator(true);
  };
  //Sortare

  //UserData
  const getUserData = async () => {
    if (user) {
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
  //UserData

  useEffect(() => {
    const getPosts = async () => {
      //   const data = await getDocs(postsCollectionRef);
      const data = await getDocs(postsCollectionRef);
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setPostsL(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, []);

  return (
    <>
      {slide ? (
        <SortareSwipe
          handleToggle={handleToggle}
          handleSortareData={handleSortareData}
          handleSortareVoturi={handleSortareVoturi}
          handleFilterInt={handleFilterInt}
          handleFilterProp={handleFilterProp}
          handleFilterProb={handleFilterProb}
          handleFilterLike={handleFilterLike}
          handleFilterBook={handleFilterBook}
        />
      ) : (
        <>
          <div className="sp-ss" onClick={handleToggle}>
            <h2>Sortare + filtrare</h2>
            <FaBars
              id="ssp-bars"
              style={{
                fontSize: "24px",
                position: "relative",
                bottom: "4px",
                left: "5%",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Navbar backgroundColor="black" />
            {/* {!voturiCrescator && <div className="container-pg-postari">
                {postsLiked &&
                  userCData &&
                  postsLiked.map((post) => {
                    const upvotedUser = userCData.upvoted;
                    const downvotedUser = userCData.downvoted;
                    // console.log(upvotedUser);
                    const liked = upvotedUser.includes(post.id);
                    const unliked = downvotedUser.includes(post.id);
                    if(liked){

                      const date = post.data.seconds * 1000;
                      const finalDate = new Date(date);
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
                      }
                  })}
              </div>
          } */}
            <h3 style={{ position: "absolute", top: "150px", left: "5%" }}>
              Vezi postarile in lucru sau terminate{" "}
              <Link style={{ color: "#E45826" }} to="/postariinlucru">
                aici
              </Link>
            </h3>
            {!dataCrescator && (
              <h2
                style={{
                  position: "absolute",
                  top: "250px",
                  left: "9%",
                  fontWeight: "400",
                }}
              >
                Cele mai noi
              </h2>
            )}
            {!voturiCrescator && (
              <h3
                style={{
                  position: "absolute",
                  top: "250px",
                  left: "8%",
                  fontWeight: "400",
                }}
              >
                Postari din ultima zi
              </h3>
            )}
            {!voturiCrescator && (
              <div className="container-postari">
                <div className="container-pg-postari">
                  {postsL &&
                    userCData &&
                    postsL.map((post) => {
                      const date = post.data.seconds * 1000;
                      const finalDate = new Date(date);
                      const currentDate = new Date();
                      const interval =
                        currentDate.getTime() / 1000 -
                        finalDate.getTime() / 1000;
                      console.log(interval);
                      if (interval < 86400) {
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
                            status={post.status}
                          />
                        );
                      }
                    })}
                  {/* {console.log("DX")} */}
                </div>
                <div className="v-sortare">
                  <Sortare
                    crescData={dataCrescator}
                    crescNr={voturiCrescator}
                    handleSortareData={handleSortareData}
                    handleSortareVoturi={handleSortareVoturi}
                    handleFilterInt={handleFilterInt}
                    handleFilterProp={handleFilterProp}
                    handleFilterProb={handleFilterProb}
                    handleFilterLike={handleFilterLike}
                    handleFilterBook={handleFilterBook}
                  />
                </div>
              </div>
            )}

            <div className="container-postari">
              {!voturiCrescator && (
                <h3
                  style={{
                    position: "relative",
                    bottom: "10px",
                    fontWeight: "400",
                  }}
                >
                  Cele mai populare
                </h3>
              )}
              <div className="container-pg-postari">
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
                        status={post.status}
                      />
                    );
                  })}
                {/* {console.log("DX")} */}
              </div>
              <div>
                {voturiCrescator && (
                  <Sortare
                    crescData={dataCrescator}
                    crescNr={voturiCrescator}
                    handleSortareData={handleSortareData}
                    handleSortareVoturi={handleSortareVoturi}
                    handleFilterInt={handleFilterInt}
                    handleFilterProp={handleFilterProp}
                    handleFilterProb={handleFilterProb}
                    handleFilterLike={handleFilterLike}
                    handleFilterBook={handleFilterBook}
                  />
                )}
              </div>
            </div>
          </div>
          {/* <div
            style={{
              backgroundColor: "black",
              width: "100%",
              height: "200px",
              position: "absolute",
              bottom: "1%",
            }}
            >
            <h1>Footer</h1>
          </div> */}
          {/* <Footer /> */}
        </>
      )}
    </>
  );
};

export default Postari;
