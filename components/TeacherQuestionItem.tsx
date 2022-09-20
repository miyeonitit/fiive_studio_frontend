import { useMemo } from "react";
import useStore from "../store/video";
import Image from "next/image";

type props = {
  number: number;
  resolved: boolean;
  content: string;
  item: object;
};

const TeacherQuestionItem = (props: props) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const channel = useStore((state) => state.channel);
  const { number, resolved, content, item } = props;

  const questionNumber = useMemo(() => {
    return `Q${number}`;
  }, [number]);

  const embedMetadata = async () => {
    if (channel === null) return;

    const form = new URLSearchParams({
      arn: channel.arn,
      data: JSON.stringify({
        type: "RESOLVE_QUESTION",
        message: {
          ...item,
          resolved: true,
        },
      }),
    });

    const resp = await fetch(`${baseUrl}/demo/channel/metadata`, {
      method: "POST",
      body: form,
    });
  };

  return (
    <div
      className={`teacher-question-item ${
        resolved ? "answered" : "unanswered"
      }`}
    >
      <header>
        <span className="number">{questionNumber}</span>

        <button
          onClick={() => {
            embedMetadata();
          }}
          type="button"
        >
          {resolved ? (
            <Image
              src="/components/teacher-question-item/checked.svg"
              alt="Checked"
              width="24"
              height="24"
            ></Image>
          ) : (
            <Image
              src="/components/teacher-question-item/unchecked.svg"
              alt="Unchecked"
              width="24"
              height="24"
            ></Image>
          )}
        </button>
      </header>

      <p>{content}</p>

      <footer>
        <span className="flag">{resolved ? "해결됨" : "NEW"}</span>
        <span className="timestamp">0분전</span>
      </footer>
    </div>
  );
};

export default TeacherQuestionItem;
