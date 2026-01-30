@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PATH=C:\Program Files\Git\bin;C:\Program Files (x86)\Git\bin;%PATH%"

echo.
echo GitHub 원격을 로컬 내용으로 덮어씁니다.
echo (GitHub에 있던 내용은 로컬로 교체됩니다)
echo.
pause

git push -u origin main --force

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo 푸시 실패.
) else (
    echo.
    echo 완료. Vercel이 자동 배포할 수 있습니다.
)
pause
