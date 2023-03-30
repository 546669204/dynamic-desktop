import AngleLeft from "@/../public/angle-left.svg";
import AngleRight from "@/../public/angle-right.svg";
import PlaySvg from "@/../public/play.svg";
import PauseSvg from "@/../public/pause.svg";
import useTimer from "./useTimer";
import { useCallback } from "react";

const ToolBar = ({
  onNext, taskbarHeight
}: {
  onNext: Function, taskbarHeight: number
}) => {
  const { onStop, onPlay, progress, reset } = useTimer(onNext, 30 * 1000);

  const nextAndReset = useCallback(() => {
    onNext();
    reset();
  }, [])

  return (
    <div style={{
      position: "fixed",
      right: 10,
      bottom: 10 + taskbarHeight
    }}>
      <button onClick={nextAndReset} > <AngleLeft fill="white" width="32" height="32" className="drop-shadow-[0_0_3px_rgba(0,0,0,6)] hover:drop-shadow-[0_0_6px_rgba(0,0,0,6)] transition-all	" /></button>
      <button onClick={nextAndReset}> <AngleRight fill="white" width="32" height="32" className="drop-shadow-[0_0_3px_rgba(0,0,0,6)] hover:drop-shadow-[0_0_6px_rgba(0,0,0,6)] transition-all	" /></button>
      <button onClick={onStop} ><PauseSvg fill="white" width="32" height="32" className="drop-shadow-[0_0_3px_rgba(0,0,0,6)] hover:drop-shadow-[0_0_6px_rgba(0,0,0,6)] transition-all	" /></button>
      <button onClick={onPlay}><PlaySvg fill="white" width="32" height="32" className="drop-shadow-[0_0_3px_rgba(0,0,0,6)] hover:drop-shadow-[0_0_6px_rgba(0,0,0,6)] transition-all	" /></button>

      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
        <div className="bg-blue-600 h-2.5 rounded-full transition-all	" style={{ width: progress + "%" }}></div>
      </div>
    </div>
  )
}

export default ToolBar