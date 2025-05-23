# 🌿 Simple Forum System (WeChat/Douban Style)

A lightweight full-stack forum web app with registration, login, posting, liking, and real-time display of who liked each post. Styled after WeChat/Douban with a clean, modern UI.

## 🛠 Tech Stack

- **Frontend**: React, React Router, Fetch API, React Toastify
- **Backend**: Koa.js, Sequelize ORM, AWS RDS
- **Authentication**: Secure JWT-based authentication using HttpOnly cookies
- **Style**: Plain CSS, emoji icons, responsive layout

## 📦 Features

- 📝 User registration with password rules (min 8 chars, upper/lower/digits/symbol)
- 🔐 Login with bcrypt password check
- 🧑 View all users
- 💬 Post messages and comments
- ❤️ Like/unlike posts
- 👥 See who liked a post
- 🪶 Clean WeChat/Douban-style UI

## 📁 File Structure

```
.
├── koa-backend
│   ├── models
│   │   ├── user.js
│   │   ├── post.js
│   │   ├── like.js
|   |   |── comment.js
│   ├── routes
│   │   ├── user.js
│   │   ├── post.js
│   │   ├── ……
│   ├── db.js
│   ├── server.js
├── react-frontend
│   ├── src
│   │   ├── App.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ForumDashboard.jsx
│   │   ├── ……
│   │   ├── forum.css
```

## 🚀 Setup Instructions

### Backend (Koa + AWS RDS)

```bash
cd koa-backend
npm install
```

> Backend runs at `http://localhost:3001`

### Frontend (React)

```bash
cd react-frontend
npm install
npm run dev
```

> Frontend runs at `http://localhost:3000`. However, the program should fail because sensitive contents like AWS credentials are not uploaded to github.

## 🧪 Default Behaviors

- Logged-in user is authenticated via HttpOnly JWT cookie (`/me` endpoint used to fetch identity)
- CORS enabled between ports 3000 and 3001
- Posts are ordered by most recent first
- Likes are tracked in a separate `likes` table

## 🔮 Future Ideas

- JWT-based authentication✅
- Commenting on posts✅
- User profile pages✅
- Image/Avatar uploads✅
- Pagination
- Deploy the backend to [Render](https://render.com/)
- Replace Sqlite with PostgreSQL✅

---

Made with 💚 by Ricky