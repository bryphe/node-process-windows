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
                throw new ArgumentException("Please specify an argument: --processInfo, --focus <pid>");

            var argument = args[0].ToLowerInvariant();

            var output = new Output();

            try
            {

                switch (argument)
                {
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

            return processes
                    .Select(process => new ProcessInfo() { MainWindowTitle = process.MainWindowTitle, ProcessId = process.Id, ProcessName = process.ProcessName })
                    .ToArray();
        }
    }
}
