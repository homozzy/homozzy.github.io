# 构建并发布到 gh-pages 分支（GitHub Pages 源）
# 用法：pwsh scripts/publish-gh-pages.ps1
$ErrorActionPreference = 'Stop'
$proj = Split-Path -Parent $PSScriptRoot
$git  = 'git'

# 1) 构建（需要系统 Node ≥ 22.23.4；无系统 git 时用便携版）
npm run build

# 2) 用临时索引把 dist/ 打成提交，force-push 到 gh-pages
$env:GIT_INDEX_FILE = Join-Path $proj '.git\tmp_ghpages_index'
& $git --git-dir="$proj\.git" read-tree --empty
& $git --git-dir="$proj\.git" --work-tree="$proj\dist" add -A -- .
$tree   = (& $git --git-dir="$proj\.git" write-tree).Trim()
$commit = (& $git --git-dir="$proj\.git" commit-tree $tree -m "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')").Trim()
& $git --git-dir="$proj\.git" update-ref refs/heads/gh-pages $commit
Remove-Item $env:GIT_INDEX_FILE -Force
& $git --git-dir="$proj\.git" push -f origin gh-pages
Write-Host "已发布 https://homozzy.github.io/" -ForegroundColor Green
