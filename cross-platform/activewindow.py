#!/usr/bin/env python

# Cross-platform --activewindow flag
# Supports Windows, macOS and some Linux distros
# Heavily based on https://stackoverflow.com/a/36419702

# Requires wnck (sudo apt-get install python-wnck) on Linux

import json

# Returns string name of window
def get_active_window():
    import sys
    output = {
        'Error': '',
        'Result': {
            'processId': 0,
            'processName': '',
            'windowTitle': ''
        }
    }
    active_window_name = None
    if sys.platform in ['linux', 'linux2']:
        # Alternatives: http://unix.stackexchange.com/q/38867/4784
        try:
            import wnck
        except ImportError:
            wnck = None
        if wnck is not None:
            screen = wnck.screen_get_default()
            screen.force_update()
            window = screen.get_active_window()
            if window is not None:
                pid = window.get_pid()
                output['Result']['processId'] = pid
                with open("/proc/{pid}/cmdline".format(pid=pid)) as f:
                    # TODO: Figure out a better way on Linux.
                    processName = f.read()
                    output['Result']['processName'] = processName
                    output['Result']['windowTitle'] = processName
        else:
            try:
                from gi.repository import Gtk, Wnck
                gi = "Installed"
            except ImportError:
                output['Error'] = 'wnck or gi.repository is required on Linux, and neither were found.'
                gi = None
            if gi is not None:
                Gtk.init([])  # necessary if not using a Gtk.main() loop
                screen = Wnck.Screen.get_default()
                screen.force_update()  # recommended per Wnck documentation
                active_window = screen.get_active_window()
                pid = active_window.get_pid()
                output['Result']['processId'] = pid
                with open("/proc/{pid}/cmdline".format(pid=pid)) as f:
                    processName = f.read()
                    output['Result']['processName'] = processName
                    output['Result']['windowTitle'] = processName
    elif sys.platform in ['Windows', 'win32', 'cygwin']:
        # http://stackoverflow.com/a/608814/562769
        # For Windows, you should probably still use windows-console-app
        import win32gui
        window = win32gui.GetForegroundWindow()
        output['Result']['windowTitle'] = win32gui.GetWindowText(window)
    elif sys.platform in ['Mac', 'darwin', 'os2', 'os2emx']:
        # http://stackoverflow.com/a/373310/562769
        from AppKit import NSWorkspace
        output['Result']['windowTitle'] = (NSWorkspace.sharedWorkspace()
                              .activeApplication()['NSApplicationName'])
    else:
        output['Error'] = 'Unkown operating system'
    return output

print(json.dumps(get_active_window()))
