const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Check if the user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('accessToken') !== null;
}

// Redirect to login page if not logged in
function redirectToLogin() {
    window.location.href = '../login/login.html'; // Adjust this URL as needed
}

// Create a new post by sending the data to the backend
async function createPost(title, body) {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                body: body
            })
        });

        if (response.status === 401) {
            // If unauthorized, redirect to login
            redirectToLogin();
        } else if (!response.ok) {
            throw new Error('Failed to create post');
        }

        const data = await response.json();
        console.log('Post created successfully:', data);

        // Display success message
        document.getElementById('successMessage').textContent = 'Post created successfully!';
        document.getElementById('successMessage').style.display = 'block';

        // Optionally, redirect to the index page after successful creation
        setTimeout(() => {
            window.location.href = '../index/index.html';
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorMessage').textContent = `Error: ${error.message}`;
        document.getElementById('errorMessage').style.display = 'block';
    }
}

// Handle form submission
document.getElementById('createPostForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;

    // Clear previous error/success messages
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';

    if (!title || !body) {
        document.getElementById('errorMessage').textContent = 'Please fill in both title and body.';
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }

    // Call the function to create the post
    createPost(title, body);
});

// Redirect to login if the user is not logged in
if (!isUserLoggedIn()) {
    redirectToLogin();
}
