# Conceptual Image Descriptions – Admin User Journey

---

## 1. Admin Login

**Image Description**:  
A centered login card floats on a soft, blurred background in either light or dark mode.  
- The card has a white or dark-gray background with rounded corners and a slight shadow.  
- At the top is a bold title: “Admin Login” with a lock icon.  
- Two input fields are stacked vertically: one for email, one for password. Both have icons (email & password lock).  
- Below the fields is a “Login” button in the primary color (e.g., blue for light mode, teal for dark).  
- An error message (“Invalid credentials”) is shown inline in red under the button if login fails.  
- At the bottom, a theme toggle (moon/sun icon) floats to the bottom-right corner of the screen.

---

## 2. Dashboard Overview

**Image Description**:  
The admin dashboard displays a clean, grid-based overview with KPI cards and charts.  
- The top bar includes the app logo on the left, “Admin Dashboard” title in the center, and a circular avatar with dropdown for logout on the right.  
- Below the top bar are **4 horizontal stat cards**:
  - Total Users
  - Total Tasks Created
  - Tasks Completed
  - Active Users (last 7 days)  
  Each card has an icon, large number, and small caption text.  

- Below the stat cards is a **dual-panel layout**:
  - **Left panel:** Bar chart showing tasks created vs completed over the past 30 days.
  - **Right panel:** Line chart showing active users per day (time series graph).

- All cards have rounded corners, hover elevation, and soft colors based on theme.

---

## 3. View Users List

**Image Description**:  
A paginated table of users is displayed on a clean admin page.  
- Table header includes column titles:
  - User ID (truncated)
  - Name
  - Email
  - Last Login (timestamp)
  - Tasks Created
  - Tasks Completed

- Each row is clickable, showing hover highlight. On click, a drawer or modal opens with more details (see next step).  
- Top-right has a search bar with a filter icon:
  - Filters include: last login range, tasks created threshold, email domain.  

- Footer of the table includes pagination controls and a “Rows per page” dropdown.  
- Sticky header stays in place when scrolling down.

---

## 4. Monitor User Activity (User Detail View)

**Image Description**:  
A side drawer or modal opens over the users table, showing detailed user metrics.  
- Top section: User info summary with avatar, name, email, join date, and last login.  
- Middle section: Grid of cards:
  - Total Tasks Created
  - Completed Tasks
  - Overdue Tasks
  - Recurring Tasks Used  

- Below that, two tabs:
  - **Activity Timeline Tab**:
    - Scrollable vertical timeline: “Created task ‘X’ on June 10”, “Marked task ‘Y’ complete”
    - Icons represent task actions, colored by type (create, complete, edit)

  - **Task Stats Tab**:
    - Pie chart of task statuses (completed, pending, overdue)
    - Bar chart: categories or tags used most frequently

- Close button at top right. Transitions with smooth slide animation.

---

## 5. View System Analytics

**Image Description**:  
A clean analytics dashboard showing global system trends.  
- Hero section with dropdown filters:
  - Time range selector (e.g., last 7 / 30 / 90 days)
  - Filter by user group or task tag (if extended later)

- **Visual Panels** (responsive grid layout):
  - Line chart: Daily task creation trend
  - Area chart: Daily task completion rate (cumulative %)
  - Bar chart: Average tasks per user per week
  - Donut chart: Most used tags (top 5 with color legends)

- Charts use tooltips, legends, and responsive resizing.
- Hovering over a chart element shows exact values and dates.

---

## 6. Admin Logout

**Image Description**:  
Top-right dropdown is clicked on the circular avatar in the header.  
- A dropdown menu appears with:
  - “View Profile” (optional)
  - **“Logout”** in red or primary warning color  
- On click:
  - Modal appears: “Are you sure you want to log out?” with Confirm and Cancel
  - On confirmation, the admin is redirected to the login screen
  - Session tokens cleared, light logout animation shows transition to login

---

## Constraints Visualization

**Image Description**:  
A shaded info panel or tooltip appears next to disabled or restricted actions.  
- If admin attempts to click on a user’s task (e.g., from analytics), a tooltip appears:  
  “Admins cannot view or edit user tasks directly.”  
- The UI clearly distinguishes admin-read-only views from user-editable areas by graying out certain UI controls or showing lock icons.

---
