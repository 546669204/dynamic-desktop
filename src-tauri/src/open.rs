use std::process::Command;

pub fn open(dir: &str) {
    #[cfg(macos)]
    Command::new("open")
        .arg(dir) // <- Specify the directory you'd like to open.
        .spawn()
        .unwrap();

    #[cfg(windows)]
    Command::new("explorer")
        .arg(dir) // <- Specify the directory you'd like to open.
        .spawn()
        .unwrap();

    #[cfg(linux)]
    Command::new("xdg-open")
        .arg(dir) // <- Specify the directory you'd like to open.
        .spawn()
        .unwrap();
}
