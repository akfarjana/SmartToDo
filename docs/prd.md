**Product Requirements Document (PRD)**

**Project Title:** SmartToDo – A Responsive, Feature-Rich ToDo Application

**Overview:**
SmartToDo is a modern, responsive task management web application designed for individual users. It allows users to efficiently manage their tasks through features such as categorization, due dates, priorities, recurring tasks, and subtasks. The app includes an admin dashboard for oversight and is built with a lightweight, in-memory backend. Deployment is containerized using Docker.

---

### 1. Objectives:

* Provide an intuitive and efficient interface for managing personal tasks.
* Support advanced features like recurring tasks and subtasks.
* Enable task analytics for user productivity insights.
* Maintain a fast, lightweight backend with an in-memory database.
* Ensure a responsive, mobile-friendly UI with light/dark mode options.

---

### 2. Functional Requirements:

**User Features:**

* Sign up, login, logout
* Password reset functionality
* Profile view and edit
* Create/update/delete tasks
* Set due dates and priorities
* Create recurring tasks
* Create subtasks under main tasks
* Mark tasks/subtasks complete/incomplete
* Tag tasks with categories
* Filter and sort tasks
* Toggle between light and dark mode

**Admin Features:**

* View all registered users
* View task completion rates
* Monitor user activity (e.g., last login, active tasks)

---

### 3. Non-Functional Requirements:

* Responsive web design for desktop and mobile
* Fast performance with minimal loading times
* Data persistence during session (in-memory store)
* Secure password storage (hashing)
* JWT-based authentication
* Modular, maintainable codebase
* Containerized deployment using Docker

---

### 4. User Roles:

| Role  | Permissions                                                      |
| ----- | ---------------------------------------------------------------- |
| User  | CRUD on own tasks, profile management, theme toggle              |
| Admin | View all users, monitor usage stats, no CRUD access to user data |

---

### 5. UI Wireframe Descriptions:

**Login Page:**

* Email/password fields
* Forgot password link
* Button to switch theme

**Dashboard:**

* Task list with filters (by tag, priority, status)
* Buttons: Add Task, Add Category
* Toggle view: light/dark
* Sidebar: Profile, Logout

**Task Modal:**

* Input fields: title, description, due date, priority, category
* Recurrence toggle
* Subtask add/remove options

**Admin Dashboard:**

* Table of users (name, email, last login, task count)
* Basic charts showing task completion trends

---

### 6. API Endpoints (RESTful):

**Authentication:**

* `POST /auth/signup` – create account
* `POST /auth/login` – login user
* `POST /auth/reset-password` – reset password

**User:**

* `GET /user/profile` – get user profile
* `PUT /user/profile` – update user profile

**Tasks:**

* `GET /tasks` – get all tasks
* `POST /tasks` – create new task
* `PUT /tasks/:id` – update task
* `DELETE /tasks/:id` – delete task
* `POST /tasks/:id/subtasks` – add subtask
* `PUT /subtasks/:id` – update subtask
* `DELETE /subtasks/:id` – delete subtask

**Admin:**

* `GET /admin/users` – list all users
* `GET /admin/analytics` – return usage stats

---

### 7. Data Schema (In-Memory Example):

**User:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "passwordHash": "hashed",
  "profile": { "name": "User", "theme": "light" },
  "lastLogin": "2025-06-29T12:00:00Z"
}
```

**Task:**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Buy groceries",
  "description": "Milk, Eggs, Bread",
  "dueDate": "2025-07-01T00:00:00Z",
  "priority": "high",
  "completed": false,
  "recurring": "weekly",
  "category": "Personal",
  "subtasks": [
    { "id": "uuid", "title": "Buy milk", "completed": false },
    { "id": "uuid", "title": "Buy eggs", "completed": true }
  ]
}
```

---

### 8. Tech Stack Summary:

* **Frontend:** React.js, Tailwind CSS, Material UI
* **Backend:** Express.js, Node.js
* **Database:** In-memory store (JavaScript Map, lowdb, or similar)
* **Authentication:** JWT tokens, bcrypt for hashing
* **Deployment:** Docker containers for frontend and backend

---

### 9. Milestones and Timeline:

| Phase                  | Duration | Deliverables                       |
| ---------------------- | -------- | ---------------------------------- |
| Project Setup          | 2 days   | Repo setup, Docker setup           |
| Auth System            | 3 days   | Sign up, login, reset              |
| Task CRUD + Subtasks   | 5 days   | Full CRUD, recurring, subtasks     |
| UI and Theme Switcher  | 4 days   | Light/dark mode, responsive layout |
| Admin Dashboard        | 3 days   | Users list, analytics views        |
| Final Testing & Polish | 3 days   | Bug fixes, QA                      |
| Deployment             | 1 day    | Docker build, deployment scripts   |

---

**Total Estimated Time:** \~21 days (1 developer)

---
