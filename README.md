# 💬 ChatEase – Real-Time Chat Application

ChatEase is a full-stack real-time messaging application that allows users to connect, communicate, and share messages seamlessly. It provides secure authentication, real-time messaging, online status tracking, and image sharing.

## 🚀 Features

- **User Authentication:** Secure user registration and login using JWT authentication.
- **Real-Time Messaging:** Send and receive messages instantly using Socket.IO.
- **Online/Offline Status:** View users' real-time online availability.
- **Image Sharing:** Share images with other users.
- **User Search:** Search for registered users to start conversations.
- **Unseen Messages:** Track unread messages for each conversation.
- **Profile Management:** View and update user profile information.
- **Responsive UI:** Clean and responsive interface built with React and Tailwind CSS.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- React Router
- Axios
- Context API

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- Cloudinary

## 📂 Project Structure
```text
ChatEase/
│
├── client/
│   | 
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository


git clone YOUR_GITHUB_REPOSITORY_URL
cd ChatEase


### 2. Install frontend dependencies


cd client
npm install


### 3. Install backend dependencies


cd server
npm install


### 4. Configure environment variables

Create a `.env` file inside the server directory.


MONGODB_URI=mongodb+srv://kumarisangita8800_db_user:bhuEvWmnjmkGQI6K@cluster0.era43kj.mongodb.net

PORT= 5000

JWT_SECRET=sangita123secret

CLOUDINARY_CLOUD_NAME= dnkmy3x5
CLOUDINARY_API_KEY= 954237348225771
CLOUDINARY_API_SECRET= rw-wHJ6JsfADoiOBPYfg1P1IZHk


### 5. Run the application

Start the backend:


cd server
npm run server

Start the frontend in another terminal:


cd client
npm run dev

## 🔄 Application Workflow

1. Users register or log in to their accounts.
2. Authenticated users can search for other registered users.
3. Users can select a person and start a conversation.
4. Messages are exchanged instantly using Socket.IO.
5. Online status and unseen message counts are updated dynamically.
6. Users can also share images in conversations.

## 🔐 Security

- JWT-based authentication.
- Protected backend routes.
- Password hashing.
- Environment variables for sensitive credentials.

## 📸 Screenshots

Add screenshots of your application here.

## 👨‍💻 Author

**Your Name**

- GitHub: [Your GitHub Profile](YOUR_GITHUB_PROFILE_URL)
- LinkedIn: [Your LinkedIn Profile](YOUR_LINKEDIN_PROFILE_URL)

---

⭐ If you like this project, consider giving it a star!
