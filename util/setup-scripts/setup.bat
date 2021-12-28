@ECHO off

REM cd into our backend folder
cd api
REM install dependencies
call npm install
REM run the repo's setup script
setup.bat
REM get the heck out of there
cd ..\..
