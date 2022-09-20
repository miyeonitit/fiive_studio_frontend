import {
  useMeetingManager,
  VideoTileGrid,
  useLocalVideo,
  useMeetingStatus,
} from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";

const Meeting = () => {
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();
  const { toggleVideo } = useLocalVideo();

  const joinMeeting = async () => {
    // Fetch the meeting and attendee data from your server application
    // const response = await fetch("/my-server");
    // const data = await response.json();

    const data = {
      Meeting: {
        MeetingId: "deb9c356-ca73-417b-bffa-f611513e0706",
        ExternalMeetingId: "EXTERNAL_MEETING_ID",
        MediaPlacement: {
          AudioHostUrl:
            "fdec8bfedf3f8b5759cbc8627de1a014.k.m3.an2.app.chime.aws:3478",
          AudioFallbackUrl:
            "wss://haxrp.m3.an2.app.chime.aws:443/calls/deb9c356-ca73-417b-bffa-f611513e0706",
          ScreenDataUrl:
            "wss://bitpw.m3.an2.app.chime.aws:443/v2/screen/deb9c356-ca73-417b-bffa-f611513e0706",
          ScreenSharingUrl:
            "wss://bitpw.m3.an2.app.chime.aws:443/v2/screen/deb9c356-ca73-417b-bffa-f611513e0706",
          ScreenViewingUrl:
            "wss://bitpw.m3.an2.app.chime.aws:443/ws/connect?passcode=null&viewer_uuid=null&X-BitHub-Call-Id=deb9c356-ca73-417b-bffa-f611513e0706",
          SignalingUrl:
            "wss://signal.m3.an2.app.chime.aws/control/deb9c356-ca73-417b-bffa-f611513e0706",
          TurnControlUrl: "https://ccp.cp.ue1.app.chime.aws/v2/turn_sessions",
          EventIngestionUrl:
            "https://data.svc.ue1.ingest.chime.aws/v1/client-events",
        },
        MediaRegion: "ap-northeast-2",
      },
      Attendee: {
        ExternalUserId: "teacher",
        AttendeeId: "6e385eb3-5805-3ead-99b8-8ce46c9156bc",
        JoinToken:
          "NmUzODVlYjMtNTgwNS0zZWFkLTk5YjgtOGNlNDZjOTE1NmJjOjk4NDViOTFkLTg2YjQtNGE1MC05ZGVlLTc1ZGQxOThlYmNjOQ",
      },
    };

    // Initalize the `MeetingSessionConfiguration`
    const meetingSessionConfiguration = new MeetingSessionConfiguration(
      data.Meeting,
      data.Attendee
    );

    // Create a `MeetingSession` using `join()` function with the `MeetingSessionConfiguration`
    await meetingManager.join(meetingSessionConfiguration);

    // At this point you could let users setup their devices, or by default
    // the SDK will select the first device in the list for the kind indicated
    // by `deviceLabels` (the default value is DeviceLabels.AudioAndVideo)
    // ...

    // Start the `MeetingSession` to join the meeting
    await meetingManager.start();
  };

  const leaveMeeting = async () => {
    await meetingManager.leave();
  };

  return (
    <div>
      <h2>Meeting</h2>

      <button onClick={joinMeeting}>Join</button>
      <button onClick={leaveMeeting}>Leave</button>
      <VideoTileGrid />
      <button onClick={toggleVideo}>Toggle video</button>
      <p>Meeting status: {meetingStatus}</p>
    </div>
  );
};

export default Meeting;
