#!/usr/bin/env python3
"""
Life Tracker 2.0 - Icon Generator for Xcode Cloud
Creates the missing Icon.png file needed for Safari Web Extension builds
"""

import os
import sys
from pathlib import Path
import shutil

def main():
    print("🔧 Life Tracker 2.0 - Xcode Cloud Icon Fix")
    print("=" * 50)
    print()
    
    # Define paths
    extension_path = Path("life-tracker-extension/Resources")
    icons_path = extension_path / "icons"
    icon_file = extension_path / "Icon.png"
    
    # Check if extension directory exists
    if not extension_path.exists():
        print("❌ Error: Extension directory not found!")
        print(f"Expected path: {extension_path}")
        print("Please run this script from the daily-planner directory")
        return 1
    
    print(f"✅ Found extension directory: {extension_path}")
    
    # Check if Icon.png already exists
    if icon_file.exists():
        print(f"ℹ️  Icon.png already exists at: {icon_file}")
        overwrite = input("Do you want to overwrite it? (y/N): ").strip().lower()
        if overwrite not in ['y', 'yes']:
            print("Keeping existing Icon.png file.")
            return 0
    
    # Look for source icons to copy
    source_candidates = [
        icons_path / "icon-512.png",
        icons_path / "icon-256.png", 
        icons_path / "icon-128.png",
        icons_path / "icon-64.png"
    ]
    
    source_icon = None
    for candidate in source_candidates:
        if candidate.exists():
            source_icon = candidate
            break
    
    if not source_icon:
        print(f"❌ No existing icons found in {icons_path}")
        print("Please generate icons first using the icon generator:")
        print("  1. Open: life-tracker-extension/Resources/icons/generate-icons.html")
        print("  2. Click 'Generate All Icons'")
        print("  3. Save all downloaded files to the icons folder")
        print("  4. Run this script again")
        return 1
    
    print(f"✅ Found source icon: {source_icon}")
    
    # Copy the icon
    try:
        shutil.copy2(source_icon, icon_file)
        print(f"✅ Successfully created Icon.png from {source_icon.name}")
        
        # Verify the file was created
        if icon_file.exists():
            file_size = icon_file.stat().st_size
            print(f"✅ Icon.png created successfully ({file_size:,} bytes)")
        else:
            raise Exception("File was not created")
            
    except Exception as e:
        print(f"❌ Error creating Icon.png: {e}")
        return 1
    
    print()
    print("🎉 Fix Complete! Next steps:")
    print("1. Commit the new Icon.png file:")
    print("   git add life-tracker-extension/Resources/Icon.png")
    print("   git commit -m 'Fix Xcode Cloud: Add missing Icon.png'")
    print("   git push origin main")
    print()
    print("2. Trigger a new Xcode Cloud build")
    print("3. The build should now succeed! ✅")
    print()
    
    # Show file structure for verification
    print("📁 Current file structure:")
    
    files_to_check = [
        (extension_path / "Icon.png", "life-tracker-extension/Resources/Icon.png"),
        (extension_path / "manifest.json", "life-tracker-extension/Resources/manifest.json"),
        (extension_path / "popup.html", "life-tracker-extension/Resources/popup.html"),
        (icons_path, "life-tracker-extension/Resources/icons/")
    ]
    
    for file_path, display_name in files_to_check:
        if file_path.exists():
            if file_path.is_dir():
                icon_count = len(list(file_path.glob("icon-*.png")))
                print(f"  ✅ {display_name} ({icon_count} icons)")
            else:
                print(f"  ✅ {display_name}")
        else:
            print(f"  ❌ {display_name}")
    
    print()
    print("🔧 For more help, see: XCODE-CLOUD-FIX.md")
    return 0

if __name__ == "__main__":
    sys.exit(main())
