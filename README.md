# CodeGalaxy

CodeGalaxy is a web application for sharing and discovering code snippets across various programming languages. It allows users to create, view, comment on, and vote for code snippets. The platform features syntax highlighting, user authentication, and a neon-themed user interface.

## Features

- **User Authentication**: Register and log in to create and manage your own snippets.
- **Create Snippets**: Add new code snippets with titles, descriptions, and language selection.
- **Syntax Highlighting**: Preview code snippets with language-specific syntax highlighting.
- **Comment System**: Engage with other users by commenting on their snippets.
- **Voting System**: Upvote or downvote snippets to promote valuable content.
- **Search and Filter**: Search for snippets by title, description, or language.
- **Categories**: Browse snippets organized by programming language categories.
- **Community Snippets**: Explore snippets shared by other users.
- **User Profiles**: View all snippets created by a specific user.
- **Responsive Design**: Fully responsive UI with a modern neon theme.

## Technologies Used

### Frontend

- **React**
- **Redux Toolkit**
- **React Router DOM**
- **Axios**
- **React Syntax Highlighter**
- **Bootstrap**
- **React Icons**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt.js** for password hashing

## Installation

### Prerequisites

- **Node.js** and **npm** installed
- **MongoDB** database (local or hosted)
- **Git** (optional)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/CodeGalaxy.git
   ```

2. **Backend Setup**

   ```bash
   cd CodeGalaxy/backend
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the `backend` directory and add the following:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Default Snippets**
   ```bash
   npm run seed
   ```

5. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```

6. **Environment Variables**

   Create a `.env` file in the `frontend` directory and add:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

7. **Start the Frontend and Backend**

   ```bash
   cd ..
   npm run dev
   ```

8. **Access the Application**

   Open your browser and navigate to `http://localhost:3000`

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.
2. **Create** a new branch: `git checkout -b feature/YourFeature`
3. **Commit** your changes: `git commit -m 'Add some feature'`
4. **Push** to the branch: `git push origin feature/YourFeature`
5. **Open** a pull request.

## License

This project is licensed under the **GNU GENERAL PUBLIC LICENSE**.

## Contact

- **G Shreekar**: [GitHub](https://github.com/GShreekar)
- **Shreyas Bairy K S**: [GitHub](https://github.com/ShreyasBairyKS)
- **H Sampreeth Bhat**: [GitHub](https://github.com/Sampreeth-bhat)

---

*Note: Replace `your_mongodb_connection_string`, `your_jwt_secret_key`, and developer names and GitHub links with actual values.*
