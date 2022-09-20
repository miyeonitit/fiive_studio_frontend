type props = {
  value: string;
  label: string;
  light?: boolean;
};

const DashboardItem = (props: props) => {
  const { value, label, light = false } = props;

  return (
    // <div className="">
    <div className={`dashboard-item ${light ? "on" : ""}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
};

export default DashboardItem;
