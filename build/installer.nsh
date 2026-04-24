!macro customInit
  ; 安装前尝试关闭正在运行的 Village Helper
  nsProcess::FindProcess "Village Helper.exe"
  Pop $R0
  ${If} $R0 == "0"
    nsProcess::KillProcess "Village Helper.exe"
    Sleep 2000
  ${EndIf}

  ; 关闭 backend.exe 子进程
  nsProcess::FindProcess "backend.exe"
  Pop $R0
  ${If} $R0 == "0"
    nsProcess::KillProcess "backend.exe"
    Sleep 1000
  ${EndIf}
!macroend

!macro customUnInit
  ; 卸载前尝试关闭正在运行的 Village Helper
  nsProcess::FindProcess "Village Helper.exe"
  Pop $R0
  ${If} $R0 == "0"
    nsProcess::KillProcess "Village Helper.exe"
    Sleep 2000
  ${EndIf}

  ; 关闭 backend.exe 子进程
  nsProcess::FindProcess "backend.exe"
  Pop $R0
  ${If} $R0 == "0"
    nsProcess::KillProcess "backend.exe"
    Sleep 1000
  ${EndIf}
!macroend
