// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const accessCodeInput = document.getElementById('access-code');
  const submitBtn = document.getElementById('submit-btn');
  const errorMessage = document.getElementById('error-message');

  // Check if user is already authenticated
  checkAuthentication();

  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const accessCode = accessCodeInput.value.trim();
    
    // Hide any existing error messages
    errorMessage.classList.remove('show');
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying...';
    
    try {
      // Call Netlify Function to verify the code
      const response = await fetch('/.netlify/functions/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: accessCode })
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        // Success! Store the token and redirect
        sessionStorage.setItem('dashboard_token', data.token);
        sessionStorage.setItem('token_timestamp', Date.now().toString());
        
        // Success feedback
        submitBtn.textContent = 'Access Granted! ✓';
        submitBtn.style.background = '#10bc69';
        
        // Redirect to dashboard after brief delay
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);
        
      } else {
        // Invalid code
        showError();
        resetButton();
      }
      
    } catch (error) {
      console.error('Error verifying code:', error);
      showError('An error occurred. Please try again.');
      resetButton();
    }
  });
  
  function showError(message = 'Invalid access code. Please check your code and try again.') {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    accessCodeInput.focus();
    accessCodeInput.select();
  }
  
  function resetButton() {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Access Dashboard';
  }
  
  function checkAuthentication() {
    const token = sessionStorage.getItem('dashboard_token');
    const timestamp = sessionStorage.getItem('token_timestamp');
    
    if (token && timestamp) {
      // Check if token is still valid (24 hours)
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (tokenAge < maxAge) {
        // User is already authenticated, redirect to dashboard
        window.location.href = 'dashboard.html';
      } else {
        // Token expired, clear it
        sessionStorage.removeItem('dashboard_token');
        sessionStorage.removeItem('token_timestamp');
      }
    }
  }
});