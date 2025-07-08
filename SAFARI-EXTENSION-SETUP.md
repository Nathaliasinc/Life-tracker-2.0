# Life Tracker 2.0 Safari Web Extension - Xcode Cloud Setup Guide

## Overview

This guide will help you set up the **Life Tracker 2.0** Safari Web Extension for Apple Developer compatibility and Xcode Cloud builds. The extension includes a comprehensive daily planner, budget tracker, affirmations system, fitness tracker, and more.

## Extension Structure

```
life-tracker-extension/
├── Resources/
│   ├── manifest.json          # Safari-compatible manifest
│   ├── background.js          # Background script for extension lifecycle
│   ├── content.js             # Content script for page enhancements
│   ├── content.css            # Styles for content script
│   ├── popup.html             # Main extension UI (ported from index.html)
│   ├── Icon.png               # Main icon for Xcode (required)
│   └── icons/
│       ├── generate-icons.html # Icon generator utility
│       ├── icon-16.png         # All required icon sizes
│       ├── icon-32.png
│       ├── icon-48.png
│       ├── icon-64.png
│       ├── icon-96.png
│       ├── icon-128.png
│       ├── icon-256.png
│       └── icon-512.png
```

## Step 1: Generate All Required Icons

1. **Open the Icon Generator**:
   - Navigate to `life-tracker-extension/Resources/icons/generate-icons.html`
   - Open it in a web browser

2. **Generate All Icons**:
   - Click "Generate All Icons" button
   - The generator will create all required sizes: 16, 32, 48, 64, 96, 128, 256, 512px
   - Icons will be automatically downloaded

3. **Place Icons Correctly**:
   - Move all generated icons to: `life-tracker-extension/Resources/icons/`
   - Move the main `Icon.png` to: `life-tracker-extension/Resources/Icon.png`

## Step 2: Xcode Cloud Setup

### For Manual Xcode Build:

1. **Open Xcode**
2. **Create New Project**:
   - Choose "Safari Extension App"
   - Name: "Life Tracker 2.0"
   - Bundle ID: `com.yourcompany.lifetracker`

3. **Replace Extension Resources**:
   - Replace the default `Resources` folder with our `life-tracker-extension/Resources/`
   - Ensure `Icon.png` is in the main `Resources/` directory

### For Xcode Cloud (Automated Build):

1. **Repository Setup**:
   ```bash
   # Ensure all files are committed
   git add life-tracker-extension/
   git commit -m "Add Life Tracker 2.0 Safari Web Extension"
   git push origin main
   ```

2. **Xcode Cloud Configuration**:
   - In App Store Connect, set up Xcode Cloud workflow
   - Point to your repository
   - Ensure the extension folder structure is preserved

3. **Important Xcode Cloud Requirements**:
   - The `Icon.png` file MUST be in `Resources/Icon.png`
   - All icon files must be committed to git
   - Manifest.json must be Safari-compatible (no Chrome-specific fields)

## Step 3: Extension Features

The Life Tracker 2.0 extension includes:

### 🏠 **Home Dashboard**
- Quick overview of daily tasks
- Recent affirmations display
- Budget summary
- Today's schedule

### 📅 **Plan a Day**
- Interactive calendar system
- Task management
- Event scheduling
- Notes and reminders

### ✨ **Affirmations**
- Daily positive affirmations
- Custom affirmation creation
- Motivational message generator

### 💰 **Budget Tracker**
- Income and expense tracking
- Savings goals (10% rule)
- Investment planning
- Spending analysis

### 🛒 **Grocery Lists**
- Smart shopping lists
- Item categorization
- Cross-off functionality

### 💪 **Fitness Tracker**
- Workout goal setting
- Exercise logging
- Calorie tracking
- Progress monitoring

### ⚙️ **Settings**
- Theme customization
- Font preferences
- Notification settings
- Data export/import

## Step 4: Testing the Extension

### Local Testing:
1. Build the extension in Xcode
2. Enable "Develop" menu in Safari
3. Load the extension for testing
4. Verify all features work correctly

### Xcode Cloud Testing:
1. Push changes to your repository
2. Trigger Xcode Cloud build
3. Monitor build logs for any issues
4. Download and test the built extension

## Step 5: App Store Submission

1. **Archive the Build**:
   - Use Xcode Cloud or manual Xcode build
   - Create app archive

2. **Upload to App Store Connect**:
   - Use built-in upload functionality
   - Ensure all metadata is complete

3. **Review Process**:
   - Apple will review the extension
   - Ensure compliance with App Store guidelines

## Troubleshooting

### Common Xcode Cloud Issues:

1. **"Icon.png cannot be found"**:
   - Ensure `Icon.png` is in `Resources/Icon.png`
   - Check that the file is committed to git
   - Verify file case sensitivity

2. **Manifest Issues**:
   - Use only Safari-compatible manifest fields
   - Avoid Chrome-specific permissions
   - Test manifest validation

3. **Build Failures**:
   - Check Xcode Cloud build logs
   - Ensure all dependencies are included
   - Verify code signing setup

### Local Development Issues:

1. **Extension Not Loading**:
   - Check Safari's Develop menu
   - Verify extension is enabled
   - Review browser console for errors

2. **Feature Not Working**:
   - Check popup.html console
   - Verify localStorage permissions
   - Test background script functionality

## Development Notes

- **Storage**: Uses Chrome storage API (compatible with Safari)
- **Popup Size**: Optimized for Safari extension popup (400x600px)
- **Performance**: Lightweight and fast loading
- **Compatibility**: Works with Safari 14+ and macOS 10.15+

## Support

For issues or questions:
1. Check the browser console for error messages
2. Review the background script logs
3. Test individual features in isolation
4. Verify all icons are properly generated and placed

## Version History

- **v2.0.0**: Complete Life Tracker application with full Safari Web Extension compatibility
- **v1.0.0**: Initial Safari Web Extension conversion

---

**Important**: Always test the extension locally before submitting to Xcode Cloud to ensure all features work correctly in the Safari environment.
