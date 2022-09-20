import Image from "next/image";
import { useState } from "react";
import useStore from "../store/video";

interface props {
  openAnnouncementModal: () => void;
  openTimerModal: () => void;
}

const LectureTools = (props: props) => {
  const [questionMonitorWindow, setQuestionMonitorWindow] =
    useState<Window | null>(null);

  // Subscribe to store
  useStore.subscribe(
    (state: any) => state.questions,
    (questions) => {
      questionMonitorWindow?.postMessage(
        questions.filter((item) => item.resolved === false)
      );
    }
  );

  const openChatMonitor = () => {
    window.open(
      "/fiive/chat-monitor",
      "chat-monitor",
      "width=340,height=500px"
    );
  };

  const openQuestionMonitor = () => {
    const ref = window.open(
      "/fiive/question-monitor",
      "question-monitor",
      "width=340,height=400px"
    );

    setQuestionMonitorWindow(ref);
  };

  return (
    <div className="lecture-tools">
      <h3>강의 도구</h3>

      <ul className="buttons">
        <li>
          <button
            onClick={() => {
              props.openAnnouncementModal();
            }}
            type="button"
            className="announcement"
          >
            <Image
              src="/components/lecture-tools/announce.svg"
              alt="Announcement"
              width="24"
              height="24"
            ></Image>
            <span>공지사항</span>
          </button>
        </li>

        <li>
          <button onClick={openQuestionMonitor} type="button" className="qna">
            <Image
              src="/components/lecture-tools/qna_outlined.svg"
              alt="Q&amp;A"
              width="24"
              height="24"
            ></Image>
            <span>질의응답</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => {
              props.openTimerModal();
            }}
            type="button"
            className="timer"
          >
            <Image
              src="/components/lecture-tools/timer.svg"
              alt="Timer"
              width="24"
              height="24"
            ></Image>
            <span>타이머</span>
          </button>
        </li>

        <li>
          <button onClick={openChatMonitor} type="button" className="chat">
            <Image
              src="/components/lecture-tools/comment_outlined.svg"
              alt="Chat"
              width="24"
              height="24"
            ></Image>
            <span>채팅</span>
          </button>
        </li>
      </ul>

      <div className="add-tool-button">
        <button type="button">
          <img src="/components/lecture-tools/add.svg" alt="Add" />
          <span>강의 도구 추가</span>
        </button>
      </div>
    </div>
  );
};

export default LectureTools;
