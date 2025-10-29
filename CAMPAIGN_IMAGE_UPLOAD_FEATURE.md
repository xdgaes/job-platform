# Campaign & Image Upload Feature Documentation

## Overview
This document describes the implementation of the campaign creation feature with image upload capabilities for both campaign thumbnails and user profile pictures.

## Features Implemented

### 1. Campaign Creation with Image Upload
- Create new campaigns with detailed information
- Upload campaign thumbnails (optional)
- Set campaign budget and description
- View all campaigns in the Analytics page

### 2. Profile Picture Upload
- Upload and update user profile pictures
- Real-time preview of uploaded images
- Image validation (type and size)

## Backend Implementation

### Database Schema Changes

#### User Model
Added `profilePicture` field:
```prisma
model User {
  id             Int      @id @default(autoincrement())
  name           String
  email          String   @unique
  password       String
  currentRole    String   @default("clipper")
  profilePicture String?  // NEW: Path to profile picture
  createdAt      DateTime @default(now())
  // ... other fields
}
```

#### Campaign Model
Added `thumbnail` field:
```prisma
model Campaign {
  id          Int      @id @default(autoincrement())
  creatorId   Int
  name        String
  description String?
  thumbnail   String?  // NEW: Path to campaign thumbnail
  budget      Float
  totalSpent  Float    @default(0)
  // ... other fields
}
```

### File Upload Configuration

**Technology:** Multer (multipart/form-data)

**Storage Structure:**
```
backend/uploads/
├── campaigns/     # Campaign thumbnails
└── profiles/      # User profile pictures
```

**Upload Limits:**
- Maximum file size: 5MB
- Accepted formats: JPEG, JPG, PNG, GIF, WebP

### API Endpoints

#### Campaign Endpoints
- **POST** `/api/campaigns`
  - Creates a new campaign
  - Accepts multipart/form-data
  - Fields: `creatorId`, `name`, `description`, `budget`, `thumbnail` (file)
  - Middleware: `uploadCampaignImage`

#### User Profile Endpoints
- **GET** `/api/auth/profile`
  - Retrieves user profile information
  - Protected route (requires authentication)

- **POST** `/api/auth/profile-picture`
  - Uploads/updates user profile picture
  - Accepts multipart/form-data
  - Field: `profilePicture` (file)
  - Middleware: `uploadProfileImage`
  - Protected route (requires authentication)

### Middleware

**Upload Middleware** (`/backend/src/middleware/uploadMiddleware.js`):
- `uploadCampaignImage`: Handles campaign thumbnail uploads
- `uploadProfileImage`: Handles profile picture uploads
- Both include file validation and size limits

**Static File Serving:**
```javascript
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
```

## Frontend Implementation

### New Components

#### 1. CreateCampaign Component (`/frontend/src/pages/CreateCampaign.jsx`)

**Features:**
- Beautiful, modern UI with drag-and-drop thumbnail upload
- Form validation
- Image preview before upload
- Loading states
- Error handling
- Responsive design

**Form Fields:**
- Campaign Name (required)
- Description (optional)
- Budget (required)
- Thumbnail (optional, with preview)

**Navigation:**
- Accessible via `/create-campaign` route
- Protected route (requires authentication)
- Button added to Analytics page

#### 2. Enhanced EditProfile Component

**Updates:**
- Integrated actual API calls for profile picture upload
- Real-time image preview
- File validation
- Loading and error states
- Updates user context after successful upload

### Routes Added

```javascript
<Route path="/create-campaign" element={<PrivateRoute><CreateCampaign /></PrivateRoute>} />
```

### UI/UX Features

**Campaign Creation:**
- Clean, card-based layout
- Drag-and-drop or click to upload
- Image preview with remove option
- Visual feedback for validation errors
- Success redirect to Analytics page

**Profile Picture Upload:**
- Circular avatar preview
- Upload button with icon
- Maintains consistent design with existing UI
- Smooth transitions and animations

## File Validation

Both campaign thumbnails and profile pictures undergo validation:

1. **File Type Check:**
   - Only image files allowed (JPEG, JPG, PNG, GIF, WebP)
   - Server-side and client-side validation

