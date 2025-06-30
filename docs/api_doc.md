# API Documentation

This document outlines the RESTful API endpoints for the SmartToDo application backend.

## Base URL

The base URL for all API endpoints is not specified in the PRD, but typically would be something like `http://localhost:3000/api/v1` or similar.

## System Endpoints

* `GET /health`
    * **Description:** Check the health status of the API server
    * **Authentication:** None required
    * **Response Body Example (Success):**
        ```json
        {
            "status": "ok",
            "timestamp": "2024-03-21T10:30:45.123Z",
            "uptime": 3600,
            "message": "SmartToDo API is running"
        }
        ```

## Authentication

Authentication is JWT-based. Users must log in to receive a JWT token, which should then be included in the `Authorization` header of subsequent requests (e.g., `Bearer <token>`).

## API Endpoints

### Authentication

*   `POST /auth/signup`
    *   **Description:** Creates a new user account.
    *   **Request Headers:** None
    *   **Request Body Example:**
        ```json
        {
            "email": "user@example.com",
            "password": "securepassword"
        }
        ```
    *   **Response Body Example (Success):**
        ```json
        {
            "message": "User registered successfully",
            "userId": "uuid-of-new-user"
        }
        ```
    *   **Response Body Example (Failure - Email Already Registered):**
        ```json
        {
            "message": "Email already registered"
        }
        ```
    *   **Response Body Example (Failure - Invalid Input):**
        ```json
        {
            "message": "Invalid email or password format"
        }
        ```

*   `POST /auth/login`
    *   **Description:** Authenticates a user and returns a JWT token.
    *   **Request Headers:** None
    *   **Request Body Example:**
        ```json
        {
            "email": "user@example.com",
            "password": "securepassword"
        }
        ```
    *   **Response Body Example (Success):**
        ```json
        {
            "token": "your-jwt-token-here"
        }
        ```
    *   **Response Body Example (Failure - Invalid Credentials):**
        ```json
        {
            "message": "Invalid email or password"
        }
        ```
    *   **Response Body Example (Failure - Invalid Input):**
        ```json
        {
            "message": "Invalid email or password format"
        }
        ```

*   `POST /auth/reset-password`
    *   **Description:** Initiates a password reset process.
    *   **Request Headers:** None
    *   **Request Body Example:**
        ```json
        {
            "email": "user@example.com"
        }
        ```
    *   **Response Body Example (Success):**
        ```json
        {
            "message": "Password reset link sent to email"
        }
        ```
    *   **Response Body Example (Failure - Email Not Found):**
        ```json
        {
            "message": "User with this email not found"
        }
        ```
    *   **Response Body Example (Failure - Invalid Input):**
        ```json
        {
            "message": "Invalid email format"
        }
        ```

### User Endpoints

*   `GET /user/profile`
    *   **Description:** Retrieves the authenticated user's profile information.
    *   **Authentication:** Required
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **Response Body Example (Success):**
        ```json
        {
            "id": "uuid",
            "email": "user@example.com",
            "profile": { "name": "User", "theme": "light" },
            "lastLogin": "2025-06-29T12:00:00Z"
        }
        ```
    *   **Response Body Example (Failure - Unauthorized):**
        ```json
        {
            "message": "Unauthorized"
        }
        ```

*   `PUT /user/profile`
    *   **Description:** Updates the authenticated user's profile information.
    *   **Authentication:** Required
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **Request Body Example:**
        ```json
        {
            "name": "Updated User Name",
            "theme": "dark"
        }
        ```
    *   **Response Body Example (Success):**
        ```json
        {
            "message": "Profile updated successfully"
        }
        ```
    *   **Response Body Example (Failure - Unauthorized):**
        ```json
        {
            "message": "Unauthorized"
        }
        ```
    *   **Response Body Example (Failure - Invalid Input):**
        ```json
        {
            "message": "Invalid profile data provided"
        }
        ```

### Task Endpoints

