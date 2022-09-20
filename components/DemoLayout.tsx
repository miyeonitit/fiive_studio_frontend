import styles from "../styles/Layout.module.css";
import NavBar from "./NavBar";

const DemoLayout = (props: any) => {
  const { children } = props;

  return (
    <div className="app-layout">
      <header className="layout-header">
        <NavBar></NavBar>
      </header>

      <div className={(styles.main, "layout-body")}>{children}</div>

      <footer className="layout-footer"></footer>
    </div>
  );
};

export default DemoLayout;
