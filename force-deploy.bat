@echo off
echo Forcing deployment...
git add -A
git commit -m "Force deployment with debugging"
git push origin main
echo Deployment forced!
pause
