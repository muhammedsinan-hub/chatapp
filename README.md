💬 Real-Time Chat Application
A full-stack, responsive real-time chat application built with the MERN stack, featuring secure authentication, instant messaging, and media sharing. This project focuses on high performance and a seamless user experience across all devices.

🚀 Key Features
Real-time Messaging: Integrated with Socket.io for instantaneous message delivery and online status tracking.

Secure Authentication: Robust user authentication system using JSON Web Tokens (JWT) and bcrypt for password hashing.

Media Sharing: Effortless image uploads and profile management powered by Cloudinary.

Context-Driven State Management: Efficient global state handling using the React Context API.

Responsive UI/UX: A modern, dark-themed interface crafted with Tailwind CSS, optimized for mobile, tablet, and desktop screens.

Protection & Security: Protected routes and secure API endpoints to ensure user data privacy.

__________________________________________________________________________________________________________________________________



Layer                        |                Technologies Used
___________________________________________________________________________________________
Frontend                     |   React.js, Tailwind CSS, Lucide React (Icons), React Router
Backend                      |   Node.js, Express.js"
Database                     |   MongoDB (Mongoose ODM)
Real-time                    |   Socket.io
Storage                      |   Cloudinary API
Deployment                   |   Vercel


__________________________________________________________________________________________________________________________________


🏗️ Project Structure
The project follows a clean separation of concerns:

Client: Contains the React frontend, components, and context providers.

Server: Contains the Node/Express backend, database models, controllers, and Socket.io logic.

⚙️ Implementation Details
I implemented this project by focusing on a scalable architecture. The backend manages a RESTful API for authentication and message history, while WebSockets handle live events. I used Tailwind CSS to ensure the UI remains fluid, specifically handling complex layouts like the triple-container view for larger screens and a streamlined single-view for mobile users.