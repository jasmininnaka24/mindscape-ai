/* global google */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import { SERVER_URL, CLIENT_URL, CLIENT_ID } from "../../urlConfig";
import MindScapeLogo from "../../assets/mindscape_logo.png";

// icon imports
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// responsive sizes
import { useResponsiveSizes } from "../../components/useResponsiveSizes";

export const Login = () => {
  const {
    extraSmallDevice,
    smallDevice,
    mediumDevices,
    largeDevices,
    extraLargeDevices,
  } = useResponsiveSizes();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isGroupSession = searchParams.has("group_session");
  const groupId = searchParams.get("groupId");
  const materialId = searchParams.get("materialId");

  const navigate = useNavigate();
  const { setUserInformation } = useUser();

  const [passwordLogVal, setPasswordLogVal] = useState("");
  const [emailLogVal, setEmailLogVal] = useState("");
  const [msg, setMsg] = useState("");
  const [btnMsg, setBtnMsg] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signInBtnClicked, setSignInBtnClicked] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginResponse = (response) => {
    setSignInBtnClicked(false);
    setError(response.data.error);
    setMsg(response.data.message);
    if (!response.data.error) {
      sessionStorage.setItem("accessToken", response.data.accessToken);
      setUserInformation(response.data.user);
      setTimeout(() => {
        setBtnMsg("Logging in...");
        setTimeout(() => {
          if (isGroupSession) {
            navigate(
              `/main/group/study-area/group-review/${groupId}/${materialId}`
            );
          } else {
            navigate("/main/personal/dashboard");
          }
        }, 2000);
      }, 100);
    }
  };

  const loginUser = async (data) => {
    try {
      const response = await axios.post(`${SERVER_URL}/users/login`, data);
      handleLoginResponse(response);
    } catch (error) {
      setSignInBtnClicked(false);
      setError(true);
      setMsg("An error occurred during login.");
    }
  };

  const loginAccount = async (e) => {
    e.preventDefault();

    if (emailLogVal.trim() === "" || passwordLogVal.trim() === "") {
      setError(true);
      setMsg("Input fields cannot be empty.");
    } else {
      setSignInBtnClicked(true);
      setBtnMsg("Please wait...");

      await axios.get(`${SERVER_URL}/users`);

      const data = {
        email: emailLogVal.trim(),
        password: passwordLogVal,
        url_host: CLIENT_URL,
      };

      if (data.email && data.password) {
        await loginUser(data);
      }
    }
  };

  const handleCallBackResponse = async (response) => {
    setSignInBtnClicked(true);
    setBtnMsg("Please wait...");

    await axios.get(`${SERVER_URL}/users`);

    let userObject;
    try {
      console.log("Encoded JWT ID token: " + response.credential);
      userObject = jwt_decode(response.credential);
      console.log(userObject);
    } catch (error) {
      setSignInBtnClicked(false);
      setError(true);
      setMsg("An error occurred while decoding user credentials.");
      return;
    }

    const data = {
      email: userObject.email,
      url_host: CLIENT_URL,
    };

    if (data.email) {
      await loginUser(data);
    }
  };

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCallBackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  return (
    <div className="poppins flex justify-center items-center mcolor-900 w-full h-[100vh] mbg-200">
      <div
        className={`mbg-100 ${
          extraSmallDevice ? "h-[100vh] w-full" : ""
        } shadows p-8 rounded flex flex-col items-center justify-center`}
      >
        <div className="px-5">
          <div className="flex items-center justify-center">
            <div style={{ width: "50px", height: "50px" }}>
              <img src={MindScapeLogo} alt="" />
            </div>
            <p className="font-medium ml-2 text-3xl">MindScape</p>
          </div>

          <div className="flex justify-center mt-5">
            <button>
              <div
                id="signInDiv"
                className="flex items-center px-10 py-3 rounded-[30px] text-md"
              ></div>
            </button>
          </div>

          <div className="flex items-center gap-5 justify-center">
            <div className="line"></div>
            <p>or</p>
            <div className="line"></div>
          </div>

          <div className="my-5 w-full flex items-center justify-center w-full">
            <div className="w-full">
              <div className="my-3 w-full">
                <p htmlFor="" className="font-medium">
                  Email<span className="text-red">*</span>
                </p>
                <input
                  required
                  autoComplete="no"
                  placeholder="Enter your email..."
                  type="email"
                  className="bg-transparent w-full border-bottom-thin py-1 rounded-[5px] input-login"
                  value={emailLogVal !== "" ? emailLogVal : ""}
                  onChange={(event) => setEmailLogVal(event.target.value)}
                />
              </div>

              <div className="mb-4 mt-8 flex relative flex-relative">
                <input
                  required
                  autoComplete="new-password" // 'no' may not be the best choice for accessibility
                  placeholder="Enter your password..."
                  type={showPassword ? "text" : "password"}
                  className="bg-transparent w-full border-bottom-thin py-1 rounded-[5px] input-login"
                  value={passwordLogVal}
                  onChange={(event) => setPasswordLogVal(event.target.value)}
                />

                <button
                  type="button"
                  className="ml-2 focus:outline-none absolute right-0 mcolor-800"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>

              <div className="w-full mb-5 font-medium mcolor-700">
                <Link to={"/verify-email"}>Forgot Password</Link>
              </div>

              <p
                className={`text-center ${
                  msg !== "" && error && "text-red my-3"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {msg !== "" && error && msg}
              </p>

              <button
                className={`w-full font-medium input-btn py-2 rounded-[20px] ${
                  (msg !== "" && !error) || signInBtnClicked
                    ? "mbg-200 border-thin-800 mcolor-900"
                    : "btn-800"
                }`}
                onClick={(e) => loginAccount(e)}
              >
                {btnMsg !== "" && !error
                  ? btnMsg
                  : signInBtnClicked
                  ? btnMsg
                  : "Sign In"}
              </button>
            </div>
          </div>

          <div className="text-center">
            Don't have an account?{" "}
            <span className="font-bold ml-1">
              <Link to={"/register"}>Sign Up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
