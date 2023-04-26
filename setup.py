import subprocess
import platform
import os


def alias_already_exists(file_name):
    with open(file_name, 'r') as f:
        for line in f.readlines():
            if "export ESLINT_NO_DEV_ERRORS=true" in line:
                return True
    return False


def write_to_file(file_name):
    if not alias_already_exists(file_name):
        with open(file_name, 'a') as file:
            file.write('\n')
            file.write("export ESLINT_NO_DEV_ERRORS=true")
            file.write('\n')
        print(
            f"\n{file_name} written! " +
            "Open a new terminal after completing setup for changes to be in effect.")


def add_alias_unix():
    HOME_PATH = os.environ["HOME"]
    BASHRC_PATH = f'{HOME_PATH}/.bashrc'
    ZSHRC_PATH = f"{HOME_PATH}/.zshrc"
    BASH_PROFILE_PATH = f"{HOME_PATH}/.bash_profile"
    user_os = platform.system()
    if os.path.isfile(BASHRC_PATH):
        write_to_file(BASHRC_PATH)
    if user_os == "Darwin" and os.path.isfile(ZSHRC_PATH):
        write_to_file(ZSHRC_PATH)
    elif user_os == "Linux" and os.path.isfile(BASH_PROFILE_PATH):
        write_to_file(BASH_PROFILE_PATH)


def add_alias_windows():
    subprocess.check_call("setx ESLINT_NO_DEV_ERRORS true",
                          stderr=subprocess.STDOUT, shell=True)


# This function is neccesary such that users from different operating systems can
# both make use of hot reload
# CHOKIDAR_USEPOLLING and WATCHPACK_POLLING are alternate methods of watching for changes on files
# windows users need this because the docker containers are all running linux and since their
# files are also being managed by windows it gets messy using the os default file watching protocal
# the .env file will be user specific and not interfere with non-windows users
def make_env(isWindows):
    with open(".env", "x") as f:
        f.write(f"CHOKIDAR_USEPOLLING={isWindows}\nWATCHPACK_POLLING={isWindows}")


print('Welcome to SCE-Development Setup!\n')
user_os = platform.system()
print('Detected OS: {}'.format(user_os))

if user_os == 'Darwin' or user_os == 'Linux':
    if os.path.exists("api/config/config.json") == False:
        os.system("cp api/config/config.example.json  api/config/config.json")
    if os.path.exists("src/config/config.json") == False:
        os.system("cp src/config/config.example.json  src/config/config.json")
    if os.path.exists(".env") == False:
        make_env(False)  
    add_alias_unix()
elif user_os == 'Windows':
    if os.path.exists("api\\config\\config.json") == False:
        os.system("copy api\\config\\config.example.json  api\\config\\config.json")
    if os.path.exists("src\\config\\config.json") == False:
        os.system("copy src\\config\\config.example.json  src\\config\\config.json")
    if os.path.exists(".env") == False:
        make_env(True)
    add_alias_windows()

print('\nSetup complete! Bye!\n')
