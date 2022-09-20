import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import OpenChannel from "@sendbird/uikit-react/OpenChannel";

type props = {
  userId: string;
};

const Chat = (props: props) => {
  const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID;
  const { userId } = props;

  return (
    <>
      <SendbirdProvider appId={appId} userId={userId}>
        <OpenChannel channelUrl="demo" />
      </SendbirdProvider>
    </>
  );
};

export default Chat;
