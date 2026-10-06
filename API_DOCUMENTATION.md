# API Documentation

## Portfolio CMS REST API

The Portfolio CMS backend is built with Node.js, Express.js and MongoDB. It provides REST APIs for authentication, portfolio content management, media handling and contact messages.

## Base URL

### Local

```text
http://localhost:5000/api
```

### Production

```text
https://portfolio-cms-backend-sn6f.onrender.com/api
```

---

# 1. Authentication

## Login

### Endpoint

```http
POST /auth/login
```

### Description

Authenticates an administrator and returns access and refresh tokens.

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "*"
}
```

### Response

```json
{
  "message": "Login successful",
  "accessToken": "<access-token>",
  "refreshToken": "<refresh-token>"
}
```

### Authentication

Public endpoint.

---

## Refresh Token

### Endpoint

```http
POST /auth/refresh
```

### Description

Generates a new access token using a valid refresh token.

### Request Body

```json
{
  "refreshToken": "<refresh-token>"
}
```

### Authentication

Requires a valid refresh token.

---

# 2. About

## Get About Information

```http
GET /about
```

Returns the portfolio About information.

### Authentication

Public.

---

## Update About Information

```http
PUT /about
```

Updates the portfolio About information.

### Authentication

Protected.

### Example Request

```json
{
  "title": "About Me",
  "bio": "AI and Full Stack Developer",
  "profileImage": "https://example.com/profile.jpg",
  "resumeUrl": "https://example.com/resume.pdf",
  "location": "Ghaziabad, India"
}
```

---

# 3. Skills

## Get Skills

```http
GET /skills
```

Returns the skills available in the portfolio.

### Authentication

Public.

---

## Create Skill

```http
POST /skills
```

### Authentication

Protected.

### Example Request

```json
{
  "name": "React",
  "category": "Frontend",
  "level": 85,
  "icon": "react",
  "order": 1
}
```

---

## Update Skill

```http
PUT /skills/:id
```

### Authentication

Protected.

---

## Delete Skill

```http
DELETE /skills/:id
```

### Authentication

Protected.

---

# 4. Projects

## Get Projects

```http
GET /projects
```

Returns portfolio projects.

### Authentication

Public.

---

## Create Project

```http
POST /projects
```

### Authentication

Protected.

### Example Request

```json
{
  "title": "Text to Speech App",
  "description": "A web application for text-to-speech conversion.",
  "technologies": [
    "React",
    "Node.js",
    "Express",
    "MongoDB"
  ],
  "image": "https://example.com/project.jpg",
  "githubUrl": "https://github.com/example/project",
  "liveUrl": "https://example.com",
  "featured": true,
  "order": 1
}
```

---

## Update Project

```http
PUT /projects/:id
```

### Authentication

Protected.

---

## Delete Project

```http
DELETE /projects/:id
```

### Authentication

Protected.

---

# 5. Experience

## Get Experience

```http
GET /experience
```

Returns professional experience information.

### Authentication

Public.

---

## Create Experience

```http
POST /experience
```

### Authentication

Protected.

### Example Request

```json
{
  "company": "Company Name",
  "role": "Full Stack Intern",
  "description": "Worked on full-stack application development.",
  "startDate": "2026-01-01",
  "endDate": "2026-03-01",
  "location": "India",
  "technologies": [
    "React",
    "Node.js",
    "MongoDB"
  ],
  "order": 1
}
```

---

## Update Experience

```http
PUT /experience/:id
```

### Authentication

Protected.

---

## Delete Experience

```http
DELETE /experience/:id
```

### Authentication

Protected.

---

# 6. Blogs

## Get Blogs

```http
GET /blogs
```

Returns blog posts.

### Authentication

Public.

---

## Create Blog

```http
POST /blogs
```

### Authentication

Protected.

### Example Request

```json
{
  "title": "Getting Started with React",
  "slug": "getting-started-with-react",
  "excerpt": "Introduction to React development.",
  "content": "Blog content goes here.",
  "coverImage": "https://example.com/blog.jpg",
  "tags": [
    "React",
    "JavaScript"
  ],
  "published": true,
  "publishedAt": "2026-01-01",
  "order": 1
}
```

---

## Update Blog

```http
PUT /blogs/:id
```

### Authentication

Protected.

---

## Delete Blog

```http
DELETE /blogs/:id
```

### Authentication

Protected.

---

# 7. Testimonials

## Get Testimonials

```http
GET /testimonials
```

Returns testimonials.

### Authentication

Public.

---

## Create Testimonial

```http
POST /testimonials
```

### Authentication

Protected.

---

## Update Testimonial

```http
PUT /testimonials/:id
```

### Authentication

Protected.

---

## Delete Testimonial

```http
DELETE /testimonials/:id
```

### Authentication

Protected.

---

# 8. Services

## Get Services

```http
GET /services
```

Returns portfolio services.

### Authentication

Public.

---

## Create Service

```http
POST /services
```

### Authentication

Protected.

---

## Update Service

```http
PUT /services/:id
```

### Authentication

Protected.

---

## Delete Service

```http
DELETE /services/:id
```

### Authentication

Protected.

---

# 9. Media

## Upload Media

### Endpoint

```http
POST /upload
```

### Description

Uploads media through the backend and stores the uploaded media using Cloudinary.

### Authentication

Protected.

### Request

The request uses `multipart/form-data`.

```text
file: <image-file>
```

### Response

Returns information about the uploaded media and its Cloudinary URL.

---

## Get Media

```http
GET /media
```

Returns uploaded media.

### Authentication

Protected.

---

## Delete Media

```http
DELETE /media/:id
```

Deletes media information.

### Authentication

Protected.

---

# 10. Contact

## Submit Contact Message

### Endpoint

```http
POST /contact
```

### Description

Allows visitors to send messages through the public portfolio contact form.

The backend:

1. Validates the submitted information.
2. Stores the message in MongoDB.
3. Sends an email notification through Resend.
4. Makes the message available in the Admin Messages section.

### Authentication

Public.

### Example Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I would like to discuss a project."
}
```

