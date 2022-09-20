// import Layout from "../../components/FiiveLearnerLayout";
import { NextPageWithLayout } from "../../types/NextPageWithLayout";
import QuestionMonitor from "../../components/QuestionMonitor";

const QuestionMonitorPage: NextPageWithLayout = () => {
  return (
    <div className="fiive question-monitor page">
      <QuestionMonitor></QuestionMonitor>
    </div>
  );
};

// QuestionMonitorPage.getLayout = (page: ReactElement) => {
//   return <Layout>{page}</Layout>;
// };

export default QuestionMonitorPage;
