# Conceptual Image Descriptions – User Journey

---

## 1. Sign Up

**Image Description**:  
A full-height centered form over a background gradient or subtle illustration.  
- The form card has a Material UI look: rounded corners, soft elevation, and padding.  
- Fields include:
  - Name (with person icon)
  - Email (with mail icon)
  - Password (with eye toggle for visibility)
- Below fields: a full-width “Sign Up” button in the primary accent color (e.g., blue).
- A link below: “Already have an account? Log In”
- Theme toggle icon in the top-right of the screen.
- On smaller screens, the form adjusts to full width with stacked spacing.

---

## 2. Log In

**Image Description**:  
Nearly identical in layout to the Sign-Up screen.  
- Two fields: email and password.  
- “Forgot password?” link appears below the password field.  
- “Login” button has clear visual focus.  
- On error, an inline red helper text appears: “Invalid email or password.”  
- Background dims subtly during transitions to enhance UX.

---

## 3. Forgot Password

**Image Description**:  
- A simple form with one field: “Enter your email to reset password.”  
- Button: “Send Reset Link.”  
- On submit: a success banner appears saying, “Check your inbox for a reset link.”  
- If the email isn't found, an error banner appears.  
- Design keeps all elements center-aligned with subtle success/error states.

---

## 4. View Profile

**Image Description**:  
A personal info page with user details in a vertically stacked layout.  
- Card with user avatar, name, and email.  
- Under that:
  - Current theme (light/dark)
  - Option to toggle theme instantly
- Edit buttons beside each field, pencil icon in corner  
- Responsive layout with collapsible sections on mobile view

---

## 5. Edit Profile

**Image Description**:  
- On clicking “Edit,” the fields become input-enabled.  
- Theme toggle becomes a switch: “Light / Dark”  
- Save and Cancel buttons appear at the bottom  
- Snackbar appears at bottom left/right upon success: “Profile updated successfully.”

---

## 6. Create Task

**Image Description**:  
A floating “+ Add Task” button at the bottom-right corner (FAB – Floating Action Button).  
- Clicking opens a modal with:
  - Title (text field)
  - Description (multi-line field)
  - Due Date (calendar picker)
  - Priority (dropdown with colors: low/med/high)
  - Tags (chips with add/remove)
  - Recurring checkbox with interval select
  - Subtasks section:
    - Add subtask (input + “+” icon)
    - List of existing subtasks with delete icons  
- Submit button saves task; modal closes with animation

---

## 7. View Tasks (Dashboard)

**Image Description**:  
Main dashboard view with a two-panel layout:  
- **Left Sidebar**:
  - Profile icon
  - Navigation links (Tasks, Categories, Logout)
  - Theme toggle
- **Main Panel**:
  - Search bar at top
  - Filter and Sort controls (dropdowns or icons for priority, tag, status)
  - Task List displayed as vertical cards:
    - Each card shows:
      - Title, priority badge, due date
      - Progress (subtask count)
      - Tags as colored chips
    - Checkboxes to mark complete
    - Edit & delete icons on hover
- Responsive behavior: sidebar collapses on mobile, cards become full-width

---

## 8. Edit / Delete Task

**Image Description**:  
- Edit: Clicking pencil icon opens same modal as “Add Task,” pre-filled with task data  
- Delete: Clicking trash icon shows a confirmation dialog  
- Deleted tasks animate out of the list on confirmation

---

## 9. Manage Subtasks

**Image Description**:  
Inside a task card or modal, a subtasks list appears:  
- Each subtask has:
  - Checkbox to mark as complete
  - Text label
  - Small trash icon on the right to remove  
- Subtasks animate in/out with addition/removal  
- Completed subtasks use strikethrough and muted color

---

## 10. Filter & Sort Tasks

**Image Description**:  
Above the task list, horizontal bar of controls:  
- Filter by:
  - Tag (dropdown with multi-select chips)
  - Status (All, Completed, Pending)
  - Priority (color-coded)
- Sort by:
  - Due Date (ASC/DESC)
  - Priority
  - Recently Modified  
- Each selection animates into a pill chip or badge  
- Clear all filters button appears when filters are active

---

## 11. Theme Toggle

**Image Description**:  
A small switch toggle or sun/moon icon in the header or profile.  
- Toggling updates the app’s theme instantly:
  - Light: white cards, gray text, blue accents
  - Dark: dark gray background, white text, teal or purple accents
- The setting persists in user profile and applies on login

---

## 12. Responsive UI

**Image Description**:  
Tablet view:
- Sidebar collapses into icons only
- Task cards adjust to 2-column grid

Mobile view:
- Hamburger menu for navigation
- Task cards become stacked full-width
- Modal fills entire screen on mobile when creating/editing tasks
- Filters shown in collapsible drawer or popover

---

## 13. Logout

**Image Description**:  
Clicking “Logout” from sidebar opens a confirmation dialog:  
- “Are you sure you want to logout?” with Confirm and Cancel  
- Confirm logs user out, clears session, and redirects to login page  
- Logout animation subtly fades out current view

