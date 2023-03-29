import AngleLeft from "@/../public/angle-left.svg";
import AngleRight from "@/../public/angle-right.svg";
import PlaySvg from "@/../public/play.svg";
import PauseSvg from "@/../public/pause.svg";

const ToolBar = ({
  onNext, onStop, onPlay
}) => {
  return (
    <div style={{
      position: "fixed",
      right: 10,
      bottom: 10
    }}>
      <button onClick={onNext} > <AngleLeft fill="white" width="32" height="32" className="drop-shadow-[0_0_3px_rgba(0,0,0,6)] hover:drop-shadow-[0_0_6px_rgba(0,0,0,6)] transition-all	" /></button>
      <button onClick={onNext}> <AngleRight fill="white" width="32" height="32" className="drop-shadow-[0_0_3px_rgba(0,0,0,6)] hover:drop-shadow-[0_0_6px_rgba(0,0,0,6)] transition-all	" /></button>
      <button onClick={onStop} ><PauseSvg fill="white" width="32" height="32" className="drop-shadow-[0_0_3px_rgba(0,0,0,6)] hover:drop-shadow-[0_0_6px_rgba(0,0,0,6)] transition-all	" /></button>
      <button onClick={onPlay}><PlaySvg fill="white" width="32" height="32" className="drop-shadow-[0_0_3px_rgba(0,0,0,6)] hover:drop-shadow-[0_0_6px_rgba(0,0,0,6)] transition-all	" /></button>

    </div>
  )
}

export default ToolBar