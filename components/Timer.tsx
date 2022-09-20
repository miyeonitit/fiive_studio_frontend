import { useEffect, useState } from "react";
import useStore from "../store/video";

const Timer = () => {
  let clock: any;

  // Subscribe to store
  useStore.subscribe(
    (state: any) => state.remainingSeconds,
    (seconds) => {
      startTimer();
    }
  );

  // Seconds set on timer
  const timer = useStore((state: any) => state.timer);

  // Remaining seconds
  const remainingSeconds = useStore((state: any) => state.remainingSeconds);
  const ticktock = useStore((state: any) => state.ticktock);

  // Time format for display
  const display = (): string => {
    const rem = remainingSeconds;
    const secs = rem % 60;
    const remMins = (rem - secs) / 60;
    const mins = remMins % 60;
    const hours = (remMins - mins) / 60;

    const hh = String(hours).padStart(2, "0");
    const mm = String(mins).padStart(2, "0");
    const ss = String(secs).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  };

  const barStyle = () => {
    let width = 0;

    if (timer) {
      width = (remainingSeconds / timer) * 100;
    }

    return {
      width: `${width}%`,
    };
  };

  const showWidget = (): boolean => {
    if (remainingSeconds === null) return false;
    return remainingSeconds > 0;
  };

  const startTimer = () => {
    // Clear existing timer
    clearInterval(clock);
    clock = setInterval(ticktock, 1000);

    return () => {
      clearInterval(clock);
    };
  };

  return (
    <>
      {showWidget() && (
        <div className="timer-component">
          <div className="bar" style={barStyle()}></div>
          <div className="display">{display()}</div>
        </div>
      )}
    </>
  );
};

export default Timer;
