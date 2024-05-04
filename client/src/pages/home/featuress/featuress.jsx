import React from "react";
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

  return (
    <div className="min-h-[100vh] w-full pb-10">
      <div className="w-full">
        <div className="py-6 nav mcolor-100">nav</div>
        <div className="features-page w-full" data-aos="fade-up">
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
            <li className="border-medium-800 rounded h-full">
              <div className="p-3">
                <div style={{ height: "12.2rem", width: "100%" }}>
                  <img
                    className="h-100 w-full object-cover rounded border-thin-800"
                    src={StudyRooms}
                    alt=""
                  />
                </div>
              </div>
              <p className="pt-3 pb-2 text-center text-xl font-bold">
                Personal and Group Study Rooms
              </p>
              <p className="text-center px-3 pt-1 pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi impedit iste possimus perferendis error similique!
              </p>
            </li>
            <li className="border-medium-800 rounded h-full">
              <div className="p-3">
                <div style={{ height: "12.2rem", width: "100%" }}>
                  <img
                    className="h-100 w-full object-cover rounded border-thin-800"
                    src={ReviewerGenerator}
                    alt=""
                  />
                </div>
              </div>
              <p className="pt-3 pb-2 text-center text-xl font-bold">
                AI Reviewer Generator
              </p>
              <p className="text-center px-3 pt-1 pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi impedit iste possimus perferendis error similique!
              </p>
            </li>
            <li className="border-medium-800 rounded h-full">
              <div className="p-3">
                <div style={{ height: "11.9rem", width: "100%" }}>
                  <img
                    className="h-100 w-full object-cover rounded border-thin-800"
                    src={QuizGenerator}
                    alt=""
                  />
                </div>
              </div>
              <p className="pt-3 pb-2 text-center text-xl font-bold">
                AI Quiz Generator
              </p>
              <p className="text-center px-3 pt-1 pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi impedit iste possimus perferendis error similique!
              </p>
            </li>

            <li className="border-medium-800 rounded h-full">
              <div className="p-3">
                <div style={{ height: "11rem", width: "100%" }}>
                  <img
                    className="h-100 w-full object-cover rounded border-thin-800"
                    src={Gamification}
                    alt=""
                  />
                </div>
              </div>
              <p className="pt-3 pb-2 text-center text-xl font-bold">
                Gamification
              </p>
              <p className="text-center px-3 pt-1 pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi impedit iste possimus perferendis error similique!
              </p>
            </li>
            <li className="border-medium-800 rounded h-full">
              <div className="p-3">
                <div style={{ height: "11rem", width: "100%" }}>
                  <img
                    className="h-100 w-full object-cover rounded border-thin-800"
                    src={RealTimeStudySession}
                    alt=""
                  />
                </div>
              </div>
              <p className="pt-3 pb-2 text-center text-xl font-bold">
                Real-time Study Session
              </p>
              <p className="text-center px-3 pt-1 pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi impedit iste possimus perferendis error similique!
              </p>
            </li>
            <li className="border-medium-800 rounded h-full">
              <div className="p-3">
                <div style={{ height: "11rem", width: "100%" }}>
                  <img
                    className="h-100 w-full object-cover rounded border-thin-800"
                    src={RealTimeAssessmentSession}
                    alt=""
                  />
                </div>
              </div>
              <p className="pt-3 pb-2 text-center text-xl font-bold">
                Real-time Assessment Session
              </p>
              <p className="text-center px-3 pt-1 pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi impedit iste possimus perferendis error similique!
              </p>
            </li>
            <li className="border-medium-800 rounded h-full">
              <div className="p-3">
                <div style={{ height: "12.8rem", width: "100%" }}>
                  <img
                    className="h-100 w-full object-cover rounded border-thin-800"
                    src={ProgressDashboard}
                    alt=""
                  />
                </div>
              </div>
              <p className="pt-3 pb-2 text-center text-xl font-bold">
                Analytics
              </p>
              <p className="text-center px-3 pt-1 pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi impedit iste possimus perferendis error similique!
              </p>
            </li>
            <li className="border-medium-800 rounded h-full">
              <div className="p-3">
                <div style={{ height: "12.8rem", width: "100%" }}>
                  <img
                    className="h-100 w-full object-cover rounded border-thin-800"
                    src={DiscussionForums}
                    alt=""
                  />
                </div>
              </div>
              <p className="pt-3 pb-2 text-center text-xl font-bold">
                Discussion Forums
              </p>
              <p className="text-center px-3 pt-1 pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi impedit iste possimus perferendis error similique!
              </p>
            </li>
            <li className="border-medium-800 rounded h-full">
              <div className="p-3">
                <div style={{ height: "12.8rem", width: "100%" }}>
                  <img
                    className="h-100 w-full object-cover rounded border-thin-800"
                    src={VirtualLibraryRoom}
                    alt=""
                  />
                </div>
              </div>
              <p className="pt-3 pb-2 text-center text-xl font-bold">
                Virtual Library Room
              </p>
              <p className="text-center px-3 pt-1 pb-5">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi impedit iste possimus perferendis error similique!
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
