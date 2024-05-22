# Internship Management System - OCP

## Introduction

This project is a web application designed to manage internships for the Office Chérifien des Phosphates (OCP). It facilitates the management of interns, assigned tasks, and document sharing between interns and their supervisors. The application is built using the MERN stack (MongoDB, Express, React, Node.js) with Socket.io for real-time communication and Firebase for file storage.

## Project Structure

- **Client**: Frontend of the application, developed in React.js.
- **Server**: Backend of the application, built with Node.js and Express.js.
- **Socket**: Manages real-time communication with Socket.io.

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB
- Firebase

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/anasinfo1/Interns-management-ocp.git
    cd yourproject
    ```

2. Install dependencies for the client, server, and socket:

    ```bash
    cd Client
    npm install
    cd ../Server
    npm install
    cd ../Socket
    npm install
    ```

## Configuration

### Client

In the `Client` directory, create a `.env` file and add the following environment variables:

```env
REACT_APP_BASE_URL=http://localhost:5001
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_MEASUREMENT_ID=your_measurement_id
REACT_APP_SOCKET_URL=socket_server_url
```

### Socket

In the `Socket` directory, create a `.env` file and add the following environment variable:

```env
SOCKET_PORT=your_socket_port
CLIENT_BASE_URL=react_app_url
```

### Server

In the `Server` directory, create a `config.env` file and add the following environment variables:

```env
DATABASE_URL=your_mongodb_connection_url
MY_SECRET=random_password_for_jwt_token
PORT=server_port_number
```

## Running the Application

1. Start the backend server:
```
cd Server
npm start
```

2. Start the Socket.io server:
```
cd Socket
npm start
```


3. Start the frontend client:
```
cd Client
npm start
```



## Features
### For Interns
/
    📊 **Dashboard:** Provides an overview of assigned tasks, received messages, and shared documents. Shows the number of to-do, in-progress, and completed tasks along with the completion rate.
    💬 **Real-Time Chat:** Instant communication with supervisors.
    📋 **Task Management:** Change task status via drag-and-drop, view task details, delete tasks, and copy task descriptions with a single click.
    📁 **Document Sharing:** Send and receive documents with supervisors, stored in Firebase.

### For Supervisors
/
    🔑 **Authentication Page:** Log in using pre-defined account information in the database.
    📊 **Supervision Dashboard:** Overview of intern activities, including tasks and shared documents.
    💬 **Communication with Interns:** Real-time chat, copy messages, view online interns, and view intern profiles.
    👥 **Intern Account Management:** Create, edit, and delete intern accounts. View detailed information about interns, including a pie chart showing task status percentages.
    📋 **Task Assignment:** Assign new tasks to interns with the title, description, and due date. Interns can update task completion status and details.
    📁 **Document Sharing:** Exchange documents with interns by entering the file title and uploading via a form or drag-and-drop. Documents are stored in Firebase.

## Conclusion

This application aims to optimize internship management processes at OCP by providing a centralized platform for communication, task management, and document sharing. The technology stack ensures a smooth and responsive user experience.
Author

    SALAMA ANAS.

## License

This project is licensed under the MIT License. See the LICENSE file for details.