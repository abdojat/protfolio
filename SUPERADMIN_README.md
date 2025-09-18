# Super Admin Feature

This document explains how to set up and use the protected super admin page.

## Setup Instructions

### 1. Install Dependencies

First, install the required dependencies for client-side routing:

```bash
cd client
npm install react-router-dom @types/react-router-dom
```

### 2. Server Setup

Make sure your server is running and has the authentication endpoints set up. The server should have:

- JWT authentication middleware
- Admin model with role-based access
- Authentication routes (`/api/auth/login`, `/api/auth/me`, `/api/auth/admins`)

### 3. Create a Super Admin User

You'll need to create a super admin user in your database. You can do this through your server's admin creation script or directly in the database.

Example admin user structure:
```json
{
  "name": "Super Admin",
  "email": "admin@example.com",
  "password": "securepassword",
  "role": "super-admin",
  "isActive": true
}
```

## Usage

### Accessing the Super Admin Page

1. Navigate to `/login` in your application
2. Enter your super admin credentials
3. Upon successful login, you'll be redirected to `/superadmin`

### Features Available

The super admin dashboard includes:

- **Dashboard Overview**: Statistics about total admins, super admins, and regular admins
- **Admin Management**: 
  - View all admin users
  - Create new admin users
  - Edit existing admin users (UI ready, backend implementation needed)
  - Delete admin users (UI ready, backend implementation needed)
- **User Authentication**: Secure login/logout functionality
- **Role-based Access**: Only super-admin users can access this page

### Routes

- `/` - Main portfolio page (public)
- `/login` - Admin login page (public)
- `/superadmin` - Super admin dashboard (protected, requires super-admin role)
- `/unauthorized` - Access denied page (public)

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Automatic redirection for unauthorized access
- **Role-based Authorization**: Different access levels for admin vs super-admin
- **Token Storage**: Secure localStorage token management
- **Auto-logout**: Automatic logout on token expiration

## API Endpoints Used

The super admin feature uses these server endpoints:

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin info
- `GET /api/auth/admins` - Get all admins (super-admin only)
- `POST /api/auth/admins` - Create new admin (super-admin only)

## Environment Variables

Make sure your client has the correct API URL set:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Common Issues

1. **"Module not found" errors**: Make sure you've installed `react-router-dom`
2. **Authentication fails**: Check that your server is running and the API endpoints are working
3. **Access denied**: Ensure your user has the `super-admin` role in the database
4. **CORS errors**: Make sure your server allows requests from your client domain

### Development Tips

- Use browser developer tools to check network requests
- Check the browser console for any JavaScript errors
- Verify that your JWT token is being stored in localStorage
- Test with different user roles to ensure proper access control

## Future Enhancements

Potential improvements for the super admin feature:

- Add admin user editing functionality
- Implement admin user deletion
- Add audit logs for admin actions
- Create admin activity dashboard
- Add bulk operations for admin management
- Implement admin user search and filtering
