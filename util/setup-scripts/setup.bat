@ECHO off

REM cd into our backend folder
cd api
REM install dependencies
call npm install
REM remove any existing printingRPC directory
del printingRPC
REM clone printingRPC repository
git clone https://github.com/jerrylee17/printingRPC.git
cd printingRPC
REM run the repo's setup script
setup.bat
REM get the heck out of there
cd ..\..
