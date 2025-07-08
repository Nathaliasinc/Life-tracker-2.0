# Life Tracker 2.0 - Deployment Checklist for Xcode Cloud

## Pre-Deployment Checklist

### ✅ Extension Files Verification

- [ ] `life-tracker-extension/Resources/manifest.json` exists and is valid
- [ ] `life-tracker-extension/Resources/background.js` is present
- [ ] `life-tracker-extension/Resources/content.js` is present  
- [ ] `life-tracker-extension/Resources/content.css` is present
- [ ] `life-tracker-extension/Resources/popup.html` is present and complete

### ✅ Icons Verification

**Required Icons in `life-tracker-extension/Resources/icons/`:**
- [ ] icon-16.png
- [ ] icon-32.png
- [ ] icon-48.png
- [ ] icon-64.png
- [ ] icon-96.png
- [ ] icon-128.png
- [ ] icon-256.png
- [ ] icon-512.png

**Main Icon for Xcode:**
- [ ] `life-tracker-extension/Resources/Icon.png` (main app icon)

### ✅ Git Repository Status

- [ ] All extension files are added to git
- [ ] All icons are committed to repository
- [ ] Latest changes are pushed to remote repository
- [ ] Repository is accessible by Xcode Cloud

### ✅ Xcode Cloud Configuration

- [ ] Xcode Cloud workflow is set up in App Store Connect
- [ ] Repository connection is established
- [ ] Build environment is configured
- [ ] Code signing certificates are in place

## Deployment Steps

### Step 1: Final Icon Generation

```bash
# Navigate to the icons directory
cd life-tracker-extension/Resources/icons/

# Open the icon generator
# Open generate-icons.html in browser and generate all icons
```

### Step 2: Git Operations

```bash
# Add all extension files
git add life-tracker-extension/

# Commit changes
git commit -m "Life Tracker 2.0: Complete Safari Web Extension ready for Xcode Cloud"

# Push to repository
git push origin main
```

### Step 3: Xcode Cloud Build

1. **Trigger Build**:
   - Go to App Store Connect
   - Navigate to your app
   - Start Xcode Cloud build

2. **Monitor Build**:
   - Watch build logs for errors
   - Verify all resources are found
   - Check for icon-related issues

### Step 4: Post-Build Verification

- [ ] Build completes successfully
- [ ] No icon missing errors
- [ ] Extension bundle is created
- [ ] Archive is available for download

## Quick Commands Reference

### Local Testing Commands

```bash
# Check file structure
ls -la life-tracker-extension/Resources/
ls -la life-tracker-extension/Resources/icons/

# Verify icon files
file life-tracker-extension/Resources/icons/*.png
file life-tracker-extension/Resources/Icon.png

# Check git status
git status
git log --oneline -5
```

### Troubleshooting Commands

```bash
# If icons are missing, regenerate them
# Open generate-icons.html in browser

# If git issues occur
git add -A
git commit -m "Fix missing files"
git push origin main --force-with-lease

# Check file permissions (macOS/Linux)
chmod 644 life-tracker-extension/Resources/icons/*.png
chmod 644 life-tracker-extension/Resources/Icon.png
```

## Expected Build Output

### Successful Build Should Include:

1. **Extension Bundle**: `Life Tracker 2.0.app`
2. **All Icons**: Properly embedded in app bundle
3. **Extension Resources**: All HTML, CSS, JS files
4. **Manifest**: Properly processed and validated

### Build Logs Should Show:

```
✅ Processing manifest.json
✅ Found Icon.png
✅ Processing extension resources
✅ Bundling extension
✅ Code signing successful
✅ Archive created
```

## Common Issues and Fixes

### Issue: "Icon.png cannot be found"

**Solution**:
```bash
# Ensure Icon.png is in the correct location
cp life-tracker-extension/Resources/icons/icon-512.png life-tracker-extension/Resources/Icon.png

# Commit and push
git add life-tracker-extension/Resources/Icon.png
git commit -m "Add main Icon.png for Xcode Cloud"
git push origin main
```

### Issue: "Invalid manifest.json"

**Solution**:
- Open `life-tracker-extension/Resources/manifest.json`
- Validate JSON syntax
- Remove any Chrome-specific fields
- Ensure all icon paths are correct

### Issue: "Missing extension resources"

**Solution**:
```bash
# Verify all files are present
ls -la life-tracker-extension/Resources/

# Re-add any missing files
git add life-tracker-extension/Resources/
git commit -m "Ensure all extension resources are included"
git push origin main
```

## Performance Checklist

- [ ] Popup loads in under 2 seconds
- [ ] All features work in Safari environment
- [ ] No console errors in popup
- [ ] Background script initializes properly
- [ ] Content script doesn't conflict with web pages

## Final Verification

Before marking as complete:

1. **Local Test**: Build and test locally in Xcode
2. **Safari Test**: Load extension in Safari and test all features
3. **Cloud Build**: Successful Xcode Cloud build
4. **Archive Test**: Download and install the archived build

## Submission Readiness

- [ ] Extension works flawlessly
- [ ] All icons display correctly
- [ ] No crashes or errors
- [ ] Meets App Store guidelines
- [ ] Privacy policy prepared (if required)
- [ ] App metadata completed in App Store Connect

---

**Status**: Ready for Xcode Cloud deployment ✅

**Last Updated**: $(date)
**Version**: 2.0.0
**Build Environment**: Xcode Cloud Compatible
