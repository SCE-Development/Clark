import platform
import os

print('Welcome to SCE-Development Setup!\n')
user_os = platform.system()
print('Detected OS: {}'.format(user_os))

if user_os == 'Darwin' or user_os == 'Linux':
    if os.path.exists("api/config/config.json") == False:
        os.system("cp api/config/config.example.json  api/config/config.json")
    if os.path.exists("src/config/config.json") == False:
        os.system("cp src/config/config.example.json  src/config/config.json")
elif user_os == 'Windows':
    if os.path.exists("api\config\config.json") == False:
        os.system("copy api\config\config.example.json  api\config\config.json")
    if os.path.exists("src\config\config.json") == False:
        os.system("copy src\config\config.example.json  src\config\config.json")

print('\nSetup complete! Bye!\n')
