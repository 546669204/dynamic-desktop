'use client'
import React, { useRef } from "react"
import * as  __TAURI__ from "@tauri-apps/api"
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri"

import { appDir, join } from "@tauri-apps/api/path"
import Copyright from "./copyright";
import styles from './page.module.css'

const {
  http: { fetch, ResponseType },
  fs: { createDir, BaseDirectory, readDir, writeBinaryFile }
} = __TAURI__;

let assetsDir = '';

const Player = () => {
  const [currentData, setCurrentData] = React.useState({ assetUrl: '', filename: '' });
  const [existFileMap, setExistFileMap] = React.useState(new Set<string>())
  const timerRef = useRef(0);
  React.useEffect(() => {
    (async function () {
      const appDirPath = await appDir();
      await createDir('databases/assets', { dir: BaseDirectory.App, recursive: true });
      assetsDir = await join(appDirPath, 'databases', 'assets');
      let _existFileMap = (await readDir('databases/assets', { dir: BaseDirectory.App })).reduce((acc, it) => (it.name && acc.add(it.name), acc), new Set<string>());
      setExistFileMap(_existFileMap);
    })();
  }, [])

  const next = React.useCallback(async function () {
    let list = [...existFileMap.values()];
    let nextFile = list[Math.ceil(Math.random() * list.length)];
    if (!nextFile) return;
    const filePath = await join(assetsDir, nextFile);
    const assetUrl = convertFileSrc(filePath);
    console.log(assetUrl)
    setCurrentData({
      assetUrl,
      filename: nextFile
    });
  }, [existFileMap])

  React.useEffect(() => {
    timerRef.current = setInterval(next, 30 * 1000) as unknown as number;
    next();
    return () => {
      clearInterval(timerRef.current)
    }
  }, [existFileMap])
  const onDbclick = React.useCallback(() => {
    invoke("toggle_desktop_icons_visable")
  }, [])
  const onStop = React.useCallback(() => {
    clearInterval(timerRef.current)
  }, [])
  const onPlay = React.useCallback(() => {
    onStop();
    timerRef.current = setInterval(next, 30 * 1000) as unknown as number;
  }, [])

  return (
    <div onDoubleClickCapture={onDbclick}>
      <div className={styles.img}>
        {currentData ? currentData.filename.endsWith(".mp4") ? <video src={currentData.assetUrl} autoPlay></video> : <img src={currentData.assetUrl} /> : ''}
      </div>
      <div style={{
        position: "fixed",
        left: 0,
        top: 0
      }}>
        <button className="mx-2 my-2 bg-white transition duration-150 ease-in-out rounded text-gray-800 border border-gray-300 px-6 py-2 text-xs hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-800" onClick={next}>Next</button>
        <button className="mx-2 my-2 bg-white transition duration-150 ease-in-out rounded text-gray-800 border border-gray-300 px-6 py-2 text-xs hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-800" onClick={onStop} >
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="5" width="4" height="14" rx="1" fill="#2A4157" fill-opacity="0.24" stroke="#222222" stroke-width="1.2" stroke-linecap="round" />
            <rect x="14" y="5" width="4" height="14" rx="1" fill="#2A4157" fill-opacity="0.24" stroke="#222222" stroke-width="1.2" stroke-linecap="round" />
          </svg></button>
        <button className="mx-2 my-2 bg-white transition duration-150 ease-in-out rounded text-gray-800 border border-gray-300 px-6 py-2 text-xs hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-800" onClick={onPlay}>Play</button>

      </div>
      <Copyright filename={currentData.filename} />
    </div>
  )
}

export default Player;