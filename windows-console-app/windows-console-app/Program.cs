using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using Newtonsoft.Json;

namespace windows_console_app
{
    public class Output
    {
        public string Error { get; set; }

        public object Result { get; set; }
    }

    public class ProcessInfo
    {
        public int ProcessId { get; set; }

        public string MainWindowTitle { get; set; }

        public string ProcessName { get; set; }
    }

    class Program
    {
        static void Main(string[] args)
        {

            if (args.Length < 1)
                throw new ArgumentException("Please specify an argument: --processInfo, --focus <pid>, --activewindow");

            var argument = args[0].ToLowerInvariant();

            var output = new Output();

            try
            {
                switch (argument)
                {
                    case "--activewindow":
                        output.Result = GetActiveProcessInfo();
                        break;
                    case "--processinfo":
                        output.Result = GetProcessInfo();
                        break;
                    case "--focus":
                        if (argument.Length < 2)
                            throw new ArgumentException("--focus requires a processId");

                        FocusHandler.SwitchToWindow(Int32.Parse(args[1]));
                        output.Result = true;
                        break;
                    default:
                        throw new ArgumentException("Unknonw argument: " + argument);
                }

            }
            catch(Exception ex)
            {
                output.Error = ex.ToString();
            }

            Console.WriteLine(JsonConvert.SerializeObject(output));
        }

        private static ProcessInfo[] GetProcessInfo()
        {
            var processes = Process.GetProcesses();
            return ConvertToProcessInfo(processes);
        }

        private static ProcessInfo GetActiveProcessInfo()
        {
            var processes = Process.GetProcesses();
            var activeForegroundWindow = NativeMethods.GetForegroundWindow();

            var activeWindows = processes.Where(p => p.MainWindowHandle == activeForegroundWindow);

            if (activeWindows.Count() < 1)
            {
                return null;
            }
            else
                return ConvertToProcessInfo(activeWindows)[0];
        }

        private static ProcessInfo[] ConvertToProcessInfo(IEnumerable<Process> processes)
        {
            return processes
                    .Select(process => new ProcessInfo() { MainWindowTitle = process.MainWindowTitle, ProcessId = process.Id, ProcessName = process.ProcessName })
                    .ToArray();
        }
    }
}
