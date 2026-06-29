@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo [1/2] Copying content...
if exist quartz\content\10_Cyber rmdir /s /q quartz\content\10_Cyber
if exist quartz\content\20_Dev rmdir /s /q quartz\content\20_Dev
if exist quartz\content\30_Sys rmdir /s /q quartz\content\30_Sys
if exist quartz\content\60_BioAI rmdir /s /q quartz\content\60_BioAI
if exist quartz\content\README.md del /q quartz\content\README.md

xcopy 10_Cyber quartz\content\10_Cyber\ /e /i /q
xcopy 20_Dev quartz\content\20_Dev\ /e /i /q
xcopy 30_Sys quartz\content\30_Sys\ /e /i /q
xcopy 60_BioAI quartz\content\60_BioAI\ /e /i /q
copy README.md quartz\content\index.md >nul

echo [2/2] Starting local server...
cd quartz
npx quartz build --serve
