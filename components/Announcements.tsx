import { useEffect } from "react";
import useStore from "../store/video";

interface ItemProps {
  id: string;
  content: string;
  dismiss: (id: string) => void;
}

const Item = (props: ItemProps) => {
  useEffect(() => {
    /* NOTE: Users have to manually dismiss announcements
    const timeout = setTimeout(() => {
      props.remove(props.id);
    }, 3000);

    // Cleanup
    return () => {
      clearTimeout(timeout);
    };
    */
  });

  return (
    <li>
      <div className="alert alert-info">
        <div>{props.content}</div>

        <button
          onClick={(e) => {
            props.dismiss(props.id);
          }}
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </li>
  );
};

const Announcements = () => {
  const remove = useStore((state) => state.removeAnnouncement);
  const items = useStore((state) => state.announcements);

  return (
    <ol className="announcements">
      {items.map((item) => (
        <Item
          key={item.id}
          id={item.id}
          content={item.content}
          dismiss={remove}
        ></Item>
      ))}
    </ol>
  );
};

export default Announcements;
