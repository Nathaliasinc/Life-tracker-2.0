#!/bin/bash

# Build script to generate Icon.png for Xcode Cloud
# This script runs during the build process to create the missing Icon.png file

echo "🔧 Generating Icon.png for Life Tracker 2.0 Safari Extension..."

# Create the Resources directory if it doesn't exist
mkdir -p "${SRCROOT}/Resources"

# Base64 encoded 1x1 PNG (minimal valid PNG)
PNG_DATA="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

# Decode and write the PNG file
echo "$PNG_DATA" | base64 -d > "${SRCROOT}/Resources/Icon.png"

# Verify the file was created
if [ -f "${SRCROOT}/Resources/Icon.png" ]; then
    echo "✅ Icon.png generated successfully at: ${SRCROOT}/Resources/Icon.png"
    ls -la "${SRCROOT}/Resources/Icon.png"
else
    echo "❌ Failed to generate Icon.png"
    exit 1
fi

# Also create it in alternative locations that might be needed
mkdir -p "${SRCROOT}/Life Tracker 2.0/Resources"
cp "${SRCROOT}/Resources/Icon.png" "${SRCROOT}/Life Tracker 2.0/Resources/Icon.png"

echo "🎉 Icon.png generation complete!"
