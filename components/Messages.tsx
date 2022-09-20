const Messages = (props: any) => {
  const { messages = [] } = props;
  const items = messages.map((item) => <li key={item.id}>{item.message}</li>);
  return <ul className="messages">{items}</ul>;
};

export default Messages;
