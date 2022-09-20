const FiiveLayout = (props: any) => {
  const { children } = props;

  return (
    <div className="fiive-layout learner-layout">
      <header className="layout-header">
        <img src="/layouts/fiive/logo.svg" alt="fiive" className="branding" />

        <div className="controls">
          <button type="button" className="notifications">
            <img
              src="/layouts/fiive/notifications_outlined.svg"
              alt="Notifications"
            />

            <span className="count">99+</span>
          </button>

          <button type="button" className="account">
            <img
              src="/layouts/fiive/Avatar.svg"
              alt="Profile"
              className="profile"
            />
            <img
              src="/layouts/fiive/chevron_down_btn.svg"
              alt="Expand"
              className="expand"
            />
          </button>
        </div>
      </header>

      <div className="layout-body">{children}</div>

      <footer className="layout-footer"></footer>
    </div>
  );
};

export default FiiveLayout;
