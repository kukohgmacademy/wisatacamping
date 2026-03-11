$files = Get-ChildItem -Path ".\" -Include "*.html" -Recurse

foreach ($file in $files) {
    if ($file.Name -eq "about_test.html") { continue }
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # 1. Update index.html title
    if ($file.Name -eq "index.html") {
        $content = $content -replace '<title>wisata camping batu malang indah</title>', '<title>Wisata Camping & Glamping Batu Malang | Liburan Keluarga Terbaik</title>'
    }

    # 2. Add og:image and twitter:card if missing
    if (-not $content.Contains('<meta property="og:image"')) {
        # Find featured image for blogs
        $imgMatch = [regex]::Match($content, '<img[^>]*class="blog-featured-img"[^>]*src="([^"]+)"')
        $imgSrc = "assets/img/hero_10_11zon.webp" # default
        if ($imgMatch.Success) {
            $imgSrc = $imgMatch.Groups[1].Value
        }
        
        $ogImageTag = "`n    <meta property=`"og:image`" content=`"https://wisatacampingbatu.web.id/$imgSrc`">`n    <meta name=`"twitter:card`" content=`"summary_large_image`">`n    <meta name=`"twitter:image`" content=`"https://wisatacampingbatu.web.id/$imgSrc`">"
        
        $content = $content -replace '(<meta property="og:type"[^>]*>)', "`$1$ogImageTag"
    }

    # 3. Add JSON-LD Article Schema for blog files
    if ($file.FullName -match "tips-kemping|manfaat-rahasia|rekomendasi-menu|checklist-lengkap|kemping-tanpa-jejak|panduan-memilih|aktivitas-seru|panduan-stargazing" -and -not $content.Contains("application/ld+json")) {
        $titleMatch = [regex]::Match($content, '<title>([^<]+)</title>')
        $title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value.Trim() } else { "Blog Artikel" }
        
        $descMatch = [regex]::Match($content, '<meta name="description"[^>]*content="([^"]+)"')
        $desc = if ($descMatch.Success) { $descMatch.Groups[1].Value.Trim() } else { "" }
        
        $imgMatch = [regex]::Match($content, '<img[^>]*class="blog-featured-img"[^>]*src="([^"]+)"')
        $imgSrc = if ($imgMatch.Success) { "https://wisatacampingbatu.web.id/" + $imgMatch.Groups[1].Value } else { "https://wisatacampingbatu.web.id/assets/img/logo.png" }
        
        $schema = @"
    <!-- JSON-LD Schema untuk Artikel -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "$title",
      "description": "$desc",
      "image": "$imgSrc",
      "author": {
        "@type": "Person",
        "name": "Adiel Ebert Nakula Shandy"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Wisata Kemping Batu Malang",
        "logo": {
          "@type": "ImageObject",
          "url": "https://wisatacampingbatu.web.id/assets/img/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://wisatacampingbatu.web.id/$($file.Name)"
      }
    }
    </script>
</head>
"@
        $content = $content -replace '</head>', $schema
    }
    
    $utf8NoBom = New-Object System.Text.UTF8Encoding $False
    [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
    Write-Host "Updated SEO for $($file.Name)"
}
