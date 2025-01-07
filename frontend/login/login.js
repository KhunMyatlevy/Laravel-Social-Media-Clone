document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            document.getElementById('errorMessage').innerText = errorData.message || 'Login failed';
            document.getElementById('errorMessage').style.display = 'block';
            return;
        }

        const data = await response.json();
        
        // Save data to localStorage
        localStorage.setItem('accessToken', data.access_token); // Save access token
        localStorage.setItem('userId', data.user_id);           // Save user ID
        localStorage.setItem('userName', data.user_name);       // Save user name

        // Log the saved data for verification
        console.log('Access Token:', localStorage.getItem('accessToken'));
        console.log('User ID:', localStorage.getItem('userId'));
        console.log('User Name:', localStorage.getItem('userName'));

        alert('Login successful!');
        window.location.href = '../index/index.html'; // Redirect to the index page
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorMessage').innerText = 'An error occurred. Please try again.';
        document.getElementById('errorMessage').style.display = 'block';
    }
});
