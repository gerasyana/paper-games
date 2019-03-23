const EMAIL_PATTERN = /^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\.)+([a-zA-Z0-9]{2,4})+$/i;

export const validateInput = (value, rules) => {
    let isValid = true;

    if (!rules) {
        return true;
    }

    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
        if (!isValid) {
            return { message : 'Field is required', isValid }
        }
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
        if (!isValid) {
            return { message: `Field must contain at least ${rules.minLength} character`, isValid }
        }
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
        if (!isValid) {
            return { message: `Field must contain no more than ${rules.maxLength} characters`, isValid }
        }
    }

    if (rules.isEmail) {
        isValid = EMAIL_PATTERN.test(value) && isValid;
        if (!isValid) {
            return { message: 'Email is invalid', isValid }
        }
    }
    return { isValid };
}