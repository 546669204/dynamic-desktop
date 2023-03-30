#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{io::Write, thread, time::Duration};
use tauri::Manager;
use tauri_plugin_autostart::MacosLauncher;

mod menu;
mod open;

#[cfg(windows)]
mod window_api;

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

#[tauri::command]
fn toggle_desktop_icons_visable() {
    thread::spawn(|| unsafe {
        #[cfg(windows)]
        window_api::ds2_toggle_show_desktop_icons();
    });
}
#[tauri::command]
fn toggle_desktop_task_visable() {
    unsafe {
        #[cfg(windows)]
        window_api::ds2_toggle_show_desktop_task();
    }
}

#[tauri::command]
fn get_desktop_task_rect() -> serde_json::Value {
    unsafe {
        #[cfg(windows)]
        window_api::get_desktop_task_rect()
    }
}

#[tauri::command]
async fn download_file(url: String, filename: String) {
    use tauri::api::http::{ClientBuilder, HttpRequestBuilder, ResponseType};
    let client = ClientBuilder::new().build().unwrap();
    let response = client
        .send(
            HttpRequestBuilder::new("GET", url)
                .unwrap()
                .response_type(ResponseType::Binary),
        )
        .await;
    if let Ok(response) = response {
        let bytes = response.bytes().await;
        if let Ok(bytes) = bytes {
            let mut file = std::fs::File::create(filename).expect("create failed");
            file.write_all(&bytes.data).expect("write failed");
        }
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
                // init script
            "###
                .into(),
            )
            .unwrap();
    })
    .invoke_handler(tauri::generate_handler![
        toggle_desktop_icons_visable,
        toggle_desktop_task_visable,
        download_file,
        get_desktop_task_rect
    ])
    .setup(|_app| {
        unsafe {
            #[cfg(windows)]
            window_api::init_global_wnd();
        }
        Ok(())
    })
    .plugin(tauri_plugin_sql::Builder::default().build())
    .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
        println!("{}, {argv:?}, {cwd}", app.package_info().name);

        app.emit_all("single-instance", Payload { args: argv, cwd })
            .unwrap();
    }))
    .plugin(tauri_plugin_autostart::init(
        MacosLauncher::LaunchAgent,
        Some(vec!["--flag1", "--flag2"]), /* arbitrary number of args to pass to your app */
    ))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
