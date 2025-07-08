# Xcode Cloud Configuration
# ci_scripts/ci_post_clone.sh - Runs after git clone, before build

#!/bin/bash

echo "🔧 Xcode Cloud: Setting up Life Tracker 2.0 Safari Extension..."

# Ensure we're in the right directory
cd "$CI_WORKSPACE"

# Create Resources directory
mkdir -p "Life Tracker 2.0/Resources"

# Generate Icon.png using base64 encoded minimal PNG
PNG_DATA="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

# Decode and create Icon.png
echo "$PNG_DATA" | base64 -d > "Life Tracker 2.0/Resources/Icon.png"

# Verify file creation
if [ -f "Life Tracker 2.0/Resources/Icon.png" ]; then
    echo "✅ Icon.png created successfully for Xcode Cloud build"
    echo "📁 File location: Life Tracker 2.0/Resources/Icon.png"
    echo "📏 File size: $(wc -c < "Life Tracker 2.0/Resources/Icon.png") bytes"
else
    echo "❌ Failed to create Icon.png"
    exit 1
fi

echo "🚀 Xcode Cloud setup complete!"
