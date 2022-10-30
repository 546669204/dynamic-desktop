#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{io::Write, thread, time::Duration};
mod menu;

#[cfg(windows)]
mod window_api;

#[tauri::command]
fn toggle_desktop_icons_visable() {
    unsafe {
        #[cfg(windows)]
        window_api::ds2_toggle_show_desktop_icons();
    }
}

#[tauri::command]
async fn downloadFile(url: String, filename: String) {
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
            window.addEventListener("dblclick",
                () => window.__TAURI__.invoke("toggle_desktop_icons_visable")
            )
            "###
                .into(),
            )
            .unwrap();
    })
    .invoke_handler(tauri::generate_handler![
        toggle_desktop_icons_visable,
        downloadFile
    ])
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
