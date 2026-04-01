// Get form elements
const form = document.getElementById("registration-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

// Main form submission handler
form.addEventListener("submit", function (e) {
  e.preventDefault();
  
  // Step 1: Check if all fields are filled
  const isRequiredValid = checkRequired([username, email, password, confirmPassword]);
  let isFormValid = isRequiredValid;
  
  // Step 2 & 3: If all required fields are filled, check validation rules
  if (isRequiredValid) {
    const isUsernameValid = checkLength(username, 3, 15);
    const isEmailValid = checkEmail(email);
    const isPasswordValid = checkLength(password, 6, 25);
    const isPasswordsMatch = checkPasswordsMatch(password, confirmPassword);
    
    isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isPasswordsMatch;
  }
  
  // Step 4: If all validations pass, show success message
  if (isFormValid) {
    alert("Registration successful!");
    form.reset();
    document.querySelectorAll(".form-item").forEach((group) => {
      group.className = "form-item";
    });
  }
});

// Check if all required fields are filled
function checkRequired(inputArray) {
  let isValid = true;
  
  inputArray.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `${formatFieldName(input)} is required`);
      isValid = false;
    } else {
      showSuccess(input);
    }
  });
  
  return isValid;
}

// Check length validation for username and password
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(input, `${formatFieldName(input)} must be at least ${min} characters.`);
    return false;
  } else if (input.value.length > max) {
    showError(input, `${formatFieldName(input)} must be less than ${max} characters.`);
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// Check email validation using regex
function checkEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (emailRegex.test(email.value.trim())) {
    showSuccess(email);
    return true;
  } else {
    showError(email, "Email is not valid");
    return false;
  }
}

// Check if passwords match
function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, "Passwords do not match");
    return false;
  }
  return true;
}

// Format field name with proper capitalization
function formatFieldName(input) {
  // Handle special case for confirmPassword
  if (input.id === 'confirmPassword') {
    return 'Confirm Password';
  }
  // input id: username -> Username
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Show error message
function showError(input, message) {
  const formGroup = input.parentElement;
  formGroup.className = "form-item error";
  const small = formGroup.querySelector("small");
  small.innerText = message;
}

// Show success state
function showSuccess(input) {
  const formGroup = input.parentElement;
  formGroup.className = "form-item success";
}