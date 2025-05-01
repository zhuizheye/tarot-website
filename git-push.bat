@echo off
chcp 65001 > nul

echo 正在检查Git状态...
git status

set /p COMMIT_MSG=请输入提交信息（直接回车使用默认信息）：
if "%COMMIT_MSG%"=="" set COMMIT_MSG=更新项目文件

echo.
echo 正在添加文件到暂存区...
git add .
if %errorlevel% neq 0 (
    echo 错误：无法添加文件到暂存区
    pause
    exit /b 1
)

echo 正在提交更改...
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo 错误：无法提交更改
    pause
    exit /b 1
)

echo 正在推送到远程仓库...
git push
if %errorlevel% neq 0 (
    echo 错误：无法推送到远程仓库
    pause
    exit /b 1
)

echo.
echo 成功完成所有操作！
pause