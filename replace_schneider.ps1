Get-ChildItem -Path . -Recurse -Include *.tsx,*.ts,*.js,*.jsx,*.css,*.md,*.json | ForEach-Object {
  $content = Get-Content $_.FullName -Raw -Encoding utf8
  $new = $content -replace 'Schneider', 'ServiceFlow'
  if ($new -ne $content) {
    Set-Content -Path $_.FullName -Value $new -Encoding utf8
    Write-Host "Updated: $($_.FullName)"
  }
}
