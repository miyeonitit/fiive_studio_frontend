import { useState } from "react";
import useStore from "../store/video";
import { v4 as uuidv4 } from "uuid";

interface props {
  toggle: () => void;
}

const QuestionModal = (props: props) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const channel = useStore((state) => state.channel);

  const [metadata, setMetadata] = useState("");

  const embedMetadata = async (e) => {
    e.preventDefault();

    if (channel === null) return;

    if (metadata.length) {
      const form = new URLSearchParams({
        arn: channel.arn,
        data: JSON.stringify({
          type: "QUESTION",
          message: {
            id: uuidv4(),
            content: metadata,
            resolved: false,
          },
        }),
      });

      const resp = await fetch(`${baseUrl}/demo/channel/metadata`, {
        method: "POST",
        body: form,
      });

      setMetadata("");
    }
    props.toggle();
  };

  return (
    <div className="question-modal">
      <div className="wrapper">
        <form onSubmit={embedMetadata} action="">
          <div className="form-group">
            <input
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                setMetadata(target.value);
              }}
              value={metadata}
              type="text"
              className="form-control mb-2"
            />

            <button type="submit">질문 등록</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
