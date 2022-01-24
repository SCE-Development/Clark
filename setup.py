import subprocess
import platform
import os

def write_alias_to_file(file_name):
    try:
        subprocess.check_call(
            f'grep -rl \"alias ESLINT_NO_DEV_ERRORS=true\"',
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=True)
    except subprocess.CalledProcessError:
        with open(file_name, 'a') as file:
            file.write('\n')
            file.write(f"export ESLINT_NO_DEV_ERRORS=true")
            file.write('\n')

def add_alias_unix():
    HOME_PATH = os.environ["HOME"]
    BASHRC_PATH = f'{HOME_PATH}/.bashrc'
    if platform.system() == "Darwin":
        ZSHRC_PATH = f"{HOME_PATH}/.zshrc"
        if os.path.isfile(BASHRC_PATH):
            write_alias_to_file(BASHRC_PATH)
        if os.path.isfile(ZSHRC_PATH):
            write_alias_to_file(ZSHRC_PATH)
    elif platform.system() == "Linux":
        BASH_PROFILE_PATH = f"{HOME_PATH}/.bash_profile"
        if os.path.isfile(BASHRC_PATH):
            write_alias_to_file(BASHRC_PATH)
        elif os.path.isfile(BASH_PROFILE_PATH):
            write_alias_to_file(BASH_PROFILE_PATH)

def add_alias_windows():
    subprocess.check_call("setx ESLINT_NO_DEV_ERRORS true",
                             stderr=subprocess.STDOUT, shell = True)


print('Welcome to SCE-Development Setup!\n')
user_os = platform.system()
print('Detected OS: {}'.format(user_os))

if user_os == 'Darwin' or user_os == 'Linux':
    if os.path.exists("api/config/config.json") == False:
        os.system("cp api/config/config.example.json  api/config/config.json")
    if os.path.exists("src/config/config.json") == False:
        os.system("cp src/config/config.example.json  src/config/config.json")
    add_alias_unix()
elif user_os == 'Windows':
    if os.path.exists("api\config\config.json") == False:
        os.system("copy api\config\config.example.json  api\config\config.json")
    if os.path.exists("src\config\config.json") == False:
        os.system("copy src\config\config.example.json  src\config\config.json")
    add_alias_windows()

print('\nSetup complete! Bye!\n')
