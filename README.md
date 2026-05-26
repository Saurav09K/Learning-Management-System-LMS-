# L-M-S

A full-stack Learning Management System built with the MERN stack. The app supports student and instructor workflows, including authentication, course browsing, course creation, curriculum management, enrollments, video uploads, and Razorpay payments.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Redis
- JWT authentication
- bcrypt password hashing
- Cloudinary uploads
- Razorpay payment integration

## Features

- User registration and login
- Role-based access for students and instructors
- JWT access token flow with refresh token support
- Course catalog and course details pages
- Instructor dashboard
- Course creation and editing
- Curriculum builder with modules and lessons
- Cloudinary-based media uploads
- Student enrollment and my-learning view
- Course player for enrolled students
- Razorpay order creation and payment verification
- Docker setup for frontend and backend services

## Project Structure

```text
L-M-S/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
    server.js
    package.json
    Dockerfile
  frontend/
    src/
      api/
      components/
      context/
      lib/
      pages/
    package.json
    Dockerfile
  docker-compose.yml
```

## Prerequisites

- Node.js 22 or later
- npm
- MongoDB database
- Redis instance
- Cloudinary account
- Razorpay account
- Docker and Docker Compose, optional

## Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
JWT_SECRET=your_jwt_secret
COOKIE_SECURE=false
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Create a `.env` file inside `frontend/`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Running Locally

Start the backend:

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Running With Docker

From the project root, run:

```bash
docker compose up --build
```

This starts:

- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`

Make sure the `backend/.env` and `frontend/.env` files exist before starting Docker Compose.

## Available Scripts

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## API Overview

The backend exposes these route groups:

- `POST /api/auth` - authentication routes
- `/api/courses` - course management and catalog routes
- `/api/enrollments` - enrollment routes
- `/api/cloudinary` - upload/signature routes
- `/api/payments` - Razorpay payment routes

## Notes

- The frontend API client currently targets `http://localhost:5000/api`.
- Cookies and credentials are enabled for authentication requests.
- Set `COOKIE_SECURE=true` and configure production domains when deploying.
- Keep all secret keys out of version control.

## License

This project is licensed under the ISC License.
