$exclude = @('node_modules', '.git', 'dist', 'build', 'old', 'eshop-sut')

function Show-Tree {
    param(
        [string]$Path,
        [string]$Prefix = ''
    )

    $items = Get-ChildItem -LiteralPath $Path -Force |
        Where-Object { $exclude -notcontains $_.Name } |
        Sort-Object @{Expression={$_.PSIsContainer}; Descending=$true}, Name

    for ($i = 0; $i -lt $items.Count; $i++) {
        $item = $items[$i]
        $last = ($i -eq $items.Count - 1)
        $branch = if ($last) { '└── ' } else { '├── ' }

        "$Prefix$branch$($item.Name)"

        if ($item.PSIsContainer) {
            $newPrefix = $Prefix + $(if ($last) { '    ' } else { '│   ' })
            Show-Tree -Path $item.FullName -Prefix $newPrefix
        }
    }
}

Show-Tree -Path . | Out-File tree.txt -Encoding utf8
