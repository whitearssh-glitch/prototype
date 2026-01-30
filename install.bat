@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PATH=C:\Program Files\nodejs;C:\Program Files (x86)\nodejs;%PATH%"

echo.
echo 패키지 설치 중...
echo.

call npm.cmd install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo 설치 실패. Node.js가 설치되어 있는지 확인하세요.
    pause
    exit /b 1
)

echo.
echo 설치 완료. 이제 dev.bat 을 더블클릭해서 서버를 켜세요.
echo.
pause
