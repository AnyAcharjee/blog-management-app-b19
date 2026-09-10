export const MIN_PASSWORD_LENGTH = 6;

// EMAIL_REGEX defines a regular expression for validating the basic structure 
// of an email address.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => EMAIL_REGEX.test(email);

export const isValidPassword = (password) => typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH;

//This function checks if the provided id is a valid positive integer.
// It returns true if the id consists only of digits (0-9),
// and false otherwise. This is useful for validating user IDs or other numeric identifiers in the application.
export const isValidId = (id) => /^\d+$/.test(id);

