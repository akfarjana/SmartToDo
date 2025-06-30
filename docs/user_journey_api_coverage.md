# API Coverage of User Journeys

This document details how the SmartToDo API endpoints cover the defined user and admin journeys, as outlined in the `prd.md`, `user_types.md`, `user_journeys/user.md`, `user_journeys/admin.md`, `ui_descriptions/admin_ui.md`, and `ui_descriptions/user_ui.md` documents.

## User Journey Coverage

### 1. Registration & Authentication
*   **Sign Up:** Covered by `POST /auth/signup`
    *   *Details:* Allows new users to create an account by providing an email and password.
*   **Log In:** Covered by `POST /auth/login`
    *   *Details:* Authenticates a user and returns a JWT token for subsequent authenticated requests.
*   **Password Reset:** Covered by `POST /auth/reset-password`
    *   *Details:* Initiates a password reset process, typically by sending a link to the user's email.

### 2. Profile Management
*   **View Profile:** Covered by `GET /user/profile`
    *   *Details:* Retrieves the authenticated user's profile information (ID, email, name, theme, last login).
*   **Edit Profile:** Covered by `PUT /user/profile`
    *   *Details:* Allows the authenticated user to update their profile information (e.g., name, theme).

### 3. Task Management
*   **Create a Task:** Covered by `POST /tasks`
    *   *Details:* Creates a new task with details like title, description, due date, priority, recurring status, and category.
*   **Edit a Task:** Covered by `PUT /tasks/:id`
    *   *Details:* Updates an existing task by its ID, allowing modification of fields like title, completion status, and priority.
*   **Delete a Task:** Covered by `DELETE /tasks/:id`
    *   *Details:* Deletes a specific task by its ID.
*   **Mark Task Complete/Incomplete:** Handled by `PUT /tasks/:id`
    *   *Details:* The `completed` field in the request body of the `PUT /tasks/:id` endpoint allows toggling the completion status of a task.
*   **Subtasks:**
    *   **Add Subtask:** Covered by `POST /tasks/:id/subtasks`
        *   *Details:* Adds a new subtask to a specified parent task.
    *   **Edit Subtask:** Covered by `PUT /subtasks/:id`
        *   *Details:* Updates an existing subtask by its ID, allowing modification of its title and completion status.
    *   **Delete Subtask:** Covered by `DELETE /subtasks/:id`
        *   *Details:* Deletes a specific subtask by its ID.
    *   **Mark Subtask Complete/Incomplete:** Handled by `PUT /subtasks/:id`
        *   *Details:* The `completed` field in the request body of the `PUT /subtasks/:id` endpoint allows toggling the completion status of a subtask.

### 4. Task Organization
*   **Categorization & Tagging:** Handled by `POST /tasks` and `PUT /tasks/:id` (via the `category` field) and by `GET /tasks` (via the `category` query parameter).
    *   *Details:* Tasks can be assigned categories during creation or update. Tasks can be filtered by category when retrieved.
*   **Filtering & Sorting:** Covered by `GET /tasks` query parameters.
    *   *Details:* Tasks can be filtered by `category`, `priority`, and `completed` status. They can also be sorted by `dueDate`, `createdAt`, or `priority` in `asc` or `desc` order.

### 5. Recurring Tasks
*   **Setup:** Handled by `POST /tasks` and `PUT /tasks/:id` (via the `recurring` field).
    *   *Details:* The `recurring` field allows setting the recurrence pattern for a task.

### 6. User Interface & Logout
*   **Theme Toggle / Responsive Experience:** These are UI/frontend concerns and do not have direct API endpoint coverage, as the API focuses on data and logic rather than presentation.
*   **Logout:** While no explicit `/auth/logout` endpoint is present, this is typical for JWT-based authentication where logout is managed by discarding the token on the client side. The API doesn't need a specific endpoint to invalidate a client-side token.

## Admin Journey Coverage

### 1. Admin Login
*   **Login:** Implied to use `POST /auth/login`
    *   *Details:* Admin authentication would use the same login endpoint, with role-based access control managed on the backend after successful authentication.

### 2. Dashboard Overview & View System Analytics
*   **Summary of System Activity & Usage Statistics:** Covered by `GET /admin/analytics`
    *   *Details:* Provides aggregated data such as total users, total tasks, active tasks, completed tasks, completion rate, task completion trends, average tasks per user, and most used categories.

### 3. View Users List & Monitor User Activity
*   **List of All Registered Users:** Covered by `GET /admin/users`
    *   *Details:* Retrieves a list of all registered users with details like ID, email, profile name, last login, task count, and completed task count.
*   **Detailed Activity for a Specific User:** Covered by `GET /admin/users/:id/activity`
    *   *Details:* Provides a breakdown of tasks by category, recent activity timeline, and completion percentage for a given user.

### 4. Admin Logout
*   **Logout:** Similar to user logout, this is typically a client-side operation where the admin's JWT token is discarded. No specific API endpoint is required for this action.

## Constraints Adherence

The API documentation adheres to the admin constraints mentioned in the PRD and admin user journey:
*   Admin endpoints (`/admin/users`, `/admin/users/:id/activity`, `/admin/analytics`) are all `GET` requests, ensuring that admins have **no ability to edit or delete any user's tasks or modify user profile information**. They are purely for monitoring and oversight. 