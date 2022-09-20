// import Layout from "../../components/FiiveLearnerLayout";
import { NextPageWithLayout } from "../../types/NextPageWithLayout";
import dynamic from "next/dynamic";

const ChatMonitor = dynamic(() => import("../../components/ChatMonitor"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const ChatMonitorPage: NextPageWithLayout = () => {
  return (
    <div className="fiive chat-monitor page">
      <ChatMonitor userId="teacher"></ChatMonitor>
    </div>
  );
};

// ChatMonitorPage.getLayout = (page: ReactElement) => {
//   return <Layout>{page}</Layout>;
// };

export default ChatMonitorPage;
