# 🧪 Testing Guide - Campaign & Image Upload Feature

## Quick Test Checklist

### ✅ Pre-flight Check

1. **Backend Dependencies**
   ```bash
   cd backend
   npm list multer
   # Should show: multer@1.4.5-lts.1
   ```

2. **Database Schema**
   ```bash
   cd backend
   npx prisma generate
   # Should complete without errors
   ```

3. **Upload Directories**
   ```bash
   ls -la backend/uploads/
   # Should show: campaigns/ and profiles/
   ```

### 🎯 Feature Testing

#### Test 1: Create Campaign WITHOUT Thumbnail
1. Start the app
2. Navigate to `/analytics`
3. Click "New Campaign" or "Create Campaign"
4. Fill in:
   - Name: "Test Campaign 1"
   - Description: "Testing without image"
   - Budget: 1000
5. Click "Create Campaign"
6. **Expected:** Redirects to Analytics, campaign appears in list

#### Test 2: Create Campaign WITH Thumbnail
1. Navigate to `/create-campaign`
2. Fill in:
   - Name: "Test Campaign 2"
   - Description: "Testing with image"
   - Budget: 2000
   - Thumbnail: Upload any image (< 5MB)
3. **Expected:** Image preview appears
4. Click "Create Campaign"
5. **Expected:** Campaign created, redirects to Analytics

#### Test 3: Upload Profile Picture
1. Navigate to `/profile`
2. Click "Edit Profile"
3. Click "Change Photo"
4. Select an image
5. **Expected:** Image preview appears
6. Click "Save Changes"
7. **Expected:** Profile picture updates on Profile page

#### Test 4: File Validation - Size Limit
1. Navigate to `/create-campaign`
2. Try to upload an image larger than 5MB
3. **Expected:** Error message appears

#### Test 5: File Validation - Type Check
1. Navigate to `/edit-profile`
2. Try to upload a non-image file (PDF, TXT, etc.)
3. **Expected:** Error message appears

### 🔍 Verification

#### Check Backend API
```bash
# Test campaign creation endpoint
curl -X POST http://localhost:5001/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "creatorId": 1,
    "name": "API Test Campaign",
    "description": "Testing via API",
    "budget": 1500
  }'

# Expected: Returns campaign object with ID
```

#### Check Static File Serving
```bash
# After uploading an image, check it's accessible:
# Replace with actual filename from uploads directory
curl -I http://localhost:5001/uploads/campaigns/campaign-123456789-987654321.jpg

# Expected: HTTP 200 OK
```

#### Check Database
```bash
cd backend
npx prisma studio
# Navigate to Campaign model
# Verify: thumbnail field exists and contains path
# Navigate to User model  
# Verify: profilePicture field exists
```

### 🐛 Common Issues & Solutions

#### Issue: "Module not found: multer"
**Solution:**
```bash
cd backend
npm install multer
```

#### Issue: "Cannot find uploads directory"
**Solution:**
```bash
cd backend
mkdir -p uploads/campaigns uploads/profiles
```

#### Issue: Images not displaying
**Solution:**
1. Check browser console for errors
2. Verify backend is on port 5001
3. Check image path in database
4. Ensure static file middleware is configured

#### Issue: "Prisma Client error"
**Solution:**
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### 📊 Success Criteria

✅ All tests should pass:
- [ ] Can create campaign without thumbnail
- [ ] Can create campaign with thumbnail
- [ ] Can upload profile picture
- [ ] File size validation works
- [ ] File type validation works
- [ ] Images persist after refresh
- [ ] Images display correctly
- [ ] No console errors

### 🎨 UI/UX Verification

Check these visual elements:

- [ ] CreateCampaign page renders correctly
- [ ] Image upload area shows drag & drop zone
- [ ] Image preview displays uploaded image
- [ ] Remove image button (X) works
- [ ] Loading spinner appears during upload
- [ ] Error messages display clearly
- [ ] Success redirect works
- [ ] Dark mode works properly
- [ ] Responsive design on mobile

### 📸 Sample Test Images

Use these for testing:

1. **Small JPEG** (< 1MB) - Should work
2. **Large PNG** (2-4MB) - Should work
3. **Huge Image** (> 5MB) - Should fail with error
4. **PDF File** - Should fail with error
5. **WebP Image** - Should work

### 🔐 Security Testing

Verify security features:

- [ ] Profile picture upload requires login
- [ ] Unauthenticated users can't upload
- [ ] Invalid file types are rejected
- [ ] Oversized files are rejected
- [ ] Filenames are sanitized
- [ ] Uploads folder is excluded from git

### 📝 Test Results Template

```
Test Date: ___________
Tester: ___________

[ ] Campaign Creation (no image) - PASS / FAIL
[ ] Campaign Creation (with image) - PASS / FAIL  
[ ] Profile Picture Upload - PASS / FAIL
[ ] File Size Validation - PASS / FAIL
[ ] File Type Validation - PASS / FAIL
[ ] Static File Serving - PASS / FAIL
[ ] Database Persistence - PASS / FAIL
[ ] UI/UX (Dark Mode) - PASS / FAIL
[ ] Responsive Design - PASS / FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

### 🚀 Performance Testing

Optional performance checks:

1. **Upload Speed**
   - 1MB image: Should upload in < 2 seconds
   - 5MB image: Should upload in < 5 seconds

2. **Image Display**
   - Images should load within 500ms
   - No layout shift when images load

3. **Form Submission**
   - Form should submit within 1 second (without image)
   - Form should submit within 3 seconds (with image)

## 🎉 Congratulations!

If all tests pass, your Campaign & Image Upload feature is working perfectly! 

Enjoy using your new features! 🚀

---

**Need help?** Check:
- `SETUP_CAMPAIGN_FEATURE.md` - Setup guide
- `CAMPAIGN_IMAGE_UPLOAD_FEATURE.md` - Technical docs
- `IMPLEMENTATION_COMPLETE.md` - Feature summary
