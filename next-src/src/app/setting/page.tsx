"use client"
import Tabs from "./tabs";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri"

const Setting = () => {
  return (
    <div className='flex items-center justify-center min-h-screen from-purple-100 via-red-300 to-indigo-500 bg-gradient-to-br'>
      <div className='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
        <Tabs>
          <Tabs.TabItem name={'base info'}>
            <button onClick={() => {
              invoke("toggle_desktop_task_visable")
            }}>toggle_desktop_task_visable</button>
          </Tabs.TabItem>
          <Tabs.TabItem name={'data'}> </Tabs.TabItem>
        </Tabs>
      </div>
    </div>
  )
};


export default Setting;