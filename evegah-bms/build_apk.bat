@echo off
echo Building Evegah BMS APK...
C:\flutter\bin\flutter.bat clean
C:\flutter\bin\flutter.bat build apk --release
echo Build finished.
pause
