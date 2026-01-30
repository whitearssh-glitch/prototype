@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PATH=C:\Program Files\Git\bin;C:\Program Files (x86)\Git\bin;%PATH%"

echo.
echo ========================================
echo  Git 기록을 새로 만들고 푸시합니다.
echo  (기존 .git 폴더 삭제 후 처음부터)
echo ========================================
echo.
pause

REM 기존 .git 삭제 (node_modules가 기록에 남아 있어서)
if exist ".git" (
    echo .git 폴더 삭제 중...
    rd /s /q .git
)

echo.
echo 새 저장소 초기화...
git init

echo.
echo .gitignore 적용하여 추가 (node_modules 제외)...
git add .

echo.
echo === 스테이징된 파일 확인 (node_modules 없어야 함) ===
git status
echo.
pause

git commit -m "Add full SELFit prototype"

git branch -M main
git remote add origin https://github.com/whitearssh-glitch/prototype.git 2>nul
git remote remove origin 2>nul
git remote add origin https://github.com/whitearssh-glitch/prototype.git

echo.
echo 푸시 중 (--force)...
git push -u origin main --force

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo 푸시 실패. GitHub 로그인 확인하세요.
) else (
    echo.
    echo 완료.
)
pause
