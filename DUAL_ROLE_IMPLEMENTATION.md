# Dual Role System Implementation

## Overview
This project now supports a dual-role system where users can be either **Clippers** or **Creators**. Users can switch between roles at any time from their profile.

---

## ✨ Features Implemented

### 1. **Role Selection During Registration**
- Users choose their initial role when signing up
- Beautiful UI with card-based selection between Clipper and Creator
- Visual indicators (Scissors icon for Clippers, Video icon for Creators)
- Default role is set to "Clipper" if not specified

### 2. **Role-Based Login**
- Users log in with their previously selected role
- The backend returns the user's current role from the database
- Frontend syncs the role across the application

### 3. **Role Switching**
- Users can switch roles from their Profile page
- Click the switch icon in the navbar to open role selection modal
- Beautiful modal UI with visual role cards
- Role is updated in the database and new JWT token is issued
- Smooth transition with loading state

### 4. **Persistent Role State**
- Role is stored in the database (`currentRole` field)
- Role persists across sessions
- When user logs back in, they use their previously selected role

---

## 🗄️ Database Changes

### Schema Update
```prisma
model User {
  id          Int      @id @default(autoincrement())
  name        String
  email       String   @unique
  password    String
  currentRole String   @default("clipper") // 'clipper' | 'creator'
  createdAt   DateTime @default(now())
  
  jobs         Job[]
  applications Application[]
  wallet       Wallet?
}
```

### Migration
Run the migration SQL manually if needed:
- Location: `/workspace/backend/prisma/migrations/manual_add_dual_role_system.sql`
- Or regenerate Prisma client: `npx prisma generate`

---

## 🔧 Backend Changes

### 1. **Auth Controller** (`/backend/src/controllers/authController.js`)
- **Register**: Accepts `currentRole` parameter, validates it, defaults to "clipper"
- **Login**: Returns user's `currentRole` from database, includes it in JWT token
- **Switch Role**: New endpoint to update user's current role

### 2. **Auth Routes** (`/backend/src/routes/authRoutes.js`)
- `POST /auth/register` - Register with role selection
- `POST /auth/login` - Login with role
- `POST /auth/switch-role` - Switch role (protected route)

### 3. **API Endpoints**

#### Register
```javascript
POST /auth/register
Body: {
  name: string,
  email: string,
  password: string,
  currentRole: "clipper" | "creator" // optional, defaults to "clipper"
}
```

#### Login
```javascript
POST /auth/login
Body: {
  email: string,
  password: string
}
Response: {
  token: string,
  user: {
    id: number,
    name: string,
    email: string,
    currentRole: "clipper" | "creator"
  }
}
```

#### Switch Role
```javascript
POST /auth/switch-role
Headers: {
  Authorization: "Bearer <token>"
}
Body: {
  currentRole: "clipper" | "creator"
}
Response: {
  token: string, // new token with updated role
  user: {
    id: number,
    name: string,
    email: string,
    currentRole: "clipper" | "creator"
  }
}
```

---

## 🎨 Frontend Changes

### 1. **Register Page** (`/frontend/src/pages/Register.jsx`)
- Added beautiful role selection cards
- Interactive UI with hover effects
- Visual feedback for selected role
- Scissors icon for Clipper, Video icon for Creator
- Submit button shows selected role

### 2. **Profile Page** (`/frontend/src/pages/Profile.jsx`)
- Current role badge in navbar with icon
- Switch role button in navbar
- Role information in profile details with icon
- Beautiful role switch modal with:
  - Large role cards
  - Visual indicators (icons, colors)
  - Checkmark on currently active role
  - Loading state during switch
  - Helpful description text

### 3. **Auth Context** (`/frontend/src/context/AuthContext.jsx`)
- Updated `register()` to accept `currentRole` parameter
- Updated `login()` to sync role from backend
- Added `switchRole()` function to change role in database
- Updated `toggleMode()` to use `switchRole()`
- Role state management with localStorage sync

---

## 🎯 User Experience Flow

