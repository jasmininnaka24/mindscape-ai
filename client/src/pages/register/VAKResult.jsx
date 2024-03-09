import React from "react";
import { useLocation } from "react-router-dom";
import Kinesthetic from "../../assets/kinesthetic.jpg";
import Auditory from "../../assets/auditory.jpg";
import Visual from "../../assets/visual.jpg";
import { useResponsiveSizes } from "../../components/useResponsiveSizes";

import "./qavak.css";
import { Link } from "react-router-dom";

export const VAKResult = () => {
  const location = useLocation();
  const { learningStyle, probability } = location.state;

  const {
    extraSmallDevice,
    smallDevice,
    mediumDevices,
    largeDevices,
    extraLargeDevices,
  } = useResponsiveSizes();

  const visual =
    "Visual learners are individuals who prefer to process information primarily through visual means, such as images, diagrams, charts, graphs, videos, and written instructions. These learners typically have a strong ability to understand and remember information when it's presented visually rather than through verbal or auditory methods. They often benefit from visual aids in learning environments, such as illustrations, presentations, or demonstrations. Visual learners may find it easier to grasp concepts when they can see how things are organized spatially or visually represented.";

  const auditory =
    "Auditory learners are individuals who prefer to process information primarily through listening and speaking. They learn best through verbal explanations, lectures, discussions, and audio recordings. These learners have a strong ability to retain information when it's presented verbally and may benefit from techniques such as reading aloud, discussing concepts with others, or listening to recorded lectures or podcasts. Auditory learners often have a good memory for spoken information and may excel in environments where verbal communication is emphasized. They may also enjoy music and rhythm and find it helpful for concentration and learning.";

  const kinesthethic =
    "Kinesthetic learners, also known as tactile learners, are individuals who prefer to learn through hands-on experiences and physical activities. These learners typically excel when they can engage in activities that involve movement, touch, and manipulation of objects. They learn best by doing rather than just listening or watching. Kinesthetic learners may benefit from activities such as experiments, simulations, role-playing, building models, and interactive games. They often have a strong sense of spatial awareness and may use physical gestures or movements to help them understand and remember information.";

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
              className={`rounded-full mbg-800 mcolor-100 ${
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

      {probability >= 60 ? (
        <div className="poppins flex justify-center items-center mt-14">
          <div className="max-width">
            {/* <p className='text-xl text-center mb-5'>" {sentence} "</p> */}
            <div
              className={`flex ${
                extraLargeDevices || largeDevices
                  ? "flex-row"
                  : "flex-col-reverse"
              } justify-between items-center gap-10`}
            >
              <div
                className={`${
                  extraLargeDevices || largeDevices ? "w-2/3" : "w-full"
                } text-justify`}
              >
                <p
                  className={`${
                    extraSmallDevice
                      ? "text-sm"
                      : smallDevice
                      ? "text-md"
                      : "text-lg"
                  }`}
                >
                  Based on your response data, the classification model has{" "}
                  <span className="font-bold">{probability}%</span> identified
                  you as{" "}
                  <span className="font-bold">{learningStyle} learner.</span>
                </p>
                <p
                  className={`${
                    extraSmallDevice
                      ? "text-sm"
                      : smallDevice
                      ? "text-md"
                      : "text-lg"
                  } mt-8`}
                >
                  {learningStyle === "Auditory"
                    ? auditory
                    : learningStyle === "Kinesthetic"
                    ? kinesthethic
                    : auditory}
                </p>
                <p
                  className={`${
                    extraSmallDevice
                      ? "text-sm"
                      : smallDevice
                      ? "text-md"
                      : "text-lg"
                  } mt-8`}
                >
                  Understanding your learning style can help you tailor your
                  study approach to maximize your learning potential.
                </p>
                <Link to={"/login"}>
                  <button
                    type="button"
                    className={`my-2 ${
                      extraSmallDevice
                        ? "text-sm"
                        : smallDevice
                        ? "text-md"
                        : "textlgl"
                    } font-medium mbg-800 mcolor-100 px-16 py-2 rounded-[10px]`}
                  >
                    Done
                  </button>
                </Link>
              </div>
              <div
                className={`${
                  extraLargeDevices || largeDevices ? "w-1/2" : "w-full"
                }`}
              >
                {learningStyle === "Visual" && <img src={Visual} alt="" />}
                {learningStyle === "Auditory" && <img src={Auditory} alt="" />}
                {learningStyle === "Kinesthetic" && (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <img src={Kinesthetic} style={{ objectFit: "contain" }} />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 text-center">
          <p className="text-2xl">Something is wrong with your input.</p>
        </div>
      )}
    </div>
  );
};
