import base64
import os

# Create a minimal valid 1x1 PNG file in base64
png_data = base64.b64decode(
    b'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
)

# Create Icon.png in multiple locations to cover all possible paths
locations = [
    'Life Tracker 2.0/Life Tracker 2.0/Resources/Icon.png',
    'Life Tracker 2.0/Resources/Icon.png', 
    'Life Tracker 2.0/Icon.png',
    'Life Tracker 2.0 Safari Extension/Shared (Extension)/Resources/Icon.png',
    'Life Tracker 2.0 Safari Extension/Shared (Extension)/Icon.png',
    'Life Tracker 2.0 Safari Extension/Icon.png'
]

for location in locations:
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(location), exist_ok=True)
    
    # Write the PNG file
    with open(location, 'wb') as f:
        f.write(png_data)
    
    print(f"✅ Created Icon.png at: {location}")

print("\n🎯 Icon.png files created in all possible locations!")
print("📋 This should cover any path Xcode Cloud might be looking for.")
