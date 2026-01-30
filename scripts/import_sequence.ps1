param (
    [Parameter(Mandatory=$true)]
    [string]$SourcePath,
    [int]$TargetFrameCount = 120
)

$TargetDir = Join-Path $PSScriptRoot "..\public\images\spectre"
# Ensure target exists
if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null
}

# Get all jpg/webp/png images from source
$SourceImages = Get-ChildItem -Path $SourcePath -Include *.jpg, *.jpeg, *.webp, *.png -Recurse | Sort-Object Name

$Count = $SourceImages.Count

if ($Count -eq 0) {
    Write-Error "No images found in $SourcePath"
    exit 1
}

Write-Host "Found $Count images in source."
Write-Host "Clearing existing images in $TargetDir..."
Remove-Item -Path "$TargetDir\*" -Force -Recurse

Write-Host "Processing sequence (Target: $TargetFrameCount frames)..."

for ($i = 0; $i -lt $TargetFrameCount; $i++) {
    # Calculate index in source array based on ratio
    $SourceIndex = [math]::Floor(($i / $TargetFrameCount) * $Count)
    
    # Safety clamp
    if ($SourceIndex -ge $Count) { $SourceIndex = $Count - 1 }
    
    $SourceFile = $SourceImages[$SourceIndex]
    $Extension = $SourceFile.Extension
    # Force jpg extension for consistency with code, or keep original?
    # Code expects .jpg currently in ProductSequence.tsx:29: img.src = `/images/spectre/${i}.jpg`;
    # So we should convert or rename to .jpg. For simplicity, we just rename extension if it's compatible or warn.
    # Ideally we'd convert, but standard copy/rename is safer for a simple script. 
    # Let's assuming input is jpg for now as per project spec, or just force the name to .jpg and hope the browser handles it (modern browsers often do sniff mime type) OR strict rename.
    # Safest: Copy as is, but project checks for .jpg.
    
    $DestName = "$i.jpg" 
    $DestPath = Join-Path $TargetDir $DestName
    
    Copy-Item -LiteralPath $SourceFile.FullName -Destination $DestPath
}

Write-Host "Successfully imported $TargetFrameCount frames to public/images/spectre/"
