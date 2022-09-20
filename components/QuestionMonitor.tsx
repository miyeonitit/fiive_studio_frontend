import TeacherQuestionItem from "./TeacherQuestionItem";
// import useStore from "../store/video";
import { useEffect, useState } from "react";

const QuestionMonitor = () => {
  // const questions = useStore((state: any) => state.questions);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const messageListener = ({ data }) => {
      setQuestions(data);
    };

    window.addEventListener("message", messageListener);

    return () => {
      window.removeEventListener("message", messageListener);
    };
  });

  return (
    <div className="question-monitor">
      {questions.map((item: any, idx: number) => (
        <TeacherQuestionItem
          key={item.id}
          number={idx + 1}
          resolved={item.resolved}
          content={item.content}
          item={item}
        ></TeacherQuestionItem>
      ))}
    </div>
  );
};

export default QuestionMonitor;
