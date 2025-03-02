document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in

    
if (sessionStorage.getItem('loggedIn') !== 'true') {
    window.location.href = './login.html'; 
    return; // Exit if redirecting
}

    // If logged in, display user picture and logout button
    const userContainer = document.querySelector('.user-container');
    const userPic = document.createElement('img');
    const logoutButton = document.createElement('button');

    userPic.src = sessionStorage.getItem('userPic');
    userPic.alt = 'User Picture';
    userPic.style.width = '60px'; // Adjust size as needed
    userPic.style.borderRadius = '50%'; // Optional: Make it circular

    // Create logout button
    logoutButton.textContent = 'Logout';
    logoutButton.classList.add('logout-button'); // Add class for styling
    logoutButton.onclick = () => {
        sessionStorage.clear(); // Clear session storage
        window.location.reload(); // Reload the page
    };

    // Append user picture and logout button to the user container
    userContainer.appendChild(userPic);
    userContainer.appendChild(logoutButton);
    userContainer.style.display = 'flex'; // Adjust display style
    userContainer.style.alignItems = 'center'; // Center items vertically
});