import React from "react";
import "./benefits.css";
import resonsibilityPic from "../../../assets/responsibility.png";
import { useResponsiveSizes } from "../../../components/useResponsiveSizes";

export const Benefits = () => {
  const {
    extraSmallDevice,
    smallDevice,
    mediumDevices,
    largeDevices,
    extraLargeDevices,
  } = useResponsiveSizes();

  return (
    <div className="min-h-[100vh] flex items-center justify-center pb-10">
      <div>
        <div className="pt-1 nav mcolor-100">nav</div>
        <div className="benefits-page" data-aos="fade-up">
          {/* top */}
          <div className="flex justify-between items-center">
            <div className={`${!extraSmallDevice ? "line" : ""}`}></div>
            <h2
              className={`${
                !extraSmallDevice ? "text-4xl" : "text-2xl"
              } font-bold text-center py-10`}
            >
              Benefits of MindScape
            </h2>
            <div className={`${!extraSmallDevice ? "line" : ""}`}></div>
          </div>

          {/* 2 boxes container */}
          <div
            className={`flex ${
              !largeDevices && !extraLargeDevices
                ? "flex-col-reverse text-justify"
                : "flex-row text-justify"
            } justify-between items-center mbg-800 px-8 py-4 rounded gap-10 opacity-95`}
          >
            {/* information about the app */}
            <div
              className={`box-border-right ${
                !largeDevices && !extraLargeDevices ? "w-full mt-5" : "w-3/4"
              }`}
            >
              <div>
                <p className="text-justify text-lg my-4 poppins text-white">
                  Through the use of the Mindscape application, students can
                  experience a transformative impact on their educational
                  journey. This innovative platform goes beyond traditional
                  learning methods, offering students the opportunity to achieve
                  enhanced academic performance, foster growth development, and
                  provide an enriched overall learning experience.
                </p>
                <p className="text-justify text-lg my-4 poppins text-white">
                  The collaborative features of Mindscape create a dynamic
                  learning environment, facilitating interaction and
                  knowledge-sharing among users. This collaborative aspect not
                  only enhances the academic experience but also prepares
                  students for the collaborative nature of their future
                  workplaces.
                </p>
                <p className="text-justify text-lg my-4 poppins text-white">
                  Moreover, Mindscape empowers students with personalized
                  learning pathways, catering to individual learning styles and
                  pace. With adaptive algorithms, the platform identifies areas
                  of strength and weakness, offering tailored resources and
                  exercises to maximize learning outcomes.
                </p>
              </div>
            </div>

            {/* image */}
            <div
              className={`box-border-left bg-white flex items-center justify-center py-12 rounded ${
                !largeDevices && !extraLargeDevices ? "w-full" : "w-1/3"
              }`}
            >
              <img
                className={
                  !largeDevices && !extraLargeDevices ? "w-1/2" : "w-[80%]"
                }
                src={resonsibilityPic}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
