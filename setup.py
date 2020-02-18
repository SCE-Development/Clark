import platform
import os

print('Welcome to SCE-Development Setup!\n')
user_os = platform.system()
print('Detected OS: {}'.format(user_os))

if user_os == 'Darwin' or user_os == 'Linux':
    setup_status = os.system('./util/setup-scripts/setup.sh')
elif user_os == 'Windows':
    setup_status = os.system('util\setup-scripts\setup.bat')

if setup_status == 0:
    print('\nSetup successful! Bye!\n')
else:
    print('\nAn error occured somewhere during the process. Ask on #development\
on Slack for help.\n')
