import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LEARNER_TYPE_API, SERVER_URL } from "../../urlConfig";
import { useResponsiveSizes } from "../../components/useResponsiveSizes";

export const DataSubmission = () => {
  const {
    extraSmallDevice,
    smallDevice,
    mediumDevices,
    largeDevices,
    extraLargeDevices,
  } = useResponsiveSizes();

  const location = useLocation();
  const { selectedStr, id } = location.state;
  const [sentence, setSentence] = useState("");
  const [newSentence, setNewSentence] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (newSentence !== "") {
      setSentence(newSentence);
    } else {
      setSentence(selectedStr);
    }
  }, [newSentence, selectedStr]);

  async function classifyLearnerType() {
    try {
      setLoading(true);

      const url = `${LEARNER_TYPE_API}/ls-classification`;
      const response = await axios.post(url, { text: sentence });

      console.log(response);
      const learningStyle = response.data.learningStyle;
      const probability = response.data.probability;

      let data = {
        typeOfLearner: learningStyle,
      };

      navigate("/data-result", {
        state: {
          sentence: sentence,
          learningStyle: learningStyle,
          probability: probability,
        },
      });

      await axios
        .put(`${SERVER_URL}/users/update-typeoflearner/${id}`, data)
        .then((res) => {
          console.log(res.data);
        });
    } catch (error) {
      console.error("Error during classification:", error.message);
      // Handle errors (e.g., show a user-friendly message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mcolor-900 vh flex flex-col justify-center" data-aos="fade">
      <div className="flex flex-col justify-center items-center">
        <div className="breadcrumbs max-width flex justify-center items-center">
          <div className="flex flex-col justify-between items-center">
            <div
              className={`rounded-full mbg-800 mcolor-100 ${
                extraSmallDevice
                  ? "text-xl"
                  : smallDevice
                  ? "text-2xl"
                  : "text-4xl"
              } px-4 pt-1 pb-2`}
            >
              1
            </div>
            <p
              className={`text-center mcolor-900 ${
                extraSmallDevice ? "text-xs" : "text-lg"
              } font-medium`}
            >
              Answer Questions
            </p>
          </div>
          <div className="line"></div>
          <div className="flex flex-col justify-between items-center">
            <div
              className={`rounded-full mbg-800 mcolor-100 ${
                extraSmallDevice
                  ? "text-xl"
                  : smallDevice
                  ? "text-2xl"
                  : "text-4xl"
              } px-4 pt-1 pb-2`}
            >
              2
            </div>
            <p
              className={`text-center mcolor-900 ${
                extraSmallDevice ? "text-xs" : "text-lg"
              } font-medium`}
            >
              Data Submission
            </p>
          </div>
          <div className="line"></div>
          <div className="flex flex-col justify-between items-center">
            <div
              className={`rounded-full mcolor-900 border-hard-800 ${
                extraSmallDevice
                  ? "text-xl"
                  : smallDevice
                  ? "text-2xl"
                  : "text-4xl"
              } px-4 pt-1 pb-2`}
            >
              3
            </div>
            <p
              className={`text-center mcolor-900 ${
                extraSmallDevice ? "text-xs" : "text-lg"
              } font-medium`}
            >
              Type of Learner Result
            </p>
          </div>
        </div>
      </div>

      <div className="poppins flex justify-center items-center mt-20">
        <div className="max-width">
          <p
            className={`${
              extraSmallDevice
                ? "text-sm"
                : smallDevice
                ? "text-xl"
                : "text-2xl"
            } text-center`}
          >
            "When I'm studying, {selectedStr}"
          </p>
          <p className="text-center text-2xl mcolor-400 mt-12">or</p>
          <div
            className={`mt-12 flex ${
              extraLargeDevices || largeDevices
                ? "flex-row items-center"
                : "flex-col"
            } gap-5`}
          >
            <p
              className={`${
                extraSmallDevice
                  ? "text-sm"
                  : smallDevice
                  ? "text-xl"
                  : "text-2xl"
              }`}
            >
              Other answer:{" "}
            </p>
            <textarea
              onChange={(event) => {
                setNewSentence(event.target.value);
              }}
              name=""
              id=""
              cols="100"
              rows="1"
              placeholder="I prefer..."
              className="border-bottom-thin text-xl p-2 single-line-textarea"
            ></textarea>
          </div>
          <div className="flex justify-end mt-7">
            <button
              onClick={classifyLearnerType}
              disabled={loading}
              className={`mbg-800 mcolor-100 px-8 py-2 ${
                extraSmallDevice
                  ? "text-sm"
                  : smallDevice
                  ? "text-md"
                  : "text-xl"
              } rounded-[5px]`}
            >
              {loading ? "Submitting..." : "Submit Answer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
