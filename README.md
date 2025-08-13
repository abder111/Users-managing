# User Management System - MERN Stack

A complete user management web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring admin authentication, user CRUD operations, and a modern responsive UI.

## 🚀 Features

### Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin/User roles)
- **Protected routes** for admin-only functionality
- **Secure password hashing** using bcrypt

### User Management
- **View all users** with search and filtering capabilities
- **Create new users** with comprehensive form validation
- **Edit user information** including role, status, and profile details
- **Delete users** with confirmation dialogs
- **User status management** (Active/Inactive)

### Task Management
- **Assign tasks** to users with deadlines and priorities
- **Task status tracking** (Pending, Accepted, In Progress, Completed, Overdue)
- **Priority levels** (Low, Medium, High, Urgent)
- **Task categories** for better organization
- **Deadline management** with overdue detection
- **Task acceptance workflow** for assigned users
- **Admin task oversight** with full CRUD operations

### User Profile Information
- Name, Email, Phone
- Role (Admin/User)
- Department and Position
- Account status
- Creation and update timestamps

### Modern UI/UX
- **Responsive design** that works on all devices
- **Modern card-based layout** with clean typography
- **Interactive modals** for user operations
- **Toast notifications** for user feedback
- **Loading states** and error handling
- **Search functionality** for quick user lookup

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd user-management-app
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

### 3. Environment Configuration

#### Backend Environment
Create a `.env` file in the `backend` directory:
```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Note:** For production, use a strong JWT secret and a proper MongoDB connection string.

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Start MongoDB (Windows)
net start MongoDB

# Start MongoDB (macOS/Linux)
sudo systemctl start mongod
```

### 5. Run the Application

#### Development Mode (Both Frontend & Backend)
```bash
# From the root directory
npm run dev
```

#### Production Mode
```bash
# Build the frontend
cd frontend
npm run build

# Start the backend
cd ../backend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👤 Default Admin Account

For testing purposes, you can create an admin account using the registration form:

**Email:** admin@example.com  
**Password:** admin123  
**Role:** Admin

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### User Management (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Task Management
- `GET /api/tasks` - Get all tasks (admin) or user's tasks (user)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task (admin only)
- `PUT /api/tasks/:id` - Update task (admin only)
- `DELETE /api/tasks/:id` - Delete task (admin only)
- `PUT /api/tasks/:id/accept` - Accept task (assigned user only)
- `PUT /api/tasks/:id/start` - Start task (assigned user only)
- `PUT /api/tasks/:id/complete` - Complete task (assigned user only)
- `GET /api/tasks/user/:userId` - Get tasks assigned to specific user (admin only)

## 🎯 Usage Guide

### 1. First Time Setup
1. Start the application using `npm run dev`
2. Navigate to http://localhost:3000
3. Click "Don't have an account? Sign up"
4. Create an admin account
5. Login with your credentials

### 2. Managing Users
1. **View Users**: Navigate to "Manage Users" from the navbar
2. **Search Users**: Use the search bar to filter users by name, email, or role
3. **Add User**: Click "Add New User" button
4. **Edit User**: Click the edit icon (pencil) next to any user
5. **Delete User**: Click the delete icon (trash) next to any user
6. **View Details**: Click the view icon (eye) to see full user information

### 3. User Roles
- **Admin**: Full access to manage all users
- **User**: Can only view their own profile and dashboard

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Role-based Access**: Admin-only routes for user management

## 🎨 UI Components

The application includes several reusable components:
- **Login/Register Forms** with validation
- **User Table** with search and pagination
- **User Modal** for view/edit/delete operations
- **Dashboard** with user statistics
- **Navigation Bar** with user info and logout
- **Toast Notifications** for user feedback

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Set environment variables in Heroku dashboard
5. Deploy using Git

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your preferred hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Verify MongoDB is running
3. Ensure all environment variables are set correctly
4. Check that all dependencies are installed

## 🔄 Updates

To update the application:
1. Pull the latest changes: `git pull origin main`
2. Install any new dependencies: `npm install`
3. Restart the application: `npm run dev`

---


