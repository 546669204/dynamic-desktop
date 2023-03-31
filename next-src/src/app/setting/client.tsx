"use client"
import React from 'react';

import { invoke } from "@tauri-apps/api/tauri";
import { useCallback } from "react";

import Tabs from "./tabs";

function Setting() {
  const onToggle = useCallback(() => {
    invoke("toggle_desktop_task_visable");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen from-purple-100 via-red-300 to-indigo-500 bg-gradient-to-br">
      <div className="w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl">
        <Tabs>
          <Tabs.TabItem name="base info">
            <button onClick={onToggle} type="button">
              toggle_desktop_task_visable
            </button>
          </Tabs.TabItem>
          <Tabs.TabItem name="data"> </Tabs.TabItem>
        </Tabs>
      </div>
    </div>
  );
}

export default Setting;
