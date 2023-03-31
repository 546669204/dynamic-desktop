use tauri::Builder;
use tauri::Manager;
use tauri::SystemTray;
use tauri::Wry;
use tauri::{CustomMenuItem, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};
use url::Url;

pub fn init_menus(t: Builder<Wry>) -> tauri::Builder<Wry> {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let setting = CustomMenuItem::new("setting".to_string(), "Setting");
    let open_assert_dir = CustomMenuItem::new("open_assert_dir".to_string(), "open assert dir");
    let open_devtool = CustomMenuItem::new("open_devtool".to_string(), "open devtool");

    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide)
        .add_item(show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(setting)
        .add_item(open_assert_dir)
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
                "setting" => {
                    tauri::WindowBuilder::new(
                        app,
                        "external", /* the unique window label */
                        tauri::WindowUrl::External(
                            Url::parse(format!("{}/setting", app.config().build.dev_path).as_str())
                                .unwrap(),
                        ),
                    )
                    .title("Setting")
                    .inner_size(700., 600.)
                    .build()
                    .expect("failed to build window");
                }
                "open_assert_dir" => {
                    let app_dir = tauri::api::path::app_dir(&app.config()).unwrap();
                    crate::open::open(app_dir.join("databases/assets").to_str().unwrap());
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
