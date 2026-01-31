param (
    [Parameter(Mandatory=$true)]
    [string]$SourcePath,
    [int]$TargetFrameCount = 120,
    [string]$Extension = "webp"
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
    
    # Use specified extension or source extension if we wanted to be dynamic, 
    # but here we enforce uniformity for the code to predict.
    $DestName = "$i.$Extension" 
    $DestPath = Join-Path $TargetDir $DestName
    
    Copy-Item -LiteralPath $SourceFile.FullName -Destination $DestPath
}

Write-Host "Successfully imported $TargetFrameCount frames to public/images/spectre/ as .$Extension"
