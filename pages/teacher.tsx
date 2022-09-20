import React, { useEffect, useState, ReactElement } from "react";
import Layout from "../components/DemoLayout";
import { NextPageWithLayout } from "../types/NextPageWithLayout";
import Head from "next/head";
import Video from "../components/Video";

import {
  useMeetingManager,
  useLocalVideo,
  useMeetingStatus,
  VideoTileGrid,
} from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";

const TeacherView: NextPageWithLayout = () => {
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

  const fetchChannel = async () => {
    const resp = await fetch(`${baseUrl}/demo/channel`, {
      method: "GET",
    });

    const { channels = [] } = await resp.json();

    const channel = channels.find((item: any) => {
      return !item.authrozied;
    });

    return channel;
  };

  const [metadata, setMetadata] = useState("");

  const updateMetadata = (e) => {
    setMetadata(e.target.value);
  };

  const embedMetadata = async () => {
    const channel = await fetchChannel();

    const form = new URLSearchParams({
      arn: channel.arn,
      data: JSON.stringify({ message: metadata }),
    });

    const resp = await fetch(`${baseUrl}/demo/channel/metadata`, {
      method: "POST",
      body: form,
    });

    setMetadata("");
  };

  return (
    <div className="teacher page">
      <Head>
        <title>LSS Student view</title>
        <meta name="description" content="LSS frontend student view" />
      </Head>

      <div className="display">
        <Video />
        <VideoTileGrid className="tile-view" />
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

        <p>Meeting status: {meetingStatus}</p>

        <form className="metadata">
          <input
            onInput={updateMetadata}
            value={metadata}
            type="text"
            className="form-control mb-2"
          />

          <button
            onClick={embedMetadata}
            type="button"
            className="btn btn-secondary"
          >
            메타데이터 임베딩
          </button>
        </form>
      </div>
    </div>
  );
};

TeacherView.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TeacherView;
