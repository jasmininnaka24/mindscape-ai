import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart } from "../charts/BarChart";
import { PieChart } from "../charts/PieChart";
import { useUser } from "../../UserContext";
import { useLocation } from "react-router-dom";
import { SERVER_URL } from "../../urlConfig";
import { Sidebar } from "../sidebar/Sidebar";

// icon imports
import EqualizerIcon from "@mui/icons-material/Equalizer";

// responsive sizes
import { useResponsiveSizes } from "../useResponsiveSizes";

export const TopicPage = ({ categoryFor }) => {
  const {
    extraSmallDevice,
    smallDevice,
    mediumDevices,
    largeDevices,
    extraLargeDevices,
  } = useResponsiveSizes();

  const { categoryID, materialID, groupId } = useParams();
  const navigate = useNavigate();

  const { user } = useUser();
  const UserId = user?.id;

  // user data
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    studyProfTarget: 0,
    typeOfLearner: "",
    userImage: "",
  });

  const location = useLocation();
  const { filter, performanceStatus, tag } = location.state;

  const [studyMaterials, setStudyMaterials] = useState([]);
  const [preparedLength, setPreparedLength] = useState(0);
  const [unpreparedLength, setUnpreparedLength] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [currentAnalysisId, setCurrectAnalysisId] = useState(0);
  const [currentIndex, setCurrectIndex] = useState(0);
  const [fetchedID, setFetchedID] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [preferredStudyProf, setPreferredtudyProf] = useState(90);

  const fetchData = async () => {
    const extractedData = await axios.get(
      `${SERVER_URL}/DashForPersonalAndGroup/get-assessments/${materialID}`
    );

    setStudyMaterials(extractedData.data);
    const fetchedData = extractedData.data;
    const fetchedId = fetchedData.map((item) => item.id).pop();

    setFetchedID(fetchedId);

    let data = extractedData.data;

    let preparedLength = 0;
    let unpreparedLength = 0;

    data.forEach((item) => {
      const assessmentImp = parseFloat(item.assessmentImp);
      const assessmentScorePerf = parseFloat(item.assessmentScorePerf);
      const confidenceLevel = parseFloat(item.confidenceLevel);

      const totalScore =
        (assessmentImp + assessmentScorePerf + confidenceLevel) / 3;

      if (totalScore >= preferredStudyProf) {
        preparedLength += 1;
      } else {
        unpreparedLength += 1;
      }
    });

    setPreparedLength(preparedLength);
    setUnpreparedLength(unpreparedLength);

    let studyProf = [];

    if (groupId === undefined) {
      const fetchedPreferredStudyProf = await axios.get(
        `${SERVER_URL}/users/get-user/${UserId}`
      );

      studyProf = fetchedPreferredStudyProf.data.studyProfTarget;
    } else {
      const fetchedPreferredStudyProf = await axios.get(
        `${SERVER_URL}/studyGroup/extract-all-group/${groupId}`
      );

      studyProf = fetchedPreferredStudyProf.data.studyProfTarget;
    }

    setPreferredtudyProf(studyProf);
  };

  useEffect(() => {
    if (!isDone) {
      setIsDone(true);
    }
  }, [UserId]);

  useEffect(() => {
    if (isDone) {
      fetchData(filter);
      setIsDone(false);
    }
  }, [isDone, materialID]);

  console.log(studyMaterials[2 - 1]);

  const generateAnalysis = async (id, index) => {
    setShowLoader(true);
    setShowFirstText(false);
    setShowSecondText(false);

    let data = {
      last_exam: "Pre-Assessment",
      last_assessment_score: studyMaterials[index].preAssessmentScore,
      assessment_score: studyMaterials[index].assessmentScore,
      exam_num_of_items: studyMaterials[index].overAllItems,
      assessment_imp: studyMaterials[index].assessmentImp,
      confidence_level: studyMaterials[index].confidenceLevel,
      prediction_val: (
        (parseFloat(studyMaterials[index].assessmentImp) +
          parseFloat(studyMaterials[index].assessmentScorePerf) +
          parseFloat(studyMaterials[index].confidenceLevel)) /
        3
      ).toFixed(2),
      prediction_text:
        (
          (parseFloat(studyMaterials[index].assessmentImp) +
            parseFloat(studyMaterials[index].assessmentScorePerf) +
            parseFloat(studyMaterials[index].confidenceLevel)) /
          3
        ).toFixed(2) >= preferredStudyProf
          ? "ready"
          : "not yet ready",
      target: preferredStudyProf,
    };

    if (studyMaterials.length > 1) {
      if (id !== fetchedID) {
        data.last_exam = "Assessment";
        data.last_assessment_score = studyMaterials[index + 1].assessmentScore;
      }
    }

    console.log(fetchedID);
    console.log(id);
    console.log(data);

    const generateAnalysisUrl =
      "https://f92b-34-124-241-52.ngrok.io/generate_analysis";

    const response = await axios.post(generateAnalysisUrl, data);
    console.log(response.data);
    let generatedAnalysisResponse = response.data.generated_analysis.replace(
      "\n\n\n\n\n",
      ""
    );

    await axios.put(
      `${SERVER_URL}/DashForPersonalAndGroup/set-update-analysis/${id}`,
      { analysis: generatedAnalysisResponse }
    );

    setShowModal(false);
    setShowFirstText(false);
    setShowSecondText(false);
    setShowLoader(false);

    navigate(
      `/main/personal/dashboard/category-list/topic-list/topic-page/analysis/${categoryID}/${materialID}/${id}`
    );
  };

  return (
    <div className="poppins mcolor-900 mbg-200 relative flex">
      <Sidebar
        currentPage={
          categoryFor === "Personal"
            ? "personal-study-area"
            : "group-study-area"
        }
      />

      <div
        className={`h-[100vh] flex flex-col items-center justify-between py-2 ${
          extraLargeDevices && "w-1/6"
        } mbg-800`}
      ></div>

      <div
        className={`flex-1 mbg-200 w-full ${
          extraSmallDevice ? "px-1" : "px-5"
        } py-5 h-full`}
      >
        {/* navbar */}

        <div className="flex items-center mt-6">
          <EqualizerIcon
            sx={{ fontSize: 38 }}
            className="mr-1 mb-1 mcolor-700"
          />
          <div className="mcolor-900 flex justify-between items-center">
            <div className="flex justify-between items-start">
              <div
                className={`flex gap-3 items-center ${
                  extraLargeDevices || largeDevices
                    ? "text-2xl"
                    : extraSmallDevice
                    ? "text-lg"
                    : "text-xl"
                }`}
              >
                <button
                  onClick={() => {
                    let linkBack = "";
                    if (categoryFor === "Personal") {
                      linkBack = `/main/personal/dashboard/category-list/topic-list/${materialID}`;
                    } else {
                      linkBack = `/main/group/dashboard/category-list/topic-list/${groupId}/${materialID}`;
                    }

                    navigate(linkBack, {
                      state: {
                        filter: filter,
                        performanceStatus: performanceStatus,
                        tag: tag,
                      },
                    });
                  }}
                >
                  Topic List
                </button>
                <i class="fa-solid fa-chevron-right"></i>
                <p className="font-bold">Topic Page</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div
            className={`my-6 w-full flex ${
              extraLargeDevices ? "flex-row" : "flex-col-reverse"
            } items-center justify-center mbg-input rounded border-medium-800 py-4`}
          >
            <div className="w-full">
              <p className="text-center mcolor-800 mb-2 font-bold">
                Overall Performance
              </p>
              <BarChart
                labelSet={studyMaterials.map((material) =>
                  new Date(material.updatedAt).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })
                )}
                dataGathered={studyMaterials.map((material) =>
                  (
                    (parseFloat(material.assessmentImp) +
                      parseFloat(material.assessmentScorePerf) +
                      parseFloat(material.confidenceLevel)) /
                    3
                  ).toFixed(2)
                )}
                maxBarValue={100}
                labelTop={"Assessment Score Performance"}
              />
            </div>
            <div className="w-1/2 mb-8 mt-2">
              <p className="text-center mcolor-800 mb-2 font-bold mb-2">
                Preparation Counts
              </p>
              <div className="min-h-[40vh]">
                <PieChart dataGathered={[unpreparedLength, preparedLength]} />
              </div>
            </div>
          </div>

          <div className="mbg-input border-medium-800 min-h-[40vh] rounded-[5px] mt-7 overflow-x-auto">
            <table
              className={`w-full rounded-[5px] ${
                extraSmallDevice ? "text-sm" : "text-md"
              }`}
            >
              <thead className="mbg-800 mcolor-100">
                <tr>
                  <td className="text-center py-3 px-5 font-medium">#</td>
                  <td className="text-center py-3 px-5 font-medium">Date</td>
                  <td className="text-center py-3 px-5 font-medium">
                    Pre-Assessment <br />
                    Score
                  </td>
                  <td className="text-center py-3 px-5 font-medium">
                    Assessment <br /> Score
                  </td>
                  <td className="text-center py-3 px-5 font-medium">
                    Completion <br /> Time
                  </td>
                  <td className="text-center py-3 px-5 font-medium">
                    Improvement
                  </td>
                  <td className="text-center py-3 px-5 font-medium">
                    Score <br /> Performance
                  </td>
                  <td className="text-center py-3 px-5 font-medium">
                    Confidence <br /> Level
                  </td>
                  <td className="text-center py-3 px-5 font-medium">
                    Preparation <br /> Status
                  </td>
                </tr>
              </thead>
              <tbody>
                {studyMaterials.map((item, index) => {
                  return (
                    <tr
                      className="border-bottom-thin-gray rounded-[5px]"
                      key={index}
                    >
                      <td className="text-center py-3 mcolor-800">
                        {item.numOfTakes}
                      </td>
                      <td className="text-center py-3 mcolor-800">
                        {new Date(item.updatedAt).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      <td className="text-center py-3 mcolor-800">
                        {item.preAssessmentScore}/{item.overAllItems}
                      </td>
                      <td className="text-center py-3 mcolor-800">
                        {item.assessmentScore}/{item.overAllItems}
                      </td>

                      <td className="text-center py-3 mcolor-800">
                        {item.completionTime}
                      </td>

                      <td className="text-center py-3 mcolor-800">
                        {item.assessmentImp}%
                      </td>

                      <td className="text-center py-3 mcolor-800">
                        {item.assessmentScorePerf}%
                      </td>
                      <td className="text-center py-3 mcolor-800">
                        {item.confidenceLevel}%
                      </td>
                      <td className="text-center py-3 mcolor-800">
                        {(
                          (parseFloat(item.assessmentImp) +
                            parseFloat(item.assessmentScorePerf) +
                            parseFloat(item.confidenceLevel)) /
                          3
                        ).toFixed(2) >= preferredStudyProf
                          ? "Prepared"
                          : "Unprepared"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {showModal === true && (
            <div className={`absolute top-0 modal-bg left-0 w-full h-full`}>
              <div className="flex items-center justify-center h-full">
                <div
                  className={`relative mbg-100 min-h-[40vh] ${
                    extraLargeDevices || largeDevices
                      ? "w-1/2"
                      : mediumDevices || smallDevice
                      ? "w-2/3"
                      : "w-full mx-2"
                  } z-10 relative p-10 rounded-[5px]`}
                >
                  {showFirstText === true && (
                    <div>
                      <p className="text-center font-medium mcolor-800 pt-10">
                        No analysis has been recorded. Would you like to
                        generate an analysis for the given data?
                      </p>

                      <div className="w-full absolute bottom-10 flex items-center justify-center left-0 gap-4">
                        <button
                          className="mbg-200 border-thin-800 px-5 py-2 rounded-[5px]"
                          onClick={() => {
                            setShowModal(false);
                            setShowFirstText(false);
                            setShowSecondText(false);
                          }}
                        >
                          No
                        </button>

                        <button
                          className="mbg-800 mcolor-100 border-thin-800 px-5 py-2 rounded-[5px]"
                          onClick={() => {
                            setShowFirstText(false);
                            setShowSecondText(true);
                          }}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  )}

                  {showSecondText === true && (
                    <div>
                      <p className="text-center font-medium mcolor-800 mt-5">
                        Kindly be advised that the data analysis process by the
                        system AI may require 2-3 minutes, depending on your
                        internet speed. Would you be comfortable waiting for
                        that duration?
                      </p>

                      <div className="w-full absolute bottom-10 flex items-center justify-center left-0 gap-4">
                        <button
                          className="mbg-200 border-thin-800 px-5 py-2 rounded-[5px]"
                          onClick={() => {
                            setShowModal(false);
                            setShowFirstText(false);
                            setShowSecondText(false);
                          }}
                        >
                          No
                        </button>

                        <button
                          className="mbg-800 mcolor-100 border-thin-800 px-5 py-2 rounded-[5px]"
                          onClick={() =>
                            generateAnalysis(currentAnalysisId, currentIndex)
                          }
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  )}

                  {showLoader === true && (
                    <div class="loading-container">
                      <p class="loading-text mcolor-900">Analyzing data...</p>
                      <div class="loading-spinner"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
