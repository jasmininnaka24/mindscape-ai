import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react"


const appId = "e1a71358af0449babf2472879f94b68c"
const token = "007eJxTYLBmWSDkbnjM7nWczYVTj5ctP3b60435vefW7QjIm3Fva9pRBYZUw0RzQ2NTi8Q0AxMTy6TEpDQjE3MjC3PLNEuTJDOL5IiZEakNgYwMH3s+sTAyQCCIL8CQXpRfWqBbXFKaUqlblJ+fy8AAAPBKJ8E="

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token }
export const useClient = createClient(config)
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "group-study-room";