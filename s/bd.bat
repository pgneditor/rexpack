rem Build Development

echo off

set REXPACKDEV=1

call makeenv.bat
call npm run buildDev
rem pause
call s\sd
