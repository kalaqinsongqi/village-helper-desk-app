!macro customInit
  ; 安装前尝试关闭正在运行的 Village Helper 和 backend.exe
  ExecWait '"cmd" /c taskkill /F /IM "Village Helper.exe" 2>nul'
  ExecWait '"cmd" /c taskkill /F /IM "backend.exe" 2>nul'
  Sleep 1000
!macroend

!macro customUnInit
  ; 卸载前尝试关闭正在运行的 Village Helper 和 backend.exe
  ExecWait '"cmd" /c taskkill /F /IM "Village Helper.exe" 2>nul'
  ExecWait '"cmd" /c taskkill /F /IM "backend.exe" 2>nul'
  Sleep 1000
!macroend
