// Base URL of your API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Check if the user is logged in
function isUserLoggedIn() {
    try {
        return localStorage.getItem('accessToken') !== null;
    } catch (error) {
        console.error('Error accessing localStorage:', error);
        alert('An error occurred while checking login status.');
        return false; // Return false if there's an error accessing localStorage
    }
}

// Redirect to login page
function redirectToLogin() {
    window.location.href = '../login/login.html'; // Adjust to your login page URL
}

// Logout function
async function logout() {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to logout');
        }

        // Successfully logged out
        alert('Logged out successfully!');
        localStorage.removeItem('accessToken'); // Remove the token from localStorage
        localStorage.clear();
        redirectToLogin(); // Redirect to the login page
    } catch (error) {
        console.error('Error during logout:', error);
        alert(`An error occurred while logging out: ${error.message}`);
    }
}

// Fetch posts from the API
async function fetchPosts() {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/posts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            // If unauthorized, redirect to login
            redirectToLogin();
        } else if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while fetching posts: ${error.message}`);
    }
}

// Display posts on the page
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts');
    posts.forEach(post => {
        // Create a div for each post
        const postDiv = document.createElement('div');
        postDiv.classList.add('post'); // Optional: add a class for styling

        // Create an h2 tag for the post title
        const postTitle = document.createElement('h2');
        postTitle.textContent = post.title;

        // Create a p tag for the post body
        const postBody = document.createElement('p');
        const truncatedBody = truncateBody(post.body);

        postBody.textContent = truncatedBody;

        // Create a "See more" link if the body is truncated
        const seeMoreLink = document.createElement('a');
        if (truncatedBody !== post.body) {
            seeMoreLink.textContent = '... See more';
            seeMoreLink.href = '#';
            seeMoreLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Save the post ID in localStorage
                localStorage.setItem('postId', post.id);

                // Redirect to the post page
                window.location.href = '../post/post.html';
            });
        }

        // Append the title and body to the post div
        postDiv.appendChild(postTitle);
        postDiv.appendChild(postBody);

        // If the body is truncated, append the "See more" link
        if (truncatedBody !== post.body) {
            postDiv.appendChild(seeMoreLink);
        }

        // Append the post div to the posts container
        postsContainer.appendChild(postDiv);
    });
}

// Function to truncate the body text
function truncateBody(body) {
    const maxLength = 30; // Max number of characters to display
    if (body.length > maxLength) {
        return body.substring(0, maxLength) + '...'; // Truncate and add ellipsis
    }
    return body; // Return full body if it's within the length limit
}

// Main function
function main() {
    try {
        if (!isUserLoggedIn()) {
            redirectToLogin();
            return;
        }

        // Attach event listener to the logout button
        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', logout);

        fetchPosts();
    } catch (error) {
        console.error('Error in main function:', error);
        alert(`An error occurred in the app: ${error.message}`);
    }
}

// Run the app
main();