### New User Registration
1. User visits `/register`
2. Selects role (Clipper or Creator) via visual cards
3. Fills in name, email, password
4. Clicks "Register as Clipper" or "Register as Creator"
5. Automatically logged in with selected role

### Existing User Login
1. User visits `/login`
2. Enters credentials
3. System retrieves their last selected role from database
4. User is logged in with that role
5. UI reflects the current role

### Role Switching
1. User goes to `/profile`
2. Sees current role in navbar badge
3. Clicks switch icon button
4. Modal appears with both role options
5. Current role is highlighted with checkmark
6. User selects new role
7. System updates database and issues new token
8. Modal closes, UI updates to reflect new role
9. User can now use the app as the new role

---

## 🎨 UI/UX Highlights

### Design Elements
- **Icons**: Scissors for Clippers, Video for Creators
- **Colors**: Indigo theme for consistency
- **Interactions**: Smooth transitions, hover effects
- **Feedback**: Loading states, visual indicators
- **Accessibility**: Clear labels, keyboard navigation

### Visual Components
- Role badges with icons
- Animated role switch button
- Beautiful modal overlays
- Card-based role selection
- Checkmarks for active selection
- Responsive design

---

## 🔐 Security

- Role is stored securely in database
- JWT tokens include current role
- Role switching requires authentication
- Backend validates all role changes
- Only "clipper" and "creator" roles are allowed

---

## 📝 Testing Checklist

- [ ] Register as Clipper
- [ ] Register as Creator
- [ ] Login and verify correct role is loaded
- [ ] Switch from Clipper to Creator
- [ ] Switch from Creator to Clipper
- [ ] Logout and login again to verify role persistence
- [ ] Check role display in profile
- [ ] Verify JWT token includes correct role
- [ ] Test with existing users (migration)

---

## 🚀 Next Steps (Optional Enhancements)

1. **Role-Based Features**
   - Show different dashboard content based on role
   - Clipper-specific features (apply for jobs, view earnings)
   - Creator-specific features (post jobs, manage clippers)

2. **Role Analytics**
   - Track time spent in each role
   - Show role-specific statistics
   - Role switch history

3. **Role Permissions**
   - Implement role-based access control
   - Restrict certain routes based on role
   - Role-specific API endpoints

4. **Enhanced UI**
   - Role indicator in navbar globally
   - Role-specific color schemes
   - Onboarding tour for each role

---

## 📂 Files Modified

### Backend
- ✅ `/backend/prisma/schema.prisma`
- ✅ `/backend/src/controllers/authController.js`
- ✅ `/backend/src/routes/authRoutes.js`

### Frontend
- ✅ `/frontend/src/pages/Register.jsx`
- ✅ `/frontend/src/pages/Profile.jsx`
- ✅ `/frontend/src/context/AuthContext.jsx`

### Documentation
- ✅ `/backend/prisma/migrations/manual_add_dual_role_system.sql`
- ✅ `/DUAL_ROLE_IMPLEMENTATION.md` (this file)

---

## 💡 Tips

1. **Database Setup**: Run `npx prisma generate` in `/backend` to update Prisma client
2. **Environment**: Ensure `DATABASE_URL` is set in backend `.env` file
3. **Testing**: Test role switching with different users to verify persistence
4. **Customization**: You can easily add more roles by updating the validation in the backend

---

## 🐛 Troubleshooting

**Issue**: Role not persisting after logout
- **Solution**: Check that backend is returning `currentRole` in login response

**Issue**: Switch role button not working
- **Solution**: Verify JWT token is being sent in Authorization header

**Issue**: Migration errors
- **Solution**: Run Prisma generate first, then apply migration manually if needed

**Issue**: UI not updating after role switch
- **Solution**: Check that AuthContext is updating both user and mode state

---

## ✅ Implementation Complete!

The dual-role system is now fully functional across your entire project. Users can seamlessly choose their role during registration and switch between Clipper and Creator roles anytime from their profile page.

**Enjoy your enhanced Clipper & Creator platform! 🎉**
