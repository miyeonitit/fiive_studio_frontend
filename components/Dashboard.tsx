import Item from "./DashboardItem";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Item value="0:00:00" label="진행 시간" />
      <Item value="n명" label="참여자 수" />
      <Item value="n명" label="수강 권한 있는 수" />
      <Item value="n명" label="chat 활성화 수" />
      <Item value="100%" label="CPU" light={true} />
      <Item value="60" label="FPS" />
      <Item value="1GB" label="메모리" />
      <Item value="매우 좋음" label="연결상태" light={true} />
    </div>
  );
};

export default Dashboard;
