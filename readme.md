# Laravel Social Media Clone

A simple social media clone built using **Laravel** and **MySQL**. This project allows users to register, log in, create posts, comment on posts, and manage their own posts and comments. Authentication is handled via **Sanctum** for secure token-based access.

## Features

- **User Authentication**: Users can register, log in, and log out.
- **Post Management**: Users can create, update, delete, and view their own posts.
- **Comment Management**: Users can create, update, delete, and view comments on posts they own.
- **Access Control**: Only authenticated users can interact with posts and comments. Users can only access and modify their own posts and comments.

## Technologies Used

- **PHP**: Server-side scripting language used for backend logic.
- **Laravel**: PHP framework used for building RESTful APIs.
- **MySQL**: Database for storing user, post, and comment data.
- **Sanctum**: Laravel package for API token authentication.
- **Postman**: Used for API testing.

## API Endpoints

### Authentication Routes

- `POST /register`: Registers a new user.
- `POST /login`: Logs in the user and returns an API token.
- `POST /logout`: Logs out the user and invalidates the API token.

### Post Routes (Protected by token authentication)

- `GET /posts`: Fetch all posts (only accessible by authenticated users).
- `GET /posts/{id}`: Fetch a specific post by ID.
- `POST /posts`: Create a new post (only accessible by authenticated users).
- `PUT /posts/{id}`: Update a specific post (only accessible by the owner).
- `DELETE /posts/{id}`: Delete a post (only accessible by the owner).

### Comment Routes (Protected by token authentication)

- `POST /posts/{postId}/comments`: Create a comment on a post.
- `GET /posts/{postId}/comments`: Get all comments for a specific post.
- `PUT /comments/{commentId}`: Update a comment (only accessible by the owner).
- `DELETE /comments/{commentId}`: Delete a comment (only accessible by the owner).

## Testing the API

You can test the endpoints using **Postman** or **curl**. For authentication, you must include the **Bearer token** in the Authorization header after logging in.
