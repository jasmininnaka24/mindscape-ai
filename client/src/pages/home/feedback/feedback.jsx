import React from "react";
import { useResponsiveSizes } from "../../../components/useResponsiveSizes";

import f1 from "../../../assets/f1.jpg";
import f2 from "../../../assets/f2.jpg";
import f3 from "../../../assets/f3.jpg";
import f4 from "../../../assets/f4.jpg";

export const Feedback = () => {
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
              Users' Feedback
            </h2>
            <div className={`${!extraSmallDevice ? "line" : ""}`}></div>
          </div>

          {/* 2 boxes container */}
          <ul
            className={`grid ${
              extraLargeDevices || largeDevices
                ? "grid-cols-4 text-md"
                : extraSmallDevice
                ? "grid-cols-1 text-xs"
                : "grid-cols-2 text-sm"
            } gap-5 h-full mbg-800 opacity-95 p-6`}
          >
            <li className="border-medium-800 rounded h-full">
              <div style={{ minHeight: "12.2rem", width: "100%" }}>
                <img
                  className="h-100 w-full object-cover rounded"
                  src={f1}
                  alt=""
                />
              </div>
            </li>
            <li className="border-medium-800 rounded h-full">
              <div style={{ minHeight: "12.2rem", width: "100%" }}>
                <img
                  className="h-100 w-full object-cover rounded"
                  src={f2}
                  alt=""
                />
              </div>
            </li>
            <li className="border-medium-800 rounded h-full">
              <div style={{ minHeight: "12.2rem", width: "100%" }}>
                <img
                  className="h-100 w-full object-cover rounded"
                  src={f3}
                  alt=""
                />
              </div>
            </li>
            <li className="border-medium-800 rounded h-full">
              <div style={{ minHeight: "12.2rem", width: "100%" }}>
                <img
                  className="h-100 w-full object-cover rounded"
                  src={f4}
                  alt=""
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
