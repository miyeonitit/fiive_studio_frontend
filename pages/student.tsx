import React, { useEffect, ReactElement } from "react";
import Layout from "../components/DemoLayout";
import { NextPageWithLayout } from "../types/NextPageWithLayout";
import Head from "next/head";
import Video from "../components/Video";

import {
  useMeetingManager,
  useLocalVideo,
  useMeetingStatus,
  LocalVideo,
} from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";

const StudentView: NextPageWithLayout = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const { toggleVideo } = useLocalVideo();

  useEffect(() => {});

  const joinMeeting = async () => {
    const meeting = await fetchMeeting();
    const attendee = await fetchAttendee(meeting);

    // Initalize the `MeetingSessionConfiguration`
    const meetingSessionConfiguration = new MeetingSessionConfiguration(
      meeting,
      attendee
    );

    // Create a `MeetingSession` using `join()` function with the `MeetingSessionConfiguration`
    await meetingManager.join(meetingSessionConfiguration);

    // Start the `MeetingSession` to join the meeting
    await meetingManager.start();
  };

  const fetchMeeting = async () => {
    const resp = await fetch(`${baseUrl}/demo/meeting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { Meeting = null } = await resp.json();
    return Meeting;
  };

  const fetchAttendee = async ({ MeetingId }) => {
    const form = new URLSearchParams({
      meeting_id: MeetingId,
      user_id: "teacher",
    });

    const resp = await fetch(`${baseUrl}/demo/attendee`, {
      method: "POST",
      body: form,
    });

    const { Attendee = null } = await resp.json();
    return Attendee;
  };

  const leaveMeeting = async () => {
    await meetingManager.leave();
  };

  return (
    <div className="student page">
      <Head>
        <title>LSS Student view</title>
        <meta name="description" content="LSS frontend student view" />
      </Head>

      <div className="display">
        <Video />
        <LocalVideo className="my-video" />
      </div>

      <div className="controls">
        <div className="row join-leave">
          <div className="col">
            <button
              onClick={joinMeeting}
              type="button"
              className="btn btn-primary"
            >
              강의실 입장
            </button>
          </div>

          <div className="col">
            <button
              onClick={leaveMeeting}
              type="button"
              className="btn btn-primary"
            >
              강의실 퇴장
            </button>
          </div>
        </div>

        <button
          onClick={toggleVideo}
          type="button"
          className="btn btn-outline-primary"
        >
          송출 토글
        </button>

        <p>Meeting status: {meetingStatus}</p>
      </div>
    </div>
  );
};

StudentView.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default StudentView;
