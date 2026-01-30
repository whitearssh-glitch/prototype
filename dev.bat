@echo off
chcp 65001 >nul
cd /d "%~dp0"

REM Node.js가 일반적으로 설치되는 경로를 PATH에 추가
set "NODE_PATHS=C:\Program Files\nodejs;C:\Program Files (x86)\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\node"
set "PATH=%NODE_PATHS%;%PATH%"

REM npm 실행 파일 찾기 (npm.cmd 우선)
where npm.cmd >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    goto run
)
where npm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    goto run
)
if exist "C:\Program Files\nodejs\npm.cmd" (
    set "NPM=C:\Program Files\nodejs\npm.cmd"
    goto run_npm
)
if exist "C:\Program Files (x86)\nodejs\npm.cmd" (
    set "NPM=C:\Program Files (x86)\nodejs\npm.cmd"
    goto run_npm
)

echo.
echo [오류] Node.js / npm을 찾을 수 없습니다.
echo.
echo 1. https://nodejs.org 에서 LTS 버전을 다운로드해 설치하세요.
echo 2. 설치 시 "Add to PATH" 옵션을 꼭 체크하세요.
echo 3. 설치 후 컴퓨터를 한 번 재시작하세요.
echo.
pause
exit /b 1

:run_npm
goto install_check

:run
:install_check
REM node_modules가 없으면 먼저 npm install
if not exist "node_modules\next" (
    echo.
    echo 패키지 설치 중... 처음 한 번만 걸려요.
    echo.
    if defined NPM (call "%NPM%" install) else (call npm install)
    if %ERRORLEVEL% NEQ 0 (
        echo 설치 실패. 위 오류를 확인하세요.
        pause
        exit /b 1
    )
    echo.
)

if defined NPM (call "%NPM%" run dev) else (call npm run dev)

:end
if %ERRORLEVEL% NEQ 0 pause
exit /b %ERRORLEVEL%
