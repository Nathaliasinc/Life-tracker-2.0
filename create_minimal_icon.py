import base64

# Create a minimal valid 1x1 PNG file in base64
png_data = base64.b64decode(
    b'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
)

# Write to Icon.png
with open('Life Tracker 2.0/Life Tracker 2.0/Resources/Icon.png', 'wb') as f:
    f.write(png_data)

print("✅ Created minimal valid PNG file")
