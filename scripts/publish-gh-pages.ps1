# 构建并发布到 gh-pages 分支（GitHub Pages 源）
# 用法：powershell -File scripts/publish-gh-pages.ps1
# 自动找 git 和 Node（系统优先，其次用 D:\Temp\opencode 下的便携版）
$ErrorActionPreference = 'Stop'
$proj = Split-Path -Parent $PSScriptRoot
Set-Location $proj

# ---- 1) 找 git ----
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if ($gitCmd) { $git = $gitCmd.Source }
elseif (Test-Path 'D:\Temp\opencode\minigit\cmd\git.exe') { $git = 'D:\Temp\opencode\minigit\cmd\git.exe' }
else { throw "找不到 git。请安装 Git，或下载 MinGit 到 D:\Temp\opencode\minigit。" }
Write-Host "Git: $git"

# ---- 2) 找达标的 Node（>= 22.23.4），并确定 npm 的调用方式 ----
$npmMode = $null
$nodeExe = $null
$npmJs    = $null
$sys = Get-Command node -ErrorAction SilentlyContinue
$sysOk = $false
if ($sys) {
  try {
    $v = (& $sys.Source --version).Trim().TrimStart('v')
    if ([version]$v -ge [version]'22.23.4') { $sysOk = $true }
  } catch {}
}
if ($sysOk) {
  $npmMode = 'cmd'   # 用系统 npm.cmd
} else {
  $pd = 'D:\Temp\opencode\node-v22.23.4'
  if (Test-Path "$pd\node.exe") {
    $npmMode = 'node'
    $nodeExe = "$pd\node.exe"
    $npmJs    = "$pd\node_modules\npm\bin\npm-cli.js"
    $env:PATH = "$pd;$env:PATH"   # 让 npm 的子进程也用到便携 Node
  } else {
    throw "找不到达标的 Node（需要 >= 22.23.4）。请升级系统 Node，或下载便携版到 D:\Temp\opencode\node-v22.23.4。"
  }
}
Write-Host "Node: $npmMode 模式"

# ---- 3) 构建 ----
if ($npmMode -eq 'cmd') { & npm run build | Out-Host }
else { & $nodeExe $npmJs run build | Out-Host }
if ($LASTEXITCODE -ne 0) { throw "构建失败" }

# ---- 4) 用临时索引把 dist/ 打成提交，force-push 到 gh-pages ----
$env:GIT_INDEX_FILE = Join-Path $proj '.git\tmp_ghpages_index'
try {
  & $git --git-dir="$proj\.git" read-tree --empty
  & $git --git-dir="$proj\.git" --work-tree="$proj\dist" add -A -- .
  $tree   = (& $git --git-dir="$proj\.git" write-tree).Trim()
  $commit = (& $git --git-dir="$proj\.git" commit-tree $tree -m "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')").Trim()
  & $git --git-dir="$proj\.git" update-ref refs/heads/gh-pages $commit
} finally {
  Remove-Item $env:GIT_INDEX_FILE -Force -ErrorAction SilentlyContinue
}
& $git --git-dir="$proj\.git" push -f origin gh-pages | Out-Host
if ($LASTEXITCODE -ne 0) { throw "推送 gh-pages 失败" }

Write-Host "已发布 https://homozzy.github.io/（等 1-2 分钟 Pages 生效）" -ForegroundColor Green
exit 0
