'use client'
import dynamic from "next/dynamic";

import React, { useRef } from "react"
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri"
// import { createDir, BaseDirectory, readDir, writeBinaryFile } from "@tauri-apps/api/fs"


import Copyright from "./copyright";
import styles from './page.module.css'

import ToolBar from "./toolbar"


const Player = () => {
  const [currentData, setCurrentData] = React.useState({ assetUrl: '', filename: '' });
  const [existFileMap, setExistFileMap] = React.useState(new Set<string>())
  const [taskbarHeight, setTaskbarHeight] = React.useState(60)
  const assetsDirRef = useRef('');
  React.useEffect(() => {
    (async function () {
      const { createDir, BaseDirectory, readDir, writeBinaryFile } = await import("@tauri-apps/api/fs");
      const { appDir, join } = await import("@tauri-apps/api/path");
      const appDirPath = await appDir();
      await createDir('databases/assets', { dir: BaseDirectory.App, recursive: true });
      assetsDirRef.current = await join(appDirPath, 'databases', 'assets');
      let _existFileMap = (await readDir('databases/assets', { dir: BaseDirectory.App })).reduce((acc, it) => (it.name && acc.add(it.name), acc), new Set<string>());
      setExistFileMap(_existFileMap);
      invoke<{ top: number, bottom: number }>("get_desktop_task_rect").then((res) => {
        setTaskbarHeight(res.bottom - res.top);
      })
    })();
  }, [])

  const next = React.useCallback(async function () {
    const { join } = await import("@tauri-apps/api/path");
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

  const onDbclick = React.useCallback(() => {
    invoke("toggle_desktop_icons_visable")
  }, [])


  return (
    <div onDoubleClickCapture={onDbclick}>
      <div className={styles.img} >
        {currentData ? currentData.filename.endsWith(".mp4") ? <video src={currentData.assetUrl} autoPlay loop /> : <img src={currentData.assetUrl} /> : ''}
      </div>
      <ToolBar onNext={next} taskbarHeight={taskbarHeight} />
      <Copyright filename={currentData.filename} taskbarHeight={taskbarHeight} />
    </div>
  )
}

export default Player;