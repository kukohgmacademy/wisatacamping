$dict = [ordered]@{
    "blog1.html" = "tips-kemping-aman-nyaman-musim-hujan.html";
    "blog2.html" = "5-manfaat-rahasia-liburan-kemping-bersama-keluarga.html";
    "blog3.html" = "rekomendasi-menu-santap-alam-praktis-lezat.html";
    "blog4.html" = "checklist-lengkap-peralatan-kemping-pemula.html";
    "blog5.html" = "kemping-tanpa-jejak-leave-no-trace.html";
    "blog6.html" = "panduan-memilih-lokasi-kemping-terbaik.html";
    "blog7.html" = "7-aktivitas-seru-saat-kemping.html";
    "blog8.html" = "tips-kemping-bersama-anak.html";
    "blog9.html" = "panduan-stargazing-menikmati-langit-malam.html"
}

$files = Get-ChildItem -Path ".\" -Include *.html,*.css,*.js -Recurse

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        $changed = $false
        foreach ($key in $dict.Keys) {
            if ($content.Contains($key)) {
                $content = $content.Replace($key, $dict[$key])
                $changed = $true
            }
        }
        if ($changed) {
            # use a utf8 without bom
            $utf8NoBom = New-Object System.Text.UTF8Encoding $False
            [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
            Write-Host "Updated links in $($file.Name)"
        }
    } catch {
        Write-Host "Error processing $($file.Name): $_"
    }
}

foreach ($key in $dict.Keys) {
    if (Test-Path $key) {
        Rename-Item -Path $key -NewName $dict[$key]
        Write-Host "Renamed $key to $($dict[$key])"
    }
}
