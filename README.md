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
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the Backend Server**

   ```bash
   npm run dev
   ```

5. **Frontend Setup**

   Open a new terminal window:

   ```bash
   cd CodeGalaxy/frontend
   npm install
   ```

6. **Environment Variables**

   Create a `.env` file in the `frontend` directory and add:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

7. **Start the Frontend Server**

   ```bash
   npm start
   ```

8. **Access the Application**

   Open your browser and navigate to `http://localhost:3000`

## Usage

- **Register** a new account or **log in** if you already have one.
- Navigate to **Create Snippet** to add a new code snippet.
- Fill in the snippet details, including title, description, language, and code.
- Use the **live preview** to see your code with syntax highlighting.
- **Submit** the form to create the snippet.
- Browse existing snippets via **Snippets**, **Categories**, or **Community Snippets**.
- **Upvote**, **downvote**, and **comment** on snippets.
- Visit **My Snippets** to view and manage your uploaded snippets.
- **Log out** when you're done.

## API Endpoints

- **Authentication**
  - `POST /api/register`: Register a new user.
  - `POST /api/login`: Log in a user.
  - `GET /api/user`: Get the current logged-in user's info.

- **Snippets**
  - `GET /api/snippet`: Get all snippets (with optional filters).
  - `POST /api/snippet`: Create a new snippet.
  - `GET /api/snippet/:id`: Get a snippet by ID.
  - `POST /api/snippet/:id/comment`: Add a comment to a snippet.
  - `POST /api/snippet/:id/upvote`: Upvote a snippet.
  - `POST /api/snippet/:id/downvote`: Downvote a snippet.
  - `GET /api/snippet/user/:username`: Get all snippets by a user.
  - `GET /api/snippet/stats/languages`: Get snippet counts per language.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.
2. **Create** a new branch: `git checkout -b feature/YourFeature`
3. **Commit** your changes: `git commit -m 'Add some feature'`
4. **Push** to the branch: `git push origin feature/YourFeature`
5. **Open** a pull request.

## License

This project is licensed under the **MIT License**.

## Contact

- **Developer 1**: [GitHub](https://github.com/dev1)
- **Developer 2**: [GitHub](https://github.com/dev2)

---

*Note: Replace `your_mongodb_connection_string`, `your_jwt_secret_key`, and developer names and GitHub links with actual values.*