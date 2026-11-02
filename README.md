# TaskFlow – Task Management Application

A full-stack task management application built with **Next.js, React, Redux Toolkit, Node.js, Express, and MongoDB**.

TaskFlow helps users organize their daily work, manage deadlines, track task progress, and stay productive through a clean and responsive interface.

## Repositories

- **Frontend:** [task_manager_web](https://github.com/Saif79855/task_manager_web)
- **Backend:** [task_manager](https://github.com/Saif79855/task_manager)

## Features

- User registration and login
- Protected dashboard and authentication flow
- Create, edit, and delete tasks
- Mark tasks as completed or pending
- Search tasks by title and description
- Filter tasks by All, Pending, and Completed
- Kanban-style task organization
- Task deadlines and overdue detection
- Dashboard task statistics
- Task sorting by date, title, and deadline
- Dark and light theme
- Responsive user interface
- Toast notifications and form validation

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Redux Toolkit
- React Redux
- Axios
- Next Themes
- Lucide React
- Sonner

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- Sharp
- SendGrid

## Getting Started

### 1. Clone the frontend repository

```bash
git clone https://github.com/Saif79855/task_manager_web.git
cd task_manager_web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend API URL

Configure the backend API base URL in:

```text
src/lib/axios.js
```

Make sure the backend server is running and the frontend is pointing to the correct API URL.

### 4. Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Setup

The backend is maintained in a separate repository.

### 1. Clone the backend repository

```bash
git clone https://github.com/Saif79855/task_manager.git
cd task_manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create the required development environment configuration at:

```text
config/dev.env
```

Configure the required MongoDB connection, JWT, and other application credentials.

### 4. Start the backend

```bash
npm run dev
```

## Project Structure

```text
src/
├── app/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── auth/
│   ├── layout/
│   └── tasks/
├── features/
│   ├── auth/
│   └── tasks/
├── lib/
├── providers/
└── store/
```

## Author

**Saif**

GitHub: [@Saif79855](https://github.com/Saif79855)