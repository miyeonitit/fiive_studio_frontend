import TeacherQuestionItem from "./TeacherQuestionItem";
import { useState } from "react";
import useStore from "../store/video";

const TeacherQuestionWidget = () => {
  const [tabIdx, setTabIdx] = useState(0);
  const questions = useStore((state) => state.questions);

  const newQuestions = () => {
    return questions.filter((item) => item.resolved === false);
  };

  const resolvedQuestions = () => {
    return questions.filter((item) => item.resolved === true);
  };

  return (
    <div className="teacher-question-widget">
      <nav>
        <ol>
          <li className={`${tabIdx === 0 ? "active" : ""}`}>
            <button onClick={() => setTabIdx(0)} type="button">
              새로운 질문
            </button>
          </li>

          <li className={`${tabIdx === 1 ? "active" : ""}`}>
            <button onClick={() => setTabIdx(1)} type="button">
              해결된 질문
            </button>
          </li>
        </ol>
      </nav>

      <div className="tabs">
        {tabIdx === 0 ? (
          <div className="new">
            {newQuestions().map((item, idx) => (
              <TeacherQuestionItem
                key={item.id}
                number={idx + 1}
                resolved={item.resolved}
                content={item.content}
                item={item}
              ></TeacherQuestionItem>
            ))}
          </div>
        ) : (
          <div className="answered">
            {resolvedQuestions().map((item, idx) => (
              <TeacherQuestionItem
                key={item.id}
                number={idx + 1}
                resolved={item.resolved}
                content={item.content}
                item={item}
              ></TeacherQuestionItem>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherQuestionWidget;
