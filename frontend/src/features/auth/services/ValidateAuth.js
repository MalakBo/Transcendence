export const validationRules = {
    name: {
        required: true,
        message: "Name is required"
    },
    email: {
        required: true,
        type: "email",
        message: "Please enter a valid email address"
    },
    password: {
        required: true,
        minLength: 8,
        message: "Password must contain at least 8 characters"
    },
    retypePassword: {
        required: true,
        matches: "password",
        message: "Please confirm your password",
        matchMessage: "Passwords do not match"
    },
    role: {
        required: true,
        message: "Role is required"
    }
};

export function validateForm(values, rules) {
    const errors = {};

    for (const field in rules) {
        const rule = rules[field];
        const value = values[field] ?? "";

        // Required validation
        if (rule.required && !value.trim()) {
            errors[field] = rule.message;
            continue;
        }

        // Email format validation
        if (rule.type === "email" && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(value)) {
                errors[field] = rule.message;
            }
        }

        // Minimum length validation
        if (rule.minLength && value.length < rule.minLength && value) {
            errors[field] = rule.message;
        }

        // Compare with another field
        if (rule.matches && value !== values[rule.matches]) {
            errors[field] = rule.matchMessage;
        }
    }

    return errors;
}