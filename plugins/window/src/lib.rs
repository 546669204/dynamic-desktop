use std::process::Command;

pub fn add(num: i8) -> () {
    // let reg_cmd = format!(
    // "reg add HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced /v TaskbarAcrylicOpacity /t REG_DWORD /d {} /f",
    // num
    // );
    // let reg_cmd = format!(
    // "reg add HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced /v UseOLEDTaskbarTransparency /t REG_DWORD64 /d {} /f",
    // num
    // );
    let reg_cmd = format!(
    "reg add HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize /v EnableTransparency /t REG_DWORD64 /d {} /f",
    num
    );
    Command::new("cmd")
        .args(&[
            "/C",
            &reg_cmd,
            "&&",
            "taskkill",
            "/f",
            "/im",
            "explorer.exe",
            "&&",
            "start",
            "explorer.exe",
        ])
        .output()
        .expect("执行命令失败");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        add(1)
    }
}
