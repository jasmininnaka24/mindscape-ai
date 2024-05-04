import React from "react";
import "./navbar.css";
import "../responsiveness/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";

// icon imports
import SpaIcon from "@mui/icons-material/Spa";
import MenuIcon from "@mui/icons-material/Menu";

import { useResponsiveSizes } from "../useResponsiveSizes";

export const Navbar = ({ toggleMenuBtnFunc }) => {
  const {
    extraSmallDevice,
    smallDevice,
  } = useResponsiveSizes();

  return (
    <div className="fixed max-width z-10 navbar" data-aos="fade">
      <nav className={`flex justify-between items-center py-6 mbg-100`}>
        <div className={`ms-logo`}>
          <HashLink to={"#"} className="flex items-center">
            <h3
              className={`my-1 ${!extraSmallDevice ? "text-3xl" : "text-xl"}`}
            >
              <SpaIcon /> MindScape
            </h3>
          </HashLink>
        </div>
        <div
          className={`ms-nav-links flex justify-between items-center gap-5 hidden-on-tablet-to-small-screen`}
        >
          <HashLink className="mx-4" to={"#about"}>
            About
          </HashLink>
          <HashLink className="mx-4" to={"#benefits"}>
            Benefits
          </HashLink>
          <HashLink className="mx-4" to={"#features"}>
            Features
          </HashLink>
          <HashLink className="mx-4" to={"#feedback"}>
            Feedbacks
          </HashLink>
        </div>

        <div className="ms-login flex items-center gap-2">
          <button
            onClick={toggleMenuBtnFunc}
            className={`${!extraSmallDevice && !smallDevice ? "hidden" : ""}`}
          >
            <MenuIcon />
          </button>

          <Link
            to={"/login"}
            className="flex justify-between items-center gap-2"
          >
            <div>Login</div>
            <div>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
};
