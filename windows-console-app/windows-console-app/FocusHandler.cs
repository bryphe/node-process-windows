using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using Newtonsoft.Json;



namespace windows_console_app
{

    public static class FocusHandler
    {
        public static void SwitchToWindow(int processId)
        {
            var process = Process.GetProcessById(processId);

            if(process != null)
            {
                NativeMethods.SwitchToThisWindow(process.MainWindowHandle, true);
            }
            else
            {
                throw new ArgumentException("Unable to find process: " + processId.ToString());
            }
        }
    }
}
