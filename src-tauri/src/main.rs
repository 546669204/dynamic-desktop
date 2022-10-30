#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{thread, time::Duration};
mod menu;
mod window_api;

#[tauri::command]
fn toggle_desktop_icons_visable() {
    unsafe {
        #[cfg(windows)]
        window_api::ds2_toggle_show_desktop_icons();
    }
}

fn main() {
    unsafe {
        #[cfg(windows)]
        window_api::set_desktop_split();
        #[cfg(windows)]
        thread::sleep(Duration::from_millis(2000));
    }

    let mut t = tauri::Builder::default();

    t = menu::init_menus(t);

    t.on_page_load(|window, _payload| {
        window
            .eval(
                r###"
            window.addEventListener("dblclick",
                () => window.__TAURI__.invoke("toggle_desktop_icons_visable")
            )
            "###
                .into(),
            )
            .unwrap();
    })
    .invoke_handler(tauri::generate_handler![toggle_desktop_icons_visable])
    .setup(|_app| {
        unsafe {
            #[cfg(windows)]
            window_api::init_global_wnd();
        }
        Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