*   `GET /tasks`
    *   **Description:** Retrieves all tasks for the authenticated user.
    *   **Authentication:** Required
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **Query Parameters (Optional):**
        *   `category` (string): Filter tasks by category.
        *   `priority` (string): Filter tasks by priority (e.g., 'high', 'medium', 'low').
        *   `completed` (boolean): Filter tasks by completion status (`true` or `false`).
        *   `sort_by` (string): Field to sort by (e.g., 'dueDate', 'createdAt', 'priority').
        *   `order` (string): Sort order ('asc' or 'desc').
    *   **Response Body Example (Success):**
        ```json
        [
            {
                "id": "uuid-task1",
                "userId": "uuid-user",
                "title": "Buy groceries",
                "description": "Milk, Eggs, Bread",
                "dueDate": "2025-07-01T00:00:00Z",
                "priority": "high",
                "completed": false,
                "recurring": "weekly",
                "category": "Personal",
                "subtasks": []
            },
            // ... other tasks
        ]
        ```
    *   **Response Body Example (Failure - Unauthorized):**
        ```json
        {
            "message": "Unauthorized"
        }
        ```

*   `POST /tasks`
    *   **Description:** Creates a new task for the authenticated user.
    *   **Authentication:** Required
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **Request Body Example:**
        ```json
        {
            "title": "New Task",
            "description": "Task description",
            "dueDate": "2025-08-01T00:00:00Z",
            "priority": "medium",
            "recurring": "monthly",
            "category": "Work"
        }
        ```
    *   **Response Body Example (Success):**
        ```json
        {
            "message": "Task created successfully",
            "taskId": "uuid-of-new-task"
        }
        ```
    *   **Response Body Example (Failure - Unauthorized):**
        ```json
        {
            "message": "Unauthorized"
        }
        ```
    *   **Response Body Example (Failure - Invalid Input):**
        ```json
        {
            "message": "Invalid task data provided"
        }
        ```

*   `PUT /tasks/:id`
    *   **Description:** Updates an existing task by its ID for the authenticated user.
    *   **Authentication:** Required
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **URL Parameters:** `id` (string) - The ID of the task to update.
    *   **Request Body Example:**
        ```json
        {
            "title": "Updated Task Title",
            "completed": true,
            "priority": "low"
        }
        ```
    *   **Response Body Example (Success):**
        ```json
        {
            "message": "Task updated successfully"
        }
        ```
    *   **Response Body Example (Failure - Unauthorized):**
        ```json
        {
            "message": "Unauthorized"
        }
        ```
    *   **Response Body Example (Failure - Task Not Found):**
        ```json
        {
            "message": "Task not found"
        }
        ```
    *   **Response Body Example (Failure - Invalid Input):**
        ```json
        {
            "message": "Invalid task data provided"
        }
        ```

*   `DELETE /tasks/:id`
    *   **Description:** Deletes a task by its ID for the authenticated user.
    *   **Authentication:** Required
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **URL Parameters:** `id` (string) - The ID of the task to delete.
    *   **Response Body Example (Success):**
        ```json
        {
            "message": "Task deleted successfully"
        }
        ```
    *   **Response Body Example (Failure - Unauthorized):**
        ```json
        {
            "message": "Unauthorized"
        }
        ```
    *   **Response Body Example (Failure - Task Not Found):**
        ```json
        {
            "message": "Task not found"
        }
        ```

*   `POST /tasks/:id/subtasks`
    *   **Description:** Adds a subtask to a specific task for the authenticated user.
    *   **Authentication:** Required
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **URL Parameters:** `id` (string) - The ID of the parent task.
    *   **Request Body Example:**
        ```json
        {
            "title": "New Subtask"
        }
        ```
    *   **Response Body Example (Success):**
        ```json
        {
            "message": "Subtask added successfully",
            "subtaskId": "uuid-of-new-subtask"
        }
        ```
    *   **Response Body Example (Failure - Unauthorized):**
        ```json
        {
            "message": "Unauthorized"
        }
        ```
    *   **Response Body Example (Failure - Task Not Found):**
        ```json
        {
            "message": "Parent task not found"
        }
        ```
    *   **Response Body Example (Failure - Invalid Input):**
        ```json
        {
            "message": "Invalid subtask data provided"
        }
        ```

