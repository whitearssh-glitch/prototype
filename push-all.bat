@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PATH=C:\Program Files\Git\bin;C:\Program Files (x86)\Git\bin;%PATH%"

echo.
echo 전체 프로젝트를 GitHub에 푸시합니다...
echo.

git add .
git status
echo.
git commit -m "Add full SELFit prototype" 2>nul || git commit -m "Update"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/whitearssh-glitch/prototype.git
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo 푸시 실패. GitHub 로그인을 확인하세요.
) else (
    echo.
    echo 완료. Vercel이 자동으로 다시 배포할 수 있습니다.
)
pause
