@echo off
rem Store the current directory path (which should be 'public')
set "basedir=%cd%"

rem Get the file list and remove the base directory path from each line
for /r %%f in (*) do (
    set "filepath=%%f"
    setlocal enabledelayedexpansion
    echo !filepath:%basedir%\=!
    endlocal
)

pause
