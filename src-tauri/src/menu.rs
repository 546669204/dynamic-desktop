use tauri::Builder;
use tauri::Manager;
use tauri::SystemTray;
use tauri::Wry;
use tauri::{CustomMenuItem, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

pub fn init_menus(
    t:  Builder<Wry>,
) -> tauri::Builder<Wry> {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let open_devtool = CustomMenuItem::new("open_devtool".to_string(), "open devtool");
    
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide)
        .add_item(show)
        .add_item(open_devtool);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    t.system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    unsafe {
                        #[cfg(windows)]
                        crate::window_api::stop_event_forward();
                    }
                    std::process::exit(0);
                }
                "hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().unwrap();
                }
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                }
                "open_devtool" => {
                    let window = app.get_window("main").unwrap();
                    window.open_devtools();
                }
                _ => {}
            },
            _ => {}
        })
}
