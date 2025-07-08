# PowerShell Script: Fix Xcode Cloud Icon Issue
# This script generates a placeholder Icon.png file if it's missing

Write-Host "🔧 Life Tracker 2.0 - Xcode Cloud Icon Fix" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$extensionPath = "life-tracker-extension\Resources"
$iconPath = "$extensionPath\Icon.png"

if (-not (Test-Path $extensionPath)) {
    Write-Host "❌ Error: Extension directory not found!" -ForegroundColor Red
    Write-Host "Please run this script from the daily-planner directory" -ForegroundColor Yellow
    Write-Host "Expected path: $extensionPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found extension directory: $extensionPath" -ForegroundColor Green

# Check if Icon.png already exists
if (Test-Path $iconPath) {
    Write-Host "ℹ️  Icon.png already exists at: $iconPath" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Keeping existing Icon.png file." -ForegroundColor Green
        exit 0
    }
}

# Look for existing icons to copy
$iconsDir = "$extensionPath\icons"
$sourceIcon = ""

if (Test-Path "$iconsDir\icon-512.png") {
    $sourceIcon = "$iconsDir\icon-512.png"
    Write-Host "✅ Found icon-512.png to use as source" -ForegroundColor Green
} elseif (Test-Path "$iconsDir\icon-256.png") {
    $sourceIcon = "$iconsDir\icon-256.png"
    Write-Host "✅ Found icon-256.png to use as source" -ForegroundColor Green
} elseif (Test-Path "$iconsDir\icon-128.png") {
    $sourceIcon = "$iconsDir\icon-128.png"
    Write-Host "✅ Found icon-128.png to use as source" -ForegroundColor Green
} else {
    Write-Host "❌ No existing icons found in $iconsDir" -ForegroundColor Red
    Write-Host "Please generate icons first using the icon generator:" -ForegroundColor Yellow
    Write-Host "  1. Open: life-tracker-extension\Resources\icons\generate-icons.html" -ForegroundColor Yellow
    Write-Host "  2. Click 'Generate All Icons'" -ForegroundColor Yellow
    Write-Host "  3. Save all downloaded files to the icons folder" -ForegroundColor Yellow
    Write-Host "  4. Run this script again" -ForegroundColor Yellow
    exit 1
}

# Copy the icon
try {
    Copy-Item $sourceIcon $iconPath -Force
    Write-Host "✅ Successfully created Icon.png from $sourceIcon" -ForegroundColor Green
    
    # Verify the file was created
    if (Test-Path $iconPath) {
        $fileSize = (Get-Item $iconPath).Length
        Write-Host "✅ Icon.png created successfully ($fileSize bytes)" -ForegroundColor Green
    } else {
        throw "File was not created"
    }
} catch {
    Write-Host "❌ Error creating Icon.png: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Fix Complete! Next steps:" -ForegroundColor Green
Write-Host "1. Commit the new Icon.png file:" -ForegroundColor White
Write-Host "   git add life-tracker-extension/Resources/Icon.png" -ForegroundColor Gray
Write-Host "   git commit -m 'Fix Xcode Cloud: Add missing Icon.png'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Trigger a new Xcode Cloud build" -ForegroundColor White
Write-Host "3. The build should now succeed! ✅" -ForegroundColor Green
Write-Host ""

# Show file structure for verification
Write-Host "📁 Current file structure:" -ForegroundColor Cyan
if (Test-Path $iconPath) {
    Write-Host "  ✅ life-tracker-extension/Resources/Icon.png" -ForegroundColor Green
} else {
    Write-Host "  ❌ life-tracker-extension/Resources/Icon.png" -ForegroundColor Red
}

if (Test-Path "$extensionPath\manifest.json") {
    Write-Host "  ✅ life-tracker-extension/Resources/manifest.json" -ForegroundColor Green
} else {
    Write-Host "  ❌ life-tracker-extension/Resources/manifest.json" -ForegroundColor Red
}

if (Test-Path $iconsDir) {
    $iconFiles = Get-ChildItem "$iconsDir\icon-*.png" | Measure-Object
    Write-Host "  ✅ life-tracker-extension/Resources/icons/ ($($iconFiles.Count) icons)" -ForegroundColor Green
} else {
    Write-Host "  ❌ life-tracker-extension/Resources/icons/" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 For more help, see: XCODE-CLOUD-FIX.md" -ForegroundColor Cyan
