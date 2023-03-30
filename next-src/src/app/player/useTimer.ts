import { useCallback, useEffect, useRef, useState } from "react";

const useTimer = (fn: Function, time: number) => {
    const [progress, setProgress] = useState(0);
    const timerRef = useRef(0);
    const countRef = useRef(0);

    const onStop = useCallback(() => {
        clearInterval(timerRef.current)
    }, [])
    const onPlay = useCallback(() => {
        onStop();
        timerRef.current = setInterval(() => {
            countRef.current += 100;
            if (countRef.current >= time) {
                fn();
                countRef.current = 0;
            }
            setProgress((countRef.current / time) * 100)
        }, 100) as unknown as number;
    }, [])
    const reset = useCallback(() => {
        countRef.current = 0;
        setProgress(0)
    }, [])
    useEffect(() => {
        onPlay();
        return onStop
    }, [fn])

    return {
        onStop,
        onPlay,
        progress,
        reset
    }
}

export default useTimer;