---

## Get Contact Messages

```http
GET /contact
```

Returns contact messages for the administrator.

### Authentication

Protected.

---

## Get Single Contact Message

```http
GET /contact/:id
```

Returns a specific contact message.

### Authentication

Protected.

---

## Update Contact Message

```http
PUT /contact/:id
```

Updates contact message information, including its read status.

### Authentication

Protected.

---

## Delete Contact Message

```http
DELETE /contact/:id
```

Deletes a contact message.

### Authentication

Protected.

---

# 11. Authorization

Protected endpoints require a valid JWT access token.

### Request Header

```http
Authorization: Bearer <access-token>
```

Example:

```text
Authorization: Bearer <access-token>
```

Requests without valid authorization are rejected by the authentication middleware.

---

# 12. HTTP Methods

| Method | Purpose               |
| ------ | --------------------- |
| GET    | Retrieve data         |
| POST   | Create or submit data |
| PUT    | Update existing data  |
| DELETE | Delete data           |

---

# 13. API Access Levels

| Module         | Public          | Protected           |
| -------------- | --------------- | ------------------- |
| Authentication | Login / Refresh | —                   |
| About          | GET             | PUT                 |
| Skills         | GET             | POST / PUT / DELETE |
| Projects       | GET             | POST / PUT / DELETE |
| Experience     | GET             | POST / PUT / DELETE |
| Blogs          | GET             | POST / PUT / DELETE |
| Testimonials   | GET             | POST / PUT / DELETE |
| Services       | GET             | POST / PUT / DELETE |
| Media          | —               | GET / POST / DELETE |
| Contact        | POST            | GET / PUT / DELETE  |

---

# 14. Security

The API uses the following security mechanisms:

* JWT authentication
* bcryptjs password hashing
* Protected admin routes
* Helmet security headers
* CORS configuration
* Rate limiting
* Request validation
* Environment variables for sensitive configuration

---

# 15. Health Check

### Endpoint

```http
GET /health
```

### Full URL

```text
https://portfolio-cms-backend-sn6f.onrender.com/api/health
```

### Response

```json
{
  "message": "Backend is working"
}
```

---

# 16. Production API

Production backend:

```text
https://portfolio-cms-backend-sn6f.onrender.com
```

Production API base:

```text
https://portfolio-cms-backend-sn6f.onrender.com/api
```

---

# 17. API Summary

| Module       | GET |            POST | PUT | DELETE |
| ------------ | --: | --------------: | --: | -----: |
| Auth         |   — | Login / Refresh |   — |      — |
| About        |   ✓ |               — |   ✓ |      — |
| Skills       |   ✓ |               ✓ |   ✓ |      ✓ |
| Projects     |   ✓ |               ✓ |   ✓ |      ✓ |
| Experience   |   ✓ |               ✓ |   ✓ |      ✓ |
| Blogs        |   ✓ |               ✓ |   ✓ |      ✓ |
| Testimonials |   ✓ |               ✓ |   ✓ |      ✓ |
| Services     |   ✓ |               ✓ |   ✓ |      ✓ |
| Media        |   ✓ |               ✓ |   — |      ✓ |
| Contact      |   ✓ |               ✓ |   ✓ |      ✓ |
