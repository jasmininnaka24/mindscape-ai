import React, { useState } from "react";
import { useResponsiveSizes } from "../../../components/useResponsiveSizes";
import ReviewerGenerator from "../../../assets/reviewer_generator.png";
import QuizGenerator from "../../../assets/quiz_generator.png";
import RealTimeStudySession from "../../../assets/real_time_study_session.png";
import RealTimeAssessmentSession from "../../../assets/real_time_assessment_session.png";
import StudyRooms from "../../../assets/study_rooms.png";
import ProgressDashboard from "../../../assets/progress_dashboard.png";
import Gamification from "../../../assets/gamification.png";
import VirtualLibraryRoom from "../../../assets/virtual_library_room.png";
import DiscussionForums from "../../../assets/discussion_forums.png";

export const Features = () => {
  const {
    extraSmallDevice,
    largeDevices,
    extraLargeDevices,
    mediumDevices,
    smallDevice,
  } = useResponsiveSizes();

  const featureData = [
    {
      id: 1,
      name: "Personal and Group Study Rooms",
      imageUrl: StudyRooms,
      description:
        "This feature allows users to create and join virtual study rooms where they can collaborate with others, share resources, and engage in group study sessions.",
    },
    {
      id: 2,
      name: "AI Reviewer Generator",
      imageUrl: ReviewerGenerator,
      description:
        "This feature utilizes artificial intelligence to automatically generate review materials such as summarized notes, or key points from study materials, making it easier for users to review and retain information.",
    },
    {
      id: 3,
      name: "AI Quiz Generator",
      imageUrl: QuizGenerator,
      description:
        "This feature uses artificial intelligence algorithms to automatically generate customized quizzes based on users' study materials. Quizzes are in a form of multiple choice, fill in the blanks, true or flase, and identification.",
    },
    {
      id: 4,
      name: "Gamification",
      imageUrl: Gamification,
      description:
        "Gamification integrates real-time game elements into the learning experience to increase engagement and motivation. Users earn points, or rewards as they progress through learning activities, making the process more enjoyable and rewarding.",
    },
    {
      id: 5,
      name: "Real-time Study Session",
      imageUrl: RealTimeStudySession,
      description:
        "This feature enables users to participate in live study sessions with peers in real-time. It allows for interactive discussions, Q&A sessions, and collaborative environment.",
    },
    {
      id: 6,
      name: "Real-time Assessment Session",
      imageUrl: RealTimeAssessmentSession,
      description:
        "Similar to the real-time study session, this feature facilitates live assessments or quizzes conducted in real-time. It provides immediate feedback to users on their performance, allowing for quick identification of areas for improvement.",
    },
    {
      id: 7,
      name: "Analytics",
      imageUrl: ProgressDashboard,
      description:
        "The analytics feature provides users with insights and data analytics on their learning progress and performance. It includes visualizations, charts, and reports that track whether they are passing or not.",
    },
    {
      id: 8,
      name: "Discussion Forums",
      imageUrl: DiscussionForums,
      description:
        "This feature provides an online platform for users to engage in discussions, ask questions, and exchange ideas with peers and instructors. It fosters collaboration, critical thinking, and knowledge-sharing within the learning community.",
    },
    {
      id: 9,
      name: "Virtual Library Room",
      imageUrl: VirtualLibraryRoom,
      description:
        "The virtual library room feature offers users access to a digital library where they can explore, search, and access a wide range of educational resources, including the shared study materials from other users.",
    },
  ];

  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
  };

  const handleCloseModal = () => {
    setSelectedFeature(null);
  };

  return (
    <div className="min-h-[100vh] w-full pb-10">
      <div className="w-full">
        <div className="py-6 nav mcolor-100">nav</div>
        <div className="features-page w-full relative" data-aos="fade-up">
          {/* top */}
          <div className="flex justify-between items-center">
            <div className={`${!extraSmallDevice ? "line" : ""}`}></div>
            <h2
              className={`${
                !extraSmallDevice ? "text-4xl" : "text-2xl"
              } font-bold text-center py-10 lora`}
            >
              Major Features
            </h2>
            <div className={`${!extraSmallDevice ? "line" : ""}`}></div>
          </div>

          {/* 2 boxes container */}
          <ul
            className={`grid ${
              extraLargeDevices || largeDevices
                ? "grid-cols-3 text-md"
                : extraSmallDevice
                ? "grid-cols-1 text-xs"
                : "grid-cols-2 text-sm"
            } gap-8 h-full`}
          >
            {featureData.map((feature) => (
              <li
                key={feature.id}
                className="border-medium-800 rounded h-full cursor-pointer"
                onClick={() => handleFeatureClick(feature)}
              >
                <div className="p-3">
                  <div style={{ height: "12.2rem", width: "100%" }}>
                    <img
                      className="h-100 w-full object-cover rounded border-thin-800"
                      src={feature.imageUrl}
                      alt=""
                    />
                  </div>
                </div>
                <p className="pt-3 pb-2 text-center text-xl font-bold">
                  {feature.name}
                </p>
                <p className="pb-5 px-4 text-center text-md">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>

          {/* Modal for displaying selected feature */}
          {selectedFeature && (
            <div
              className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
              onClick={handleCloseModal}
            >
              <div className="bg-white rounded-lg relative p-5 m-8">
                <button
                  className="absolute top-0 right-2 m-2 text-gray-700 hover:text-gray-900"
                  onClick={handleCloseModal}
                >
                  <i className="fa fa-times text-2xl" aria-hidden="true"></i>
                </button>
                <img
                  className="max-w-full max-h-full"
                  src={selectedFeature.imageUrl}
                  alt={selectedFeature.name}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
