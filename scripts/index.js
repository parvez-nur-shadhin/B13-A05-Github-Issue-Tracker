const loginButton = document.getElementById('sign-in-btn');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');


loginButton.addEventListener('click', () => {
    const usernameValue = usernameInput.value.trim().toLowerCase();
    const passwordValue = passwordInput.value;
    
    // validating Username
    if(usernameValue === 'admin'){
        if(passwordValue.length === 8){

            if(passwordValue === 'admin123'){
                alert("Login Successful");
                window.location.assign("./homepage.html");
            }
            else {
                alert("Invalid Password");
            }
            
        }
        else{
            alert("Password length must be 8 digit")
        }
    }
    else {
        alert("Invalid Username");
    }
    
});
