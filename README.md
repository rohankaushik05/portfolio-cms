# Portfolio Website with Custom CMS

A full-stack dynamic portfolio website built with a custom Content Management System (CMS). The system allows portfolio content to be managed through an authenticated admin panel and displayed dynamically on the public portfolio website.

## Project Overview

The project is divided into two repositories:

* **Portfolio CMS** — contains the Admin Panel and Backend API.
* **Portfolio Frontend** — contains the public-facing portfolio website.

The Admin Panel communicates with the Node.js/Express backend through REST APIs. The backend manages portfolio data using MongoDB and handles media storage through Cloudinary.

## Key Features

### Public Portfolio

* Responsive portfolio website
* Home
* About
* Skills
* Projects
* Experience
* Services
* Testimonials
* Blog
* Contact
* Dynamic content from the CMS
* Responsive design
* SEO metadata
* Cloudinary-based image handling

### Custom Admin CMS

* Secure admin login
* JWT-based authentication
* Dashboard
* About management
* Skills management
* Projects management
* Blog management
* Experience management
* Testimonials management
* Services management
* Media management
* Contact message management

All major content modules support CRUD operations where applicable.

## System Architecture

```text
                    ADMIN
                      |
                      v
              React / Vite Admin
                      |
                JWT + REST API
                      |
                      v
              Node.js + Express
                   Backend
                  /       \
                 /         \
                v           v
            MongoDB      Cloudinary
                |
                v
         Dynamic Portfolio Data
                |
                v
          React + Tailwind CSS
          Public Portfolio
                |
                v
              Visitor
```

## Contact Message Flow

The contact system works through the following flow:

```text
Visitor
   |
   v
Contact Form
   |
   v
POST /api/contact
   |
   +-------> MongoDB
   |
   +-------> Resend
                |
                v
        Email Notification
   |
   v
Admin Messages
```

A submitted contact message is validated and stored in MongoDB. An email notification is also sent through Resend, and the message becomes available in the Admin Messages section.

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* Tailwind CSS

### Admin Panel

* React
* Vite
* React Router
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* REST API

### Authentication and Security

* JSON Web Token (JWT)
* bcryptjs
* Helmet
* CORS
* express-rate-limit
* express-validator
* Environment variables

### External Services

* Cloudinary — media storage
* Resend — email delivery
* MongoDB — database
* Vercel — frontend and admin deployment
* Render — backend deployment

## Database

MongoDB is used as the primary database.

The project contains collections/models for:

* Users
* About
* Skills
* Projects
* Experience
* Blogs
* Testimonials
* Services
* Messages
* Media

## Authentication

The Admin Panel uses JWT-based authentication.

The authentication flow is:

```text
Admin Login
     |
     v
POST /api/auth/login
     |
     v
Credential Verification
     |
     v
Password Verification
     |
     v
JWT Access Token
     |
     v
Protected Admin APIs
```

Protected API requests use:

```http
Authorization: Bearer <access-token>
```

Passwords are hashed using bcryptjs.

## API

The backend provides REST APIs for:

* Authentication
* About
* Skills
* Projects
* Experience
* Blogs
* Testimonials
* Services
* Media
* Contact Messages

Detailed endpoint information is available in:

`API_DOCUMENTATION.md`

## Project Structure

### Portfolio CMS Repository

```text
portfolio-project/
|
├── admin/
|   ├── src/
|   |   ├── components/
|   |   ├── pages/
|   |   ├── services/
|   |   ├── App.jsx
|   |   └── main.jsx
|   └── package.json
|
├── backend/
|   ├── src/
|   |   ├── config/
|   |   ├── controllers/
|   |   ├── models/
|   |   ├── routes/
|   |   ├── middleware/
|   |   ├── services/
|   |   ├── app.js
|   |   └── createAdmin.js
|   |
|   ├── server.js
|   └── package.json
|
├── README.md
└── API_DOCUMENTATION.md
```

The public frontend is maintained separately in the `portfolio-frontend` repository.

## Local Setup

### Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file containing the required configuration:

```env
PORT=5000
MONGO_URI=*
JWT_SECRET=*

CLOUDINARY_CLOUD_NAME=*
CLOUDINARY_API_KEY=*
CLOUDINARY_API_SECRET=*

RESEND_API_KEY=*
EMAIL_USER=*
```

Start the development server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Admin Panel

Navigate to the admin directory:

```bash
cd admin
```

Install dependencies:

```bash
npm install
```

Configure the API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

### Public Frontend

The public portfolio is maintained in the separate `portfolio-frontend` repository.

Install dependencies:

```bash
npm install
```

Configure the backend URL:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

## Deployment

### Backend

The backend is deployed using Render.

```text
https://portfolio-cms-backend-sn6f.onrender.com
```

### Admin Panel

The Admin Panel is deployed using Vercel.

```text
https://portfolio-cms-kau-rohan.vercel.app
```

### Public Portfolio

The public portfolio is deployed using Vercel.

```text
https://portfolio-frontend-pink-six.vercel.app
```

## Security

The application implements several security measures:

* JWT authentication
* Password hashing with bcryptjs
* Protected admin routes
* Helmet security headers
* CORS configuration
* Rate limiting
* Request validation
* Environment variables for sensitive configuration
* Protected CMS operations
* Protected media management

## Working Flow

The complete system works as follows:

```text
Admin
  |
  v
Admin Panel
  |
  v
REST API
  |
  v
MongoDB
  |
  v
Portfolio Content
  |
  v
Public Website
  |
  v
Visitor
```

Administrators can update portfolio content through the CMS without directly modifying the frontend source code.

## Future Improvements

Possible future improvements include:

* Custom domain
* Role-based admin access
* Rich text editor
* Website analytics
* Additional media formats
* Automated monitoring
* Automated deployment workflows

## Author

**Rohan Sharma**

B.Tech — Artificial Intelligence

Full Stack / AI Developer
