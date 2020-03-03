import platform
import os

print('Welcome to SCE-Development Setup!\n')
user_os = platform.system()
print('Detected OS: {}'.format(user_os))

if user_os == 'Darwin' or user_os == 'Linux':
    if os.path.exists("api/config/config.js") == False:
        os.system("cp api/config/config.example.js  api/config/config.js")
    setup_status = os.system('./util/setup-scripts/setup.sh')
elif user_os == 'Windows':
    if os.path.exists("api\config\config.js") == False:
        os.system("copy api\config\config.example.js  api\config\config.js")
    setup_status = os.system('util\setup-scripts\setup.bat')

if setup_status == 0:
    print('\nSetup successful! Bye!\n')
else:
    print('\nAn error occured somewhere during the process. Post in the \
#development channel on Slack for help.\n')
