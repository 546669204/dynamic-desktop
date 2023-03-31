import React from "react";

import styles from "./page.module.css";


function Copyright({
  filename,
  taskbarHeight,
}: {
  filename: string;
  taskbarHeight: number;
}) {
  if (filename.split("-")[0] === "wallhaven") {
    return (
      <div className={styles.copyright} style={{ bottom: taskbarHeight }}>
        <a href="https://wallhaven.cc" rel="noreferrer" target="_blank">
          <img alt="" src="https://wallhaven.cc/images/layout/logo.png" />
          <p>The best wallpapers on the Net!</p>
        </a>
      </div>
    );
  }

  if (filename.split("-")[0] === "pixabay") {
    return (
      <div className={styles.copyright} style={{ bottom: taskbarHeight }}>
        <a href="https://pixabay.com/" rel="noreferrer" target="_blank">
          <img
            alt=""
            src="https://pixabay.com/static/img/logo.svg"
            width="280"
          />
          <p> Free Images</p>
        </a>
      </div>
    );
  }

  return <div />;
}

export default Copyright;
