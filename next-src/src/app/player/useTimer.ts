import { useCallback, useEffect, useRef, useState } from "react";

function useTimer(nextfn: Function, time: number) {
  const [progress, setProgress] = useState(0);
  const timerReference = useRef(0);
  const countReference = useRef<number>(0);

  const onStop = useCallback(() => {
    clearInterval(timerReference.current);
  }, []);
  const onPlay = useCallback(() => {
    onStop();
    timerReference.current = setInterval(() => {
      countReference.current += 100;

      if (countReference.current >= time) {
        nextfn();
        countReference.current = 0;
      }

      setProgress((countReference.current / time) * 100);
    }, 100) as unknown as number;
  }, [nextfn, onStop, time]);
  const reset = useCallback(() => {
    countReference.current = 0;
    setProgress(0);
  }, []);

  useEffect(() => {
    onPlay();

    return onStop;
  }, [nextfn, onPlay, onStop]);

  return {
    onStop,
    onPlay,
    progress,
    reset,
  };
}

export default useTimer;