2. **File Size Check:**
   - Maximum 5MB per file
   - Clear error messages for oversized files

3. **Error Handling:**
   - User-friendly error messages
   - No partial uploads on validation failure

## Usage Guide

### Creating a Campaign

1. Navigate to Analytics page (`/analytics`)
2. Click "New Campaign" button (or "Create Campaign" if no campaigns exist)
3. Fill in campaign details:
   - Campaign Name (required)
   - Description (optional)
   - Budget (required)
   - Upload thumbnail (optional)
4. Click "Create Campaign"
5. Redirected to Analytics page with new campaign

### Uploading Profile Picture

1. Navigate to Profile page (`/profile`)
2. Click "Edit Profile"
3. Click "Change Photo" button
4. Select image from device
5. Preview appears immediately
6. Click "Save Changes"
7. Profile picture updated across the application

## Database Migration

After pulling this feature, run:

```bash
cd backend
npx prisma migrate dev
```

This will apply the schema changes (adding `thumbnail` and `profilePicture` fields).

## Environment Setup

Ensure your backend has proper write permissions for the uploads directory:

```bash
mkdir -p backend/uploads/campaigns backend/uploads/profiles
chmod 755 backend/uploads
```

## Security Considerations

1. **File Type Validation:** Both server-side and client-side
2. **File Size Limits:** Enforced at 5MB
3. **Authentication:** Profile picture upload requires valid JWT token
4. **Sanitized Filenames:** Multer generates unique, safe filenames
5. **Static File Serving:** Only uploads directory is publicly accessible

## Dependencies Added

### Backend
```json
{
  "multer": "^1.4.5-lts.1"
}
```

Install with:
```bash
cd backend
npm install multer
```

## API Response Examples

### Create Campaign Success
```json
{
  "id": 1,
  "creatorId": 1,
  "name": "Summer Product Launch",
  "description": "Promoting our new summer collection",
  "thumbnail": "/uploads/campaigns/campaign-1234567890-123456789.jpg",
  "budget": 5000,
  "totalSpent": 0,
  "status": "active",
  "createdAt": "2025-10-29T10:00:00.000Z",
  "updatedAt": "2025-10-29T10:00:00.000Z",
  "analytics": {
    "id": 1,
    "campaignId": 1,
    "totalViews": 0,
    "totalLikes": 0,
    // ... other analytics fields
  }
}
```

### Upload Profile Picture Success
```json
{
  "message": "Profile picture updated successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "currentRole": "creator",
    "profilePicture": "/uploads/profiles/profile-1234567890-123456789.jpg"
  }
}
```

## Future Enhancements

Potential improvements for future iterations:

1. **Image Optimization:**
   - Automatic image compression
   - Multiple sizes for responsive images
   - WebP conversion for better performance

2. **Cloud Storage:**
   - Integration with AWS S3, Google Cloud Storage, or Cloudinary
   - CDN delivery for faster loading

3. **Additional Validation:**
   - Image dimension requirements
   - Aspect ratio validation
   - EXIF data stripping for privacy

4. **Batch Operations:**
   - Multiple image upload for campaigns
   - Gallery support
   - Bulk delete functionality

5. **Image Editing:**
   - In-browser cropping
   - Filters and adjustments
   - Preview before upload

## Troubleshooting

### Issue: "No file uploaded" error
**Solution:** Ensure Content-Type is set to `multipart/form-data` in the request

### Issue: Images not displaying
**Solution:** 
- Check if backend server is serving static files correctly
- Verify uploads directory exists and has proper permissions
- Check CORS settings if frontend and backend are on different domains

### Issue: File size error
**Solution:** 
- Compress images before uploading
- Maximum size is 5MB per file
- Use online tools or image editing software to reduce file size

## Testing

Test the features with:

1. **Campaign Creation:**
   - Create campaign without thumbnail
   - Create campaign with thumbnail
   - Validate file size limits
   - Validate file type restrictions

2. **Profile Picture Upload:**
   - Upload new profile picture
   - Replace existing profile picture
   - Test file validation
   - Verify image persists across sessions

## Conclusion

This feature provides a complete solution for campaign management with image uploads, enhancing the user experience and enabling richer content creation. The implementation follows best practices for security, validation, and user experience.
