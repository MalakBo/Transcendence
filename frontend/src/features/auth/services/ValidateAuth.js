export const validationRules = {
    name: {
        required: true,
        message: "Name is required"
    },
    email: {
        required: true,
        message: "Email is required"
    },
    password: {
        required: true,
        message: "Password is required"
    },
    role: {
        required: true,
        message: "Role is required"
    }
};

export function validateForm(values, rules) {
    const errors = {};

    for (const field in rules) {
        if (rules[field].required && !values[field]?.trim()) {
            errors[field] = rules[field].message;
        }
    }

    return errors;
}