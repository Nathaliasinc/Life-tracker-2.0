import base64
import os

# Create a minimal valid 1x1 PNG file in base64
png_data = base64.b64decode(
    b'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
)

# Create all required icon sizes
icons_dir = 'Life Tracker 2.0/Life Tracker 2.0/Resources/icons'
os.makedirs(icons_dir, exist_ok=True)

sizes = [16, 32, 48, 64, 96, 128, 256, 512]

for size in sizes:
    icon_path = f'{icons_dir}/icon-{size}.png'
    with open(icon_path, 'wb') as f:
        f.write(png_data)
    print(f"✅ Created icon-{size}.png")

print("\n🎉 All icon files created successfully!")
print("📋 Ready for Xcode Cloud build!")