*   `PUT /subtasks/:id`
    *   **Description:** Updates an existing subtask by its ID for the authenticated user.
    *   **Authentication:** Required
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **URL Parameters:** `id` (string) - The ID of the subtask to update.
    *   **Request Body Example:**
        ```json
        {
            "title": "Updated Subtask Title",
            "completed": true
        }
        ```
    *   **Response Body Example (Success):**
        ```json
        {
            "message": "Subtask updated successfully"
        }
        ```
    *   **Response Body Example (Failure - Unauthorized):**
        ```json
        {
            "message": "Unauthorized"
        }
        ```
    *   **Response Body Example (Failure - Subtask Not Found):**
        ```json
        {
            "message": "Subtask not found"
        }
        ```
    *   **Response Body Example (Failure - Invalid Input):**
        ```json
        {
            "message": "Invalid subtask data provided"
        }
        ```

*   `DELETE /subtasks/:id`
    *   **Description:** Deletes a subtask by its ID for the authenticated user.
    *   **Authentication:** Required
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **URL Parameters:** `id` (string) - The ID of the subtask to delete.
    *   **Response Body Example (Success):**
        ```json
        {
            "message": "Subtask deleted successfully"
        }
        ```
    *   **Response Body Example (Failure - Unauthorized):**
        ```json
        {
            "message": "Unauthorized"
        }
        ```
    *   **Response Body Example (Failure - Subtask Not Found):**
        ```json
        {
            "message": "Subtask not found"
        }
        ```

### Admin Endpoints

*   `GET /admin/users`
    *   **Description:** Retrieves a list of all registered users. (Admin access only)
    *   **Authentication:** Required (Admin Role)
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **Response Body Example (Success):**
        ```json
        [
            {
                "id": "uuid-user1",
                "email": "user1@example.com",
                "profile": { "name": "User One" },
                "lastLogin": "2025-06-28T10:00:00Z",
                "taskCount": 10,
                "completedTaskCount": 7
            },
            // ... other users
        ]
        ```
    *   **Response Body Example (Failure - Unauthorized/Forbidden):**
        ```json
        {
            "message": "Access Forbidden: Admin privileges required"
        }
        ```

*   `GET /admin/users/:id/activity`
    *   **Description:** Retrieves detailed activity for a specific user. (Admin access only)
    *   **Authentication:** Required (Admin Role)
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **URL Parameters:** `id` (string) - The ID of the user to retrieve activity for.
    *   **Response Body Example (Success):**
        ```json
        {
            "userId": "uuid-user1",
            "taskBreakdown": {
                "Work": 15,
                "Personal": 10,
                "Study": 5
            },
            "recentActivity": [
                { "type": "created", "taskId": "uuid-task-new", "timestamp": "2025-07-01T10:00:00Z" },
                { "type": "completed", "taskId": "uuid-task-old", "timestamp": "2025-06-30T15:30:00Z" }
            ],
            "completionPercentage": 0.75
        }
        ```
    *   **Response Body Example (Failure - Unauthorized/Forbidden):**
        ```json
        {
            "message": "Access Forbidden: Admin privileges required"
        }
        ```
    *   **Response Body Example (Failure - User Not Found):**
        ```json
        {
            "message": "User not found"
        }
        ```

*   `GET /admin/analytics`
    *   **Description:** Returns usage statistics and task completion trends. (Admin access only)
    *   **Authentication:** Required (Admin Role)
    *   **Request Headers:** `Authorization: Bearer <token>`
    *   **Response Body Example (Success):**
        ```json
        {
            "totalUsers": 100,
            "totalTasks": 2000,
            "activeTasks": 500,
            "completedTasks": 1500,
            "completionRate": 0.75,
            "taskCompletionTrends": [
                { "date": "2025-06-01", "completed": 20 },
                { "date": "2025-06-02", "completed": 25 }
            ],
            "averageTasksPerUser": 20,
            "mostUsedCategories": ["Personal", "Work"]
        }
        ```
    *   **Response Body Example (Failure - Unauthorized/Forbidden):**
        ```json
        {
            "message": "Access Forbidden: Admin privileges required"
        }
        ``` 