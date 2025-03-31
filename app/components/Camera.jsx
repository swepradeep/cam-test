"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Line } from "rc-progress";

import {FaceDetectionProcessor} from "@videosdk.live/videosdk-media-processor-web"


const CameraComponent = () => {
  const videoRef = useRef(null);
  const videoProceRef = useRef(null);
  // const [processedStream, setProcessedStream] = useState(null);
  const [processedData, setProcessedData] = useState({});

  const faceDetectionProcessor = useMemo(() => {
    return new FaceDetectionProcessor();
  }, []);


  console.log("faceDetectionProcessor", faceDetectionProcessor);
  const handleStartFaceDetection = async () => {
    // Getting stream from webcam
    // const stream = await createCameraVideoTrack({});
    if (videoRef.current && videoRef.current.srcObject) {
      // @ts-ignore
      const processedStream = await faceDetectionProcessor?.start({
        stream: videoRef.current.srcObject,
        options: {
          interval: 500,
        },
        callback: function (data) {
          console.log(data);
          setProcessedData(data);
        },
      });
      videoProceRef.current.srcObject = processedStream;
      // setProcessedStream(processedStream);
    }
  };

  const handleStopFaceDetection = async () => {
    //@ts-ignore
    faceDetectionProcessor?.stop();
    // setProcessedStream(null);
    setProcessedData({});
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    startCamera();

    // Cleanup function to stop the camera when the component is unmounted
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
          track.stop();
        });

        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="w-[800px]">
      <h1>Camera Feed</h1>
      <div className="flex gap-4 ">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "300px", height: "auto" }}
        />
        <video
          ref={videoProceRef}
          autoPlay
          playsInline
          style={{ width: "300px", height: "auto" }}
        />
      </div>
      <div className="flex gap-4 py-5">
        <button
          className="border rounded-full px-4 py-1"
          onClick={handleStartFaceDetection}
        >
          Start Face Detection
        </button>
        <button
          className="border rounded-full px-4 py-1"
          onClick={handleStopFaceDetection}
        >
          Stop Face Detection
        </button>
      </div>
      <div className="py-5">
        <b>Number Of Faces :{processedData?.faceDetected || 0}</b>
      </div>
      <div className="w-full flex border gap-4 p-5">
        <ul style={{ width: "250px" }}>
          <li>
            Left Eye Blink :
            {(processedData?.faceLandMark?.eyeBlinkLeft || 0).toFixed(2) >= 50
              ? "YES"
              : (processedData?.faceLandMark?.eyeBlinkLeft || 0).toFixed(2) >=
                  30
                ? "MAY BE"
                : "NO"}
            :
          </li>
          <li>
            Right Eye Blink :
            {(processedData?.faceLandMark?.eyeBlinkRight || 0).toFixed(2) >= 50
              ? "YES"
              : (processedData?.faceLandMark?.eyeBlinkRight || 0).toFixed(2) >=
                  30
                ? "MAY BE"
                : "NO"}
          </li>
          <li>
            Looking Down Side :
            {(processedData?.faceLandMark?.eyeLookDownRight || 0).toFixed(2) >=
            80
              ? "YES"
              : (processedData?.faceLandMark?.eyeLookDownRight || 0).toFixed(
                    2
                  ) >= 30
                ? "MAY BE"
                : "NO"}
          </li>
          <li>
            Looking Up Side :
            {(processedData?.faceLandMark?.eyeLookUpRight || 0).toFixed(2) >= 50
              ? "YES"
              : (processedData?.faceLandMark?.eyeLookUpRight || 0).toFixed(2) >=
                  30
                ? "MAY BE"
                : "NO"}
          </li>
          <li>
            Looking Left Side :
            {(processedData?.faceLandMark?.eyeSquintLeft || 0).toFixed(2) >= 30
              ? "YES"
              : (processedData?.faceLandMark?.eyeSquintLeft || 0).toFixed(2) >=
                  20
                ? "MAY BE"
                : "NO"}
          </li>
          <li>
            Looking Right Side :
            {(processedData?.faceLandMark?.eyeSquintRight || 0).toFixed(2) >= 30
              ? "YES"
              : (processedData?.faceLandMark?.eyeSquintRight || 0).toFixed(2) >=
                  20
                ? "MAY BE"
                : "NO"}
          </li>
          <li>
            Mouth Open :
            {(processedData?.faceLandMark?.jawOpen || 0).toFixed(2) >= 50
              ? "YES"
              : (processedData?.faceLandMark?.jawOpen || 0).toFixed(2) >= 30
                ? "MAY BE"
                : "NO"}
          </li>
          <li>
            Mouth Left :
            {(processedData?.faceLandMark?.mouthLeft || 0).toFixed(2) >= 50
              ? "YES"
              : (processedData?.faceLandMark?.mouthLeft || 0).toFixed(2) >= 30
                ? "MAY BE"
                : "NO"}
          </li>
          <li>
            Mouth Right :
            {(processedData?.faceLandMark?.mouthRight || 0).toFixed(2) >= 50
              ? "YES"
              : (processedData?.faceLandMark?.mouthRight || 0).toFixed(2) >= 30
                ? "MAY BE"
                : "NO"}
          </li>
          <li>
            Speaking/Lips Movement :
            {(processedData?.faceLandMark?.mouthFunnel || 0).toFixed(2) >= 20
              ? "YES"
              : (processedData?.faceLandMark?.mouthFunnel || 0).toFixed(2) >= 10
                ? "MAY BE"
                : "NO"}
          </li>
        </ul>
        <ul style={{ listStyle: "none" }}>
          <li>
            <Line
              percent={(processedData?.faceLandMark?.eyeBlinkLeft || 0).toFixed(
                2
              )}
              strokeWidth={4}
              strokeColor={
                (processedData?.faceLandMark?.eyeBlinkLeft || 0).toFixed(2) >=
                50
                  ? "#00FF00"
                  : (processedData?.faceLandMark?.eyeBlinkLeft || 0).toFixed(
                        2
                      ) >= 30
                    ? "#0000FF"
                    : "#FF0000"
              }
            />
          </li>
          <li>
            <Line
              percent={(
                processedData?.faceLandMark?.eyeBlinkRight || 0
              ).toFixed(2)}
              strokeWidth={4}
              strokeColor={
                (processedData?.faceLandMark?.eyeBlinkRight || 0).toFixed(2) >=
                50
                  ? "#00FF00"
                  : (processedData?.faceLandMark?.eyeBlinkRight || 0).toFixed(
                        2
                      ) >= 30
                    ? "#0000FF"
                    : "#FF0000"
              }
            />
          </li>
          <li>
            <Line
              percent={(
                processedData?.faceLandMark?.eyeLookDownRight || 0
              ).toFixed(2)}
              strokeWidth={4}
              strokeColor={
                (processedData?.faceLandMark?.eyeLookDownRight || 0).toFixed(
                  2
                ) >= 50
                  ? "#00FF00"
                  : (
                        processedData?.faceLandMark?.eyeLookDownRight || 0
                      ).toFixed(2) >= 30
                    ? "#0000FF"
                    : "#FF0000"
              }
            />
          </li>
          <li>
            <Line
              percent={(
                processedData?.faceLandMark?.eyeLookUpRight || 0
              ).toFixed(2)}
              strokeWidth={4}
              strokeColor={
                (processedData?.faceLandMark?.eyeLookUpRight || 0).toFixed(2) >=
                50
                  ? "#00FF00"
                  : (processedData?.faceLandMark?.eyeLookUpRight || 0).toFixed(
                        2
                      ) >= 30
                    ? "#0000FF"
                    : "#FF0000"
              }
            />
          </li>
          <li>
            <Line
              percent={(
                processedData?.faceLandMark?.eyeSquintLeft || 0
              ).toFixed(2)}
              strokeWidth={4}
              strokeColor={
                (processedData?.faceLandMark?.eyeSquintLeft || 0).toFixed(2) >=
                30
                  ? "#00FF00"
                  : (processedData?.faceLandMark?.eyeSquintLeft || 0).toFixed(
                        2
                      ) >= 20
                    ? "#0000FF"
                    : "#FF0000"
              }
            />
          </li>
          <li>
            <Line
              percent={(
                processedData?.faceLandMark?.eyeSquintRight || 0
              ).toFixed(2)}
              strokeWidth={4}
              strokeColor={
                (processedData?.faceLandMark?.eyeSquintRight || 0).toFixed(2) >=
                30
                  ? "#00FF00"
                  : (processedData?.faceLandMark?.eyeSquintRight || 0).toFixed(
                        2
                      ) >= 20
                    ? "#0000FF"
                    : "#FF0000"
              }
            />
          </li>
          <li>
            <Line
              percent={(processedData?.faceLandMark?.jawOpen || 0).toFixed(2)}
              strokeWidth={4}
              strokeColor={
                (processedData?.faceLandMark?.jawOpen || 0).toFixed(2) >= 50
                  ? "#00FF00"
                  : (processedData?.faceLandMark?.jawOpen || 0).toFixed(2) >= 30
                    ? "#0000FF"
                    : "#FF0000"
              }
            />
          </li>
          <li>
            <Line
              percent={(processedData?.faceLandMark?.mouthLeft || 0).toFixed(2)}
              strokeWidth={4}
              strokeColor={
                (processedData?.faceLandMark?.mouthLeft || 0).toFixed(2) >= 50
                  ? "#00FF00"
                  : (processedData?.faceLandMark?.mouthLeft || 0).toFixed(2) >=
                      30
                    ? "#0000FF"
                    : "#FF0000"
              }
            />
          </li>
          <li>
            <Line
              percent={(processedData?.faceLandMark?.mouthRight || 0).toFixed(
                2
              )}
              strokeWidth={4}
              strokeColor={
                (processedData?.faceLandMark?.mouthRight || 0).toFixed(2) >= 50
                  ? "#00FF00"
                  : (processedData?.faceLandMark?.mouthRight || 0).toFixed(2) >=
                      30
                    ? "#0000FF"
                    : "#FF0000"
              }
            />
          </li>
          <li>
            <Line
              percent={(processedData?.faceLandMark?.mouthFunnel || 0).toFixed(
                2
              )}
              strokeWidth={4}
              strokeColor={
                (processedData?.faceLandMark?.mouthFunnel || 0).toFixed(2) >= 20
                  ? "#00FF00"
                  : (processedData?.faceLandMark?.mouthFunnel || 0).toFixed(
                        2
                      ) >= 10
                    ? "#0000FF"
                    : "#FF0000"
              }
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CameraComponent;
