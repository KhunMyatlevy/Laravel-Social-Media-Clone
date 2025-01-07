// Base URL of your API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Handle the registration form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Collect form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('password_confirmation').value;

    try {
        // Make the API call
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register.');
        }

        const data = await response.json();

        // Save the access token to localStorage
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('userId', data.user_id);           // Save user ID
        localStorage.setItem('userName', data.user_name);       // Save user name

        // Redirect to index.html
        window.location.href = '../index/index.html';

    } catch (error) {
        console.error('Error during registration:', error);
        const errorMessageElement = document.getElementById('errorMessage');
        errorMessageElement.textContent = error.message;
        errorMessageElement.style.display = 'block';
    }
});
