import React, { useState } from "react";
import "./navBar.css";
import sgl from "./../images/sigla.png";
import { Link } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { useAuth } from "../../firebase";
import { BiExit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { logout } from "../../firebase";

const Navbar = (props) => {
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();
  const handleNewPost = () => {
    navigate("/creeazapostare");
  };
  const currentUser = useAuth();
  const [openSide, setOpenSide] = useState(false);
  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
    } catch {
      alert("Error!");
    }
    setLoading(false);
  }

  return (
    <div id="navigatie" style={{ backgroundColor: props.backgroundColor }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <div id="logo_sigla">
          <img src={sgl} />
          <h1>City Problems Romania</h1>
        </div>
      </Link>
      {!currentUser ? (
        <Link to="/signup">
          <button id="sign">Sign up!</button>
        </Link>
      ) : (
        <div id="user-container">
          <div className="user-name-icon" onClick={() => setOpenSide(true)}>
            <p className="user-name">
              {currentUser.displayName ? currentUser.displayName : "Username"}
            </p>
            {currentUser.photoURL ? (
              <img className="profilePic" src={currentUser.photoURL} />
            ) : (
              <FaRegUserCircle className="user-icon" />
            )}
          </div>
          <div id="user-options">
            <p onClick={handleNewPost}>Creeaza postare</p>
            <p onClick={() => navigate("/postari")}>Postari</p>
            <p onClick={() => navigate("/detaliicont")}>Detalii cont</p>
            <p onClick={() => navigate("/favorite")}>Favorite</p>
            <p id="logout" onClick={handleLogout}>
              Log out
              <BiExit
                style={{ fontSize: "24px", position: "relative", left: "5px" }}
              />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
