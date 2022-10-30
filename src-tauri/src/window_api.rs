use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::{
    core::*, Win32::Foundation::*, Win32::UI::Controls::*, Win32::UI::WindowsAndMessaging::*,
};

pub unsafe fn set_desktop_split() {
    let program_handle = FindWindowA(s!("Progman"), None);
    let mut lpdwresult: usize = 10;

    SendMessageTimeoutA(
        program_handle,
        0x52c,
        None,
        None,
        SEND_MESSAGE_TIMEOUT_FLAGS(0),
        2,
        &mut lpdwresult,
    );

    unsafe extern "system" fn enum_func_callback(hwnd: HWND, _param: LPARAM) -> BOOL {
        if FindWindowExA(hwnd, None, s!("SHELLDLL_DefView"), None) != HWND(0) {
            let temp_hwnd = FindWindowExA(None, hwnd, s!("WorkerW"), None);
            ShowWindow(temp_hwnd, SHOW_WINDOW_CMD(0));
        }

        return BOOL(1);
    }
    EnumWindows(Some(enum_func_callback), LPARAM(0));
}

static mut G_H_WND: HWND = HWND(-1);
static mut G_H_LOW_LEVEL_MOUSE_HOOK: HHOOK = HHOOK(-1);
static mut G_H_LOW_LEVEL_KEYBOARD_HOOK: HHOOK = HHOOK(-1);

pub unsafe fn init_global_wnd() {
    let window_handle = FindWindowA(None, s!("tauri-app"));
    let chrome0 = FindWindowExA(
        window_handle,
        HWND::default(),
        s!("Chrome_WidgetWin_0"),
        PCSTR::null(),
    );
    G_H_WND = FindWindowExA(
        chrome0,
        HWND::default(),
        s!("Chrome_WidgetWin_1"),
        PCSTR::null(),
    );
    let program_handle = FindWindowA(s!("Progman"), None);
    SetParent(window_handle, program_handle);
    start_event_forward();
}

fn is_desktop() -> bool {
    unsafe {
        let h_progman = FindWindowA(s!("Progman"), s!("Program Manager"));
        let mut h_worker_w = HWND(0);
        let mut h_shell_view_win = FindWindowExA(
            h_progman,
            HWND::default(),
            s!("SHELLDLL_DefView"),
            PCSTR::null(),
        );
        if h_shell_view_win == HWND(0) {
            let h_desktop_wnd = GetDesktopWindow();
            loop {
                h_worker_w = FindWindowExA(h_desktop_wnd, h_worker_w, s!("WorkerW"), PCSTR::null());
                h_shell_view_win = FindWindowExA(
                    h_worker_w,
                    HWND::default(),
                    s!("SHELLDLL_DefView"),
                    PCSTR::null(),
                );
                if h_shell_view_win == HWND(0) && h_worker_w != HWND(0) {
                    continue;
                }
                break;
            }
        }
        let h_foreground_window = GetForegroundWindow();
        return h_foreground_window == h_worker_w || h_foreground_window == h_progman;
    }
}

