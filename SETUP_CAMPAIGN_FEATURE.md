# Quick Setup Guide - Campaign & Image Upload Feature

## 🎉 Feature Summary

I've successfully implemented the following features:

### ✅ Campaign Creation
- Create new campaigns with name, description, and budget
- Upload campaign thumbnails (optional)
- View all campaigns in Analytics dashboard
- Beautiful, modern UI with image preview

### ✅ Profile Picture Upload
- Upload and update user profile pictures
- Image validation (type and size)
- Real-time preview before upload
- Automatic storage and serving

## 🚀 Quick Start

### 1. Install Dependencies

Backend:
```bash
cd backend
npm install
```

The `multer` package has already been installed for file uploads.

### 2. Database Migration

Run the migration to add image fields to your database:
```bash
cd backend
npx prisma migrate dev --name add_image_fields
```

Or generate Prisma client without migration (if DB is not ready):
```bash
cd backend
npx prisma generate
```

### 3. Create Upload Directories

The directories are already created, but ensure they exist:
```bash
cd backend
mkdir -p uploads/campaigns uploads/profiles
```

### 4. Start the Application

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## 📁 File Changes Summary

### Backend Files Created/Modified:
- ✅ `backend/src/middleware/uploadMiddleware.js` - NEW: File upload middleware
- ✅ `backend/src/controllers/campaignController.js` - UPDATED: Image upload support
- ✅ `backend/src/controllers/authController.js` - UPDATED: Profile picture endpoints
- ✅ `backend/src/routes/campaignRoutes.js` - UPDATED: Upload middleware
- ✅ `backend/src/routes/authRoutes.js` - UPDATED: Profile picture routes
- ✅ `backend/src/app.js` - UPDATED: Static file serving
- ✅ `backend/prisma/schema.prisma` - UPDATED: Added image fields
- ✅ `backend/.gitignore` - UPDATED: Ignore uploads directory
- ✅ `backend/uploads/` - NEW: Upload directories

### Frontend Files Created/Modified:
- ✅ `frontend/src/pages/CreateCampaign.jsx` - NEW: Campaign creation page
- ✅ `frontend/src/pages/EditProfile.jsx` - UPDATED: Profile picture upload
- ✅ `frontend/src/pages/Analytics.jsx` - UPDATED: Create campaign button
- ✅ `frontend/src/App.jsx` - UPDATED: New route for CreateCampaign

## 🎯 How to Use

### Create a Campaign:
1. Go to Analytics page (`/analytics`)
2. Click "New Campaign" or "Create Campaign" button
3. Fill in the form:
   - Campaign Name (required)
   - Description (optional)
   - Budget (required)
   - Upload Thumbnail (optional - click or drag & drop)
4. Click "Create Campaign"
5. Your new campaign appears in the Analytics dashboard

### Upload Profile Picture:
1. Go to Profile page (`/profile`)
2. Click "Edit Profile"
3. Click "Change Photo" button
4. Select an image from your device
5. See instant preview
6. Click "Save Changes"
7. Profile picture updates everywhere

## 🔧 API Endpoints

### Campaign Endpoints
```
POST /api/campaigns
- Creates a new campaign with thumbnail
- Content-Type: multipart/form-data
- Fields: creatorId, name, description, budget, thumbnail (file)

GET /api/campaigns/user/:userId
- Get all campaigns for a user

GET /api/campaigns/:campaignId
- Get specific campaign details
```

### Profile Picture Endpoints
```
POST /api/auth/profile-picture
- Upload/update profile picture
- Content-Type: multipart/form-data
- Field: profilePicture (file)
- Requires: Authentication token

GET /api/auth/profile
- Get user profile with profile picture
- Requires: Authentication token
```

## 📊 Database Schema Changes

### User Model
```prisma
model User {
  // ... existing fields
  profilePicture String?  // NEW: Path to profile picture
}
```

### Campaign Model
```prisma
model Campaign {
  // ... existing fields
  thumbnail String?  // NEW: Path to campaign thumbnail
}
```

## 🔒 Security Features

- ✅ File type validation (only images allowed)
- ✅ File size limit (5MB maximum)
- ✅ Unique filename generation
- ✅ Authentication required for profile uploads
- ✅ Sanitized file paths

## 📝 Image Upload Specifications

**Accepted Formats:**
- JPEG / JPG
- PNG
- GIF
- WebP

**Size Limit:** 5MB per file

**Storage:**
- Campaign thumbnails: `/backend/uploads/campaigns/`
- Profile pictures: `/backend/uploads/profiles/`

**Access:**
- Images served at: `http://localhost:5001/uploads/...`

## 🎨 UI Features

### Campaign Creation Form:
- ✨ Modern card-based design
- 📸 Drag & drop image upload
- 👁️ Real-time image preview
- ❌ Remove uploaded image option
- ⚠️ Input validation with error messages
- 🔄 Loading states during submission

### Profile Picture Upload:
- 🖼️ Circular avatar preview
- 📤 Upload button with icon
- ✅ Success feedback
- 🚫 Error handling

## 🐛 Troubleshooting

### Images not displaying?
- Check backend is running on port 5001
- Verify uploads directory exists
- Check browser console for CORS errors

### Upload fails?
- Ensure file is less than 5MB
- Check file format (must be image)
- Verify authentication token is valid (for profile pictures)

### Database errors?
- Run `npx prisma migrate dev`
- Or run `npx prisma generate` to update client

## 📚 Documentation

For detailed documentation, see:
- `CAMPAIGN_IMAGE_UPLOAD_FEATURE.md` - Complete technical documentation

## ✨ Next Steps

Your campaign and image upload feature is ready to use! Here's what you can do:

1. **Test the feature:**
   - Create a test campaign with thumbnail
   - Upload a profile picture
   - Verify images display correctly

2. **Customize:**
   - Adjust image size limits in `uploadMiddleware.js`
   - Modify UI colors and styles
   - Add more campaign fields as needed

3. **Deploy:**
   - Update image URLs for production
   - Configure cloud storage (AWS S3, Cloudinary, etc.)
   - Set up proper environment variables

## 🎊 Success!

You now have a fully functional campaign creation system with image upload capabilities! 

Enjoy your new features! 🚀
