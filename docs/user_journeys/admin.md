# Admin User Journey

## 1. Admin Login
- Navigate to the Admin Login page
- Enter admin credentials (email and password)
- Submit login form
- On success, redirected to the Admin Dashboard
- On failure, display error message (e.g., invalid credentials)

## 2. Dashboard Overview
- View a summary of system activity:
  - Total number of users
  - Total number of tasks created
  - Task completion rate (e.g., % completed vs total)
  - Number of active users (based on last login)
- Access visual charts showing task trends over time (e.g., bar/line charts)

## 3. View Users List
- Navigate to "Users" section of the dashboard
- Display table of all registered users:
  - User ID
  - Name
  - Email
  - Last login date/time
  - Total number of tasks created
  - Number of tasks completed
- Optional: search or filter users by email, name, or activity status

## 4. Monitor User Activity
- Click on a user row to expand or view detailed activity:
  - Breakdown of tasks by category/tag
  - Recent activity timeline (e.g., created/updated tasks)
  - Percentage of completed vs pending tasks
- Visualizations:
  - Pie chart or bar graph of task status distribution
  - Recurrence patterns (e.g., how often they use recurring tasks)

## 5. View System Analytics
- Navigate to the "Analytics" or "Reports" section
- View system-wide statistics:
  - Tasks created over time (weekly/monthly trend)
  - Task completion rate trend
  - Average tasks per user
  - Most commonly used categories/tags
- Export option (e.g., CSV, PDF) for reports

## 6. Admin Logout
- Click "Logout" in dashboard header
- Session is cleared
- Redirected to Admin Login page

## Constraints
- Admin cannot:
  - Edit or delete any user's tasks
  - Modify user profile information
  - Create tasks or interact with the main user-facing task UI