unsafe extern "system" fn low_level_keyboard_proc(
    code: i32,
    wparam: WPARAM,
    lparam: LPARAM,
) -> LRESULT {
    if code == HC_ACTION as i32 {
        if is_desktop() {
            let pt = lparam.0 as *const KBDLLHOOKSTRUCT;
            let p: KBDLLHOOKSTRUCT = *pt;
            if wparam == WPARAM(WM_KEYDOWN.try_into().unwrap()) {
                let lp: isize =
                    (1 | (p.scanCode << 16) | (1 << 24) | (0 << 29) | (0 << 30) | (0 << 31))
                        .try_into()
                        .unwrap();
                PostMessageA(G_H_WND, wparam.0.try_into().unwrap(), WPARAM(p.vkCode.try_into().unwrap()), LPARAM(lp));
            } else if wparam == WPARAM(WM_KEYUP.try_into().unwrap()) {
                let lp: isize =
                    (1 | (p.scanCode << 16) | (1 << 24) | (0 << 29) | (1 << 30) | (1 << 31))
                        .try_into()
                        .unwrap();
                PostMessageA(G_H_WND, wparam.0.try_into().unwrap(), WPARAM(p.vkCode.try_into().unwrap()), LPARAM(lp));
            }
        }
    }
    return CallNextHookEx(None, code, wparam, lparam);
}
unsafe extern "system" fn low_level_mouse_proc(
    code: i32,
    wparam: WPARAM,
    lparam: LPARAM,
) -> LRESULT {
    if code == HC_ACTION as i32 {
        if is_desktop() && !is_desktop_icon() {
            let pt = lparam.0 as *const MSLLHOOKSTRUCT;
            let p: MSLLHOOKSTRUCT = *pt;
            let lp: isize = ((p.pt.x) | ((p.pt.y) << 16)).try_into().unwrap();

            if wparam == WPARAM(WM_MOUSEMOVE.try_into().unwrap()) {
                PostMessageA(
                    G_H_WND,
                    wparam.0.try_into().unwrap(),
                    WPARAM(MK_XBUTTON1.try_into().unwrap()),
                    LPARAM(lp),
                );
            } else if wparam == WPARAM(WM_LBUTTONDOWN.try_into().unwrap())
                || wparam == WPARAM(WM_LBUTTONUP.try_into().unwrap())
            {
                PostMessageA(
                    G_H_WND,
                    wparam.0.try_into().unwrap(),
                    WPARAM(MK_LBUTTON.try_into().unwrap()),
                    LPARAM(lp),
                );
            }
        }
    }
    return CallNextHookEx(None, code, wparam, lparam);
}

unsafe fn start_event_forward() -> bool {
    let h_module = GetModuleHandleW(None).unwrap();
    G_H_LOW_LEVEL_MOUSE_HOOK =
        SetWindowsHookExA(WH_MOUSE_LL, Some(low_level_mouse_proc), h_module, 0).unwrap();
    if G_H_LOW_LEVEL_MOUSE_HOOK.is_invalid() {
        return false;
    }
    // G_H_LOW_LEVEL_KEYBOARD_HOOK =
        // SetWindowsHookExA(WH_KEYBOARD_LL, Some(low_level_keyboard_proc), h_module, 0).unwrap();
    return true;
}
pub unsafe fn stop_event_forward() {
    if !G_H_LOW_LEVEL_MOUSE_HOOK.is_invalid() {
        UnhookWindowsHookEx(G_H_LOW_LEVEL_MOUSE_HOOK);
    }
    if !G_H_LOW_LEVEL_KEYBOARD_HOOK.is_invalid() {
        UnhookWindowsHookEx(G_H_LOW_LEVEL_KEYBOARD_HOOK);
    }
}

unsafe fn is_desktop_icon() -> bool {
    let sys_list_view32 = FindWindowExA(
        get_desktop_shelldll_def_view(),
        HWND::default(),
        s!("SysListView32"),
        PCSTR::null(),
    );

    let aa = SendMessageA(
        sys_list_view32,
        LVM_GETHOTITEM,
        WPARAM::default(),
        LPARAM::default(),
    );
    return aa.0 != -1;
}

fn get_desktop_shelldll_def_view() -> HWND {
    unsafe {
        let h_progman = FindWindowA(s!("Progman"), s!("Program Manager"));
        let mut h_worker_w = HWND(0);
        let mut h_shell_view_win = FindWindowExA(
            h_progman,
            HWND::default(),
            s!("SHELLDLL_DefView"),
            PCSTR::null(),
        );
        if h_shell_view_win == HWND(0) {
            let h_desktop_wnd = GetDesktopWindow();
            loop {
                h_worker_w = FindWindowExA(h_desktop_wnd, h_worker_w, s!("WorkerW"), PCSTR::null());
                h_shell_view_win = FindWindowExA(
                    h_worker_w,
                    HWND::default(),
                    s!("SHELLDLL_DefView"),
                    PCSTR::null(),
                );
                if h_shell_view_win == HWND(0) && h_worker_w != HWND(0) {
                    continue;
                }
                break;
            }
        }
        return h_shell_view_win;
    }
}

pub unsafe fn ds2_toggle_show_desktop_icons() {
    let h_shell_view_win = get_desktop_shelldll_def_view();
    if h_shell_view_win != HWND::default() {
        SendMessageA(
            h_shell_view_win,
            WM_COMMAND,
            windows::Win32::Foundation::WPARAM(0x7402),
            LPARAM::default(),
        );
    }
}