import useStore from "../store/video";
// import { CSSTransitionGroup } from "react-transition-group";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

const Reactions = (props: any) => {
  const reactions = useStore((state: any) => state.reactions);
  const addReaction = useStore((state: any) => state.addREaction);
  const removeReaction = useStore((state: any) => state.removeReaction);

  const reaction = (type: string) => {
    let img;

    switch (type) {
      case "LIKE":
        img = <img src="/components/submit-reaction/like.v2.svg" alt="Like" />;
        break;
      case "HEART":
        img = (
          <img src="/components/submit-reaction/heart.v2.svg" alt="Heart" />
        );
        break;
      case "LIT":
        img = <img src="/components/submit-reaction/lit.v2.svg" alt="Lit" />;
        break;
      case "SMILE":
        img = (
          <img src="/components/submit-reaction/smile.v2.svg" alt="Smile" />
        );
        break;
      case "SHAKE":
        img = (
          <img src="/components/submit-reaction/shake.v2.svg" alt="Shake" />
        );
        break;
      case "FANFARE":
        img = (
          <img src="/components/submit-reaction/fanfare.v2.svg" alt="Fanfare" />
        );
        break;
    }

    return img;
  };

  const items = reactions.map((item: any) => {
    const swarm = [];

    for (let number = 1; number <= 20; number++) {
      const bottom = Math.floor(Math.random() * 400);
      swarm.push({
        key: `${item.id}-${number}`,
        type: item.type,
        style: {
          bottom: `-${bottom}px`,
        },
      });
    }

    return swarm.map((item: any) => (
      <div className="item" style={item.style} key={item.key}>
        {reaction(item.type)}
      </div>
    ));
  });

  return (
    <div className="reactions-component">
      <CSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={2000}
        transitionLeaveTimeout={0}
      >
        {items}
      </CSSTransitionGroup>
    </div>
  );
};

export default Reactions;
