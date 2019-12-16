rem Build Production

set REXPACKDEV=1

call makeenv.bat
call npm run buildProd
rem pause
call s\sp