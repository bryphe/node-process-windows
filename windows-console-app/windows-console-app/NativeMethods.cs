using System;
using System.Runtime.InteropServices;
using System.Text;

namespace windows_console_app
{
    public static class NativeMethods
    {
        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
        
        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool SwitchToThisWindow(IntPtr hWnd, bool fAltTab);
    }
}
