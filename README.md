# CompanyGrow

CompanyGrow is a smart workforce development platform that enables organizations to nurture employee growth through tailored training, intelligent project allocation, and real-time performance rewards. It matches employees to projects based on skills, tracks training progress, and rewards achievements with badge-based bonuses. With live analytics and a skill-driven ecosystem, it keeps teams engaged, productive, and continuously evolving.

## Features

- **User Authentication:** Signup, login, logout, and role-based access (admin/employee).
- **Admin Dashboard:** Manage employees, assign projects, manage courses, approve/reject enrollment and project completion requests, and view analytics.
- **Employee Dashboard:** View assigned/completed projects, enrolled courses, skill progress, and request project completion or course enrollment.
- **Course Management:** Admins can add, edit, and view courses with milestones, media, level, and duration.
- **Project Management:** Admins can add, edit, assign, and rate projects. Employees can view and update their project progress.
- **Analytics:** Visualize real-time performance analytics for employees and the organization (monthly completions, rewards, etc.).
- **Profile Management:** Employees can edit their profile, skills, experience, and profile image.
- **Reward System:** Employees earn rewards (badges, tokens, USD) for completing projects and courses.
- **Skill Matching:** Projects are intelligently matched to employees based on their skills.
- **Live Progress Tracking:** Track training and project progress in real time.
- **Responsive UI:** Clean, modern interface with sticky navigation and profile access.

## Tech Stack

- **Frontend:** React, React Router, Chart.js, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT (stored in HTTP-only cookies)
- **Styling:** CSS

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rohanshr135/Company_Grow.git
   cd Company_Grow
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file with your MongoDB URI and any other secrets
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the app:**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Create a `.env` file in the `backend` directory with at least:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

## Folder Structure

```
Company_Grow/
  backend/
    controllers/
    models/
    routes/
    middleware/
    db/
    server.js
    ...
  frontend/
    src/
      components/
      pages/
      contexts/
      App.jsx
      index.css
      ...
```

## Usage

- The first user to sign up becomes an **admin**.
- Admins can manage courses, projects, users, and view analytics.
- Employees can enroll in courses, view and update project progress, and track their rewards.
- All users can edit their profile and logout from the profile page.

## API Endpoints

- `/api/auth/*` - Authentication (signup, login, logout, getMe)
- `/api/user/*` - Employee actions (profile, enrollments, progress)
- `/api/admin/*` - Admin actions (users, projects, courses, requests)
- `/api/courses/*` - Course management
- `/api/projects/*` - Project management
- `/api/analytics/*` - Analytics data

## Customization

- Update styles in `frontend/src/index.css` and `frontend/src/App.css`.
- Add more fields or features as needed in the Mongoose models and React components.

**
