@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PATH=C:\Program Files\Git\bin;C:\Program Files (x86)\Git\bin;%PATH%"

echo.
echo Git 초기화 및 푸시...
echo.

if exist ".git" (
    echo 기존 .git 폴더가 있습니다. 원격만 추가하고 푸시합니다.
    git remote remove origin 2>nul
    git remote add origin https://github.com/whitearssh-glitch/prototype.git
    git branch -M main
    git push -u origin main
) else (
    if not exist "README.md" echo # prototype> README.md
    git init
    git add README.md
    git commit -m "first commit"
    git branch -M main
    git remote add origin https://github.com/whitearssh-glitch/prototype.git
    git push -u origin main
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo 실패. Git 설치 여부와 GitHub 로그인을 확인하세요.
    pause
) else (
    echo.
    echo 완료.
    pause
)
