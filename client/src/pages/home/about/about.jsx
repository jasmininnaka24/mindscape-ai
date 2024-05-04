import React from "react";
import "./about.css";
import studyPic from "../../../assets/study.png";
import { useResponsiveSizes } from "../../../components/useResponsiveSizes";

export const About = () => {
  const {
    extraSmallDevice,
    smallDevice,
    mediumDevices,
    largeDevices,
    extraLargeDevices,
  } = useResponsiveSizes();

  return (
    <div className="">
      <div className="py-6 nav mcolor-100">nav</div>
      <div className="about-page" data-aos="fade-up">
        {/* top */}
        <div className="flex justify-between items-center">
          <div className={`${!extraSmallDevice ? "line" : ""}`}></div>
          <h2
            className={`${
              !extraSmallDevice ? "text-4xl" : "text-2xl"
            } font-bold text-center py-10 lora`}
          >
            What is MindScape about?
          </h2>
          <div className={`${!extraSmallDevice ? "line" : ""}`}></div>
        </div>

        {/* 2 boxes container */}
        <div
          className={`flex ${
            !largeDevices && !extraLargeDevices
              ? "flex-col text-justify"
              : "flex-row text-justify"
          } justify-between items-center`}
        >
          {/* image */}
          <div
            className={`box-border-left flex items-center justify-center ${
              !largeDevices && !extraLargeDevices ? "w-full" : "w-1/3"
            }`}
          >
            <img
              className={
                !largeDevices && !extraLargeDevices ? "w-1/2" : "w-[80%]"
              }
              src={studyPic}
              alt=""
            />
          </div>

          {/* information about the app */}
          <div
            className={`box-border-right ${
              !largeDevices && !extraLargeDevices ? "w-full mt-5" : "w-3/4"
            }`}
          >
            <div>
              <p className="text-lg my-4 poppins">
                Mindscape is a web-based application designed to enhance
                students' academic performance. This platform aims to cultivate
                students' academic abilities through artificial intelligence
                (AI) learning strategies and collaborative learning. It is
                designed to foster the growth and development of students'
                academic skills, enhancing their overall learning experience and
                nurturing exceptional abilities. Mindscape promotes
                collaborative environments and efficient task management,
                contributing to the creation of an optimal learning experience.
              </p>
              <p className="text-lg my-4 poppins">
                Mindscape enables users to explore various features that allow
                them to enhance their learning opportunities for growth-oriented
                learning and collaborative development. By harnessing advanced
                AI and deep learning technologies, Mindscape aims to assist
                students in maximizing their academic opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
