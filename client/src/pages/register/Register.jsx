import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import InboxIcon from "../../assets/mail.png";
import MindScapeLogo from "../../assets/mindscape_logo.png";
import { SERVER_URL, CLIENT_URL } from "../../urlConfig";

// icon imports
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DangerousIcon from "@mui/icons-material/Dangerous";

// responsive sizes
import { useResponsiveSizes } from "../../components/useResponsiveSizes";

export const Register = () => {
  const {
    extraSmallDevice,
    smallDevice,
    mediumDevices,
    largeDevices,
    extraLargeDevices,
  } = useResponsiveSizes();

  const [usernameRegVal, setUsernameRegVal] = useState("");
  const [passwordRegVal, setPasswordRegVal] = useState("");
  const [emailRegVal, setEmailRegVal] = useState("");
  const [msg, setMsg] = useState("");
  const [btnMsg, setBtnMsg] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPasswordUI, setShowResetPasswordUI] = useState(true);
  const [enableDisabled, setEnableDisabled] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const registerAccount = async (e) => {
    e.preventDefault();

    const data = {
      username: usernameRegVal,
      password: passwordRegVal,
      email: emailRegVal,
      url_host: CLIENT_URL,
    };

    setEnableDisabled(true);
    setBtnMsg("Please wait...");
    await axios.get(`${SERVER_URL}/RenderTrig`);

    try {
      await axios.post(`${SERVER_URL}/users/`, data).then((response) => {
        if (response.data.error) {
          setMsg(response.data.message);
          setError(true);
          setEnableDisabled(false);
          setBtnClicked(false);
        } else {
          setBtnMsg("");

          setTimeout(() => {
            setError(false);
            setMsg("Signing Up...");
          }, 0);

          setTimeout(() => {
            setShowResetPasswordUI(false);
            setMsg("");
          }, 2000);
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      setMsg("Error during registration. Please try again.");
    }
  };

  const calculatePasswordStrength = (password) => {
    // Your password strength calculation logic here
    // This example enforces at least one capital letter, one number, one symbol, and a minimum length of 8 characters
    const hasCapital = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*]/.test(password);

    if (hasCapital && hasNumber && hasSymbol && password.length >= 8) {
      return "strong";
    } else if (hasCapital && (hasNumber || hasSymbol) && password.length >= 8) {
      return "average";
    } else {
      return "weak";
    }
  };

  const strength = calculatePasswordStrength(passwordRegVal);

  const getStrengthColor = () => {
    switch (strength) {
      case "strong":
        return "dark-green-str";
      case "average":
        return "dark-orange-str";
      case "weak":
        return "dark-red-str";
      default:
        return "";
    }
  };

  const progressBarWidth = () => {
    switch (strength) {
      case "strong":
        return "100%";
      case "average":
        return "50%";
      case "weak":
        return "25%";
      default:
        return "0%";
    }
  };

  return showResetPasswordUI ? (
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

          <h2 className="text-lg mcolor-700 font-normal mt-4 text-center">
            Sign Up for an Account
          </h2>

          <div className="my-5 w-full flex items-center justify-center w-full">
            <div className="w-full">
              <div className="my-3 w-full">
                <p htmlFor="" className="font-medium">
                  Username<span className="text-red">*</span>
                </p>
                <input
                  required
                  autoComplete="no"
                  placeholder="Enter your username..."
                  type="text"
                  className="bg-transparent w-full border-bottom-thin py-1 rounded-[5px] input-login"
                  value={usernameRegVal !== "" ? usernameRegVal : ""}
                  onChange={(event) => setUsernameRegVal(event.target.value)}
                />
              </div>

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
                  value={emailRegVal !== "" ? emailRegVal : ""}
                  onChange={(event) => setEmailRegVal(event.target.value)}
                />
              </div>

              <div className="my-3 w-full relative">
                <p htmlFor="" className="font-medium">
                  Password<span className="text-red">*</span>
                </p>
                <input
                  required
                  autoComplete="new-password" // 'no' may not be the best choice for accessibility
                  placeholder="Enter your password..."
                  type={showPassword ? "text" : "password"}
                  className="bg-transparent w-full border-bottom-thin py-1 rounded-[5px] input-login"
                  value={passwordRegVal !== "" ? passwordRegVal : ""}
                  onChange={(event) => setPasswordRegVal(event.target.value)}
                />

                <button
                  type="button"
                  className="ml-2 focus:outline-none absolute right-0 mcolor-800"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>

              {passwordRegVal !== "" && (
                <div className="my-4 flex items-center justify-center">
                  <div
                    className={`mcolor-900 text-center rounded border-thin-800 py-1`}
                    style={{
                      width: progressBarWidth(),
                      transition: "width 0.3s ease",
                    }}
                  >
                    {`${strength.charAt(0).toUpperCase() + strength.slice(1)}`}{" "}
                    <span className={`${getStrengthColor()}`}>
                      {getStrengthColor() !== "dark-green-str" ? (
                        <DangerousIcon />
                      ) : (
                        <CheckCircleIcon sx="18px" />
                      )}
                    </span>
                  </div>
                </div>
              )}

              <p
                className={`text-center text-sm ${
                  msg !== "" && error && "text-red my-3"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {msg !== "" && error && msg}
              </p>

              <button
                className={`w-full mt-3 font-medium input-btn py-2 rounded-[20px] ${
                  msg !== "" && !error
                    ? "mbg-200 border-thin-800 mcolor-900"
                    : "mbg-800 mcolor-100 text-md"
                }`}
                onClick={(e) => registerAccount(e)}
                disabled={enableDisabled}
              >
                {enableDisabled
                  ? btnMsg === ""
                    ? "Signing Up..."
                    : btnMsg
                  : msg !== "" && !error
                  ? btnMsg
                  : "Sign Up"}
              </button>

              <div className="text-sm mcolor-800-opacity mt-4">
                <ul className="text-center">
                  <li>At least 8 characters long</li>
                  <li>At least 1 uppercase letter</li>
                  <li>At least 1 symbol and number</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            Already have an account?{" "}
            <span className="font-bold ml-1">
              <Link to={"/login"}>Sign In</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-[100vh] flex items-center justify-center">
      <div className="">
        <br />
        <div className="flex items-center justify-center">
          <div className="text-emerald-500" style={{ width: "200px" }}>
            <img src={InboxIcon} className="w-full" alt="" />
          </div>
        </div>

        <br />
        <h1
          className={`${
            extraSmallDevice || smallDevice ? "text-2xl" : "text-3xl"
          } font-medium mcolor-800 text-center`}
        >
          Check Your Gmail Inbox
        </h1>

        <p className="text-center mcolor-800 my-3 px-10">
          Email verification has been sent to your email. Kindly check it out.
          Thank you for your patience.
        </p>
        <br />
      </div>
    </div>
  );
};
