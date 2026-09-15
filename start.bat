@echo off
setlocal
set "ROOT=%~dp0"

if not exist "%ROOT%dist\index.html" (
  echo Build not found. Run: npm.cmd run build
  exit /b 1
)

if not exist "%ROOT%node_modules\.bin\vite.cmd" (
  echo Dependencies not found. Run: npm.cmd ci
  exit /b 1
)

call "%ROOT%node_modules\.bin\vite.cmd" preview --host 127.0.0.1 --open
exit /b %ERRORLEVEL%
