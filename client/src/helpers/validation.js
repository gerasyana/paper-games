const EMAIL_PATTERN = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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
            return { message: `Must contain at least ${rules.minLength} character`, isValid }
        }
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
        if (!isValid) {
            return { message: `Must contain no more than ${rules.minLength} characters`, isValid }
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