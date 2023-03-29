'use client'
import React, { useRef } from "react"
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri"
import { createDir, BaseDirectory, readDir, writeBinaryFile } from "@tauri-apps/api/fs"

import { appDir, join } from "@tauri-apps/api/path"
import Copyright from "./copyright";
import styles from './page.module.css'

import ToolBar from "./toolbar"


const Player = () => {
  const [currentData, setCurrentData] = React.useState({ assetUrl: '', filename: '' });
  const [existFileMap, setExistFileMap] = React.useState(new Set<string>())
  const timerRef = useRef(0);
  const assetsDirRef = useRef('');
  React.useEffect(() => {
    (async function () {
      const appDirPath = await appDir();
      await createDir('databases/assets', { dir: BaseDirectory.App, recursive: true });
      assetsDirRef.current = await join(appDirPath, 'databases', 'assets');
      let _existFileMap = (await readDir('databases/assets', { dir: BaseDirectory.App })).reduce((acc, it) => (it.name && acc.add(it.name), acc), new Set<string>());
      setExistFileMap(_existFileMap);
    })();
  }, [])

  const next = React.useCallback(async function () {
    let list = [...existFileMap.values()];
    let nextFile = list[Math.ceil(Math.random() * list.length)];
    if (!nextFile) return;
    const filePath = await join(assetsDirRef.current, nextFile);
    const assetUrl = convertFileSrc(filePath);
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
      <div className={styles.img} >
        {currentData ? currentData.filename.endsWith(".mp4") ? <video src={currentData.assetUrl} autoPlay></video> : <img src={currentData.assetUrl} /> : ''}
      </div>
      <ToolBar onNext={next} onPlay={onPlay} onStop={onStop} />
      <Copyright filename={currentData.filename} />
    </div>
  )
}

export default Player;