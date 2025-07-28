# Admin Dashboard Module

This is a standalone admin dashboard module that can be easily integrated into any React project or used as a separate admin panel.

## Features

- 🔐 **Admin Authentication**: Secure login with username/password
- 📊 **Dashboard Analytics**: Real-time statistics and metrics
- 📝 **Test Management**: Create, edit, and manage tests
- 📚 **Topic Management**: Organize content by topics
- 🎯 **Test Type Management**: Categorize different types of tests
- 🧩 **Free Quiz Management**: Create and manage free quizzes
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Modern UI**: Clean, professional interface with Tailwind CSS

## Quick Start

### 1. Copy the Admin Module

Copy the entire `admin` folder to your new project:

```bash
cp -r frontend/src/admin /path/to/your/new/project/src/
```

### 2. Install Dependencies

Make sure you have these dependencies in your new project:

```bash
npm install react-router-dom react-toastify lucide-react axios
```

### 3. Configure Backend URL

Update the API base URL in `admin/utils/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
```

Or set the environment variable:

```bash
REACT_APP_API_URL=http://your-backend-url.com
```

### 4. Import and Use

In your main App.jsx or index.js:

```jsx
import AdminApp from './admin/AdminApp';

// Use as a standalone app
function App() {
  return <AdminApp />;
}

// Or integrate into existing routes
function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      {/* Your other routes */}
    </Routes>
  );
}
```

## File Structure

```
admin/
├── AdminApp.jsx              # Main admin app component
├── README.md                 # This file
├── components/
│   ├── AdminLayout.jsx       # Layout with sidebar navigation
│   └── AdminProtectedRoute.jsx # Route protection component
├── context/
│   └── AdminContext.jsx      # Admin authentication context
├── pages/
│   ├── AdminLogin.jsx        # Login page
│   ├── AdminDashboard.jsx    # Dashboard with statistics
│   ├── CreateTest.jsx        # Test creation form
│   ├── CreateTopic.jsx       # Topic creation form
│   ├── CreateTestType.jsx    # Test type creation form
│   ├── ManageTests.jsx       # Test management interface
│   ├── ManageTopics.jsx      # Topic management interface
│   ├── ManageTestTypes.jsx   # Test type management interface
│   ├── CreateFreeQuiz.jsx    # Free quiz creation form
│   └── ManageFreeQuizzes.jsx # Free quiz management interface
└── utils/
    └── api.js               # API configuration and interceptors
```

## Admin Credentials

Default admin credentials:
- **Username**: Admin
- **Password**: Admin@test123

⚠️ **Important**: Change these credentials in production by modifying the backend admin controller.

## API Endpoints

The admin module expects these backend endpoints:

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/profile` - Get admin profile

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Topics
- `GET /api/topics` - Get all topics
- `POST /api/topics` - Create topic
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic

### Test Types
- `GET /api/type` - Get all test types
- `POST /api/type` - Create test type
- `PUT /api/type/:id` - Update test type
- `DELETE /api/type/:id` - Delete test type

### Tests
- `GET /api/tests` - Get all tests
- `POST /api/tests` - Create test
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test

### Free Quizzes
- `GET /api/free-quiz` - Get all free quizzes
- `POST /api/free-quiz` - Create free quiz
- `PUT /api/free-quiz/:id` - Update free quiz
- `DELETE /api/free-quiz/:id` - Delete free quiz

## Customization

### Styling
The admin module uses Tailwind CSS. You can customize the styling by:

1. Modifying the Tailwind classes in the components
2. Adding custom CSS classes
3. Overriding the default color scheme

### Adding New Features
To add new admin features:

1. Create a new page component in `pages/`
2. Add the route to `AdminApp.jsx`
3. Add navigation item to `AdminLayout.jsx`
4. Create corresponding API endpoints in your backend

### Environment Variables
Set these environment variables in your `.env` file:

```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_ADMIN_TITLE=Your Admin Panel
```

## Security Considerations

1. **Change Default Credentials**: Always change the default admin credentials
2. **HTTPS**: Use HTTPS in production
3. **Token Expiration**: Implement proper token expiration
4. **Rate Limiting**: Add rate limiting to admin endpoints
5. **Input Validation**: Validate all inputs on both frontend and backend

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend allows requests from your frontend domain
2. **Authentication Issues**: Check if the admin token is being sent correctly
3. **API Errors**: Verify that all required backend endpoints are implemented
4. **Styling Issues**: Ensure Tailwind CSS is properly configured

### Debug Mode

Enable debug mode by adding this to your environment:

```env
REACT_APP_DEBUG=true
```

This will show additional console logs for debugging.

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure the backend is running and accessible
4. Check that all required API endpoints are implemented

## License

This admin module is part of the test series platform and follows the same license terms. 