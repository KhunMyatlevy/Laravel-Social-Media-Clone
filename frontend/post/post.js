// Base URL of your API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Fetch and display the specific post
async function fetchPostDetails() {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const postId = localStorage.getItem('postId'); // Get the post ID from localStorage
        if (!postId) {
            throw new Error('No post ID found');
        }

        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            // If unauthorized, redirect to login
            window.location.href = '../login/login.html';
        } else if (!response.ok) {
            throw new Error('Failed to fetch post details');
        }

        const post = await response.json();
        displayPostDetails(post);

        

        localStorage.setItem('postOwnerId', post.post.user.id); // Save the owner's ID
        

        // Fetch and display comments for the post
        fetchComments(postId);

    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while fetching the post details: ${error.message}`);
    }
}

// Display post details on the page
function displayPostDetails(post) {
    console.log('Post object:', post);
    alert('Displaying post details...'); // This will show an alert when the function runs

    const postTitle = document.getElementById('postTitle');
    const postBody = document.getElementById('postBody');

    console.log('Post title element:', postTitle);
    console.log('Post body element:', postBody);

    console.log('Post title:', post.post.title);
    console.log('Post body:', post.post.body);

    postTitle.textContent = post.post.title;
    postBody.textContent = post.post.body;

    // Enable the "Edit" button
    const editButton = document.getElementById('editButton');
    editButton.addEventListener('click', () => editPost(post));

    // Enable the "Delete" button
    const deleteButton = document.getElementById('deleteButton');
    deleteButton.addEventListener('click', () => deletePost(post.id));

    // Conditionally show the "Edit" button if the user is the post owner
    const currentUserId = localStorage.getItem('userId'); // Get the logged-in user's ID
    const postOwnerId = localStorage.getItem('postOwnerId');

    if (currentUserId === postOwnerId) {
        // If the user is the owner, show the "Edit" button
        editButton.style.display = 'block';
        deleteButton.style.display = 'block';

    } else {
        // If the user is not the owner, hide the "Edit" button
        editButton.style.display = 'none';
        deleteButton.style.display = 'none';

    }
}


function editPost(post) {
    const newTitle = prompt('Enter new title:', post.post.title);
    const newBody = prompt('Enter new body:', post.post.body);

    if (newTitle && newBody) {
        updatePost(post.id, newTitle, newBody);
    }
}

// Update the post using PUT request
async function updatePost(postId, newTitle, newBody) {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle,
                body: newBody
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update post');
        }

        const updatedPost = await response.json();
        alert('Post updated successfully!');
        displayPostDetails(updatedPost);
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while updating the post: ${error.message}`);
    }
}

// Delete the post when the "Delete" button is clicked
async function deletePost(postId) {
    try {
        const confirmation = confirm('Are you sure you want to delete this post?');
        if (!confirmation) return;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        alert('Post deleted successfully!');
        // Redirect the user to the main page or posts list
        window.location.href = '../index/index.html';
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while deleting the post: ${error.message}`);
    }
}

// Fetch and display the comments for the post
async function fetchComments(postId) {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }

        const comments = await response.json();
        displayComments(comments);
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while fetching comments: ${error.message}`);
    }
}

// Display comments on the page with "Edit" and "Delete" buttons
function displayComments(comments) {
    const commentsListDiv = document.getElementById('commentsList');
    commentsListDiv.innerHTML = ''; // Clear any existing comments

    if (comments.length === 0) {
        commentsListDiv.innerHTML = '<p>No comments yet.</p>';
    } else {
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');

            // Comment body
            const commentBody = document.createElement('p');
            commentBody.textContent = comment.body;
            commentDiv.appendChild(commentBody);

            // "Edit" button
            const editCommentButton = document.createElement('button');
            editCommentButton.textContent = 'Edit';
            editCommentButton.addEventListener('click', () => editComment(comment.id, comment.body)); // Attach click event
            commentDiv.appendChild(editCommentButton);

            // "Delete" button
            const deleteCommentButton = document.createElement('button');
            deleteCommentButton.textContent = 'Delete';
            deleteCommentButton.addEventListener('click', () => {
                localStorage.setItem('commentId', comment.id); // Store commentId in localStorage
                deleteComment(comment.id); // Call deleteComment function
            });
            commentDiv.appendChild(deleteCommentButton);

            commentsListDiv.appendChild(commentDiv);
        });
    }
}

// Delete a comment
async function deleteComment(commentId) {
    try {
        const confirmation = confirm('Are you sure you want to delete this comment?');
        if (!confirmation) return;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }

        alert('Comment deleted successfully!');
        const postId = localStorage.getItem('postId'); // Refresh comments for the post
        fetchComments(postId);
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while deleting the comment: ${error.message}`);
    }
}

// Edit a comment
async function editComment(commentId, currentBody) {
    const updatedComment = prompt('Edit your comment:', currentBody);
    if (!updatedComment) {
        alert('Comment cannot be empty');
        return;
    }

    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body: updatedComment })
        });

        if (!response.ok) {
            throw new Error('Failed to edit comment');
        }

        alert('Comment updated successfully!');
        const postId = localStorage.getItem('postId'); // Refresh comments for the post
        fetchComments(postId);
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while editing the comment: ${error.message}`);
    }
}

// Add a comment
document.getElementById('commentButton').addEventListener('click', async () => {
    const postId = localStorage.getItem('postId'); // Get the post ID from localStorage
    if (!postId) {
        alert('Post ID not found');
        return;
    }

    const commentBody = prompt('Enter your comment:');
    if (!commentBody) {
        alert('Comment cannot be empty');
        return;
    }

    await addComment(postId, commentBody);
});

// Add a new comment
async function addComment(postId, commentBody) {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body: commentBody })
        });

        if (!response.ok) {
            throw new Error('Failed to add comment');
        }

        alert('Comment added successfully!');
        fetchComments(postId);
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while adding the comment: ${error.message}`);
    }
}

// Run the app
fetchPostDetails();

