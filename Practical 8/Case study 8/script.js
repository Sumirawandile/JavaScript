const form = document.getElementById("gymForm");

const fields = {
    name: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    dob: document.getElementById("dob"),
    emergencyName: document.getElementById("emergencyName"),
    emergencyPhone: document.getElementById("emergencyPhone"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    goal: document.getElementById("goal"),
    time: document.getElementById("time"),
    terms: document.getElementById("terms")
};

const messages = {
    name: document.getElementById("nameMsg"),
    email: document.getElementById("emailMsg"),
    phone: document.getElementById("phoneMsg"),
    dob: document.getElementById("dobMsg"),
    emergencyName: document.getElementById("emergencyNameMsg"),
    emergencyPhone: document.getElementById("emergencyPhoneMsg"),
    password: document.getElementById("passwordMsg"),
    confirm: document.getElementById("confirmMsg"),
    goal: document.getElementById("goalMsg"),
    time: document.getElementById("timeMsg"),
    gender: document.getElementById("genderMsg"),
    plan: document.getElementById("planMsg"),
    terms: document.getElementById("termsMsg")
};

function setState(element, messageElement, valid, message) {
    const field = element.closest(".field");
    if (field) field.classList.toggle("valid", valid), field.classList.toggle("invalid", !valid);
    messageElement.textContent = message;
}

function validateName() {
    const value = fields.name.value.trim();
    const valid = /^[A-Za-z ]{3,40}$/.test(value);
    setState(fields.name, messages.name, valid,
        valid ? "✓ Name looks good" : "Enter at least 3 letters (letters only).");
    return valid;
}

function validateEmail() {
    const value = fields.email.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    setState(fields.email, messages.email, valid,
        valid ? "✓ Valid email address" : "Enter a valid email address.");
    return valid;
}

function validatePhone() {
    const value = fields.phone.value.trim();
    const valid = /^[6-9]\d{9}$/.test(value);
    setState(fields.phone, messages.phone, valid,
        valid ? "✓ Valid mobile number" : "Enter a valid 10-digit Indian mobile number.");
    return valid;
}

function validateDOB() {
    const value = fields.dob.value;
    let valid = false;
    if (value) {
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear() -
            ((today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) ? 1 : 0);
        valid = age >= 16 && age <= 80;
    }
    setState(fields.dob, messages.dob, valid,
        valid ? "✓ Age requirement satisfied" : "Member must be between 16 and 80 years.");
    return valid;
}

function validateEmergencyName() {
    const value = fields.emergencyName.value.trim();
    const valid = /^[A-Za-z ]{3,40}$/.test(value);
    setState(fields.emergencyName, messages.emergencyName, valid,
        valid ? "✓ Contact name accepted" : "Enter a valid contact name.");
    return valid;
}

function validateEmergencyPhone() {
    const value = fields.emergencyPhone.value.trim();
    const valid = /^[6-9]\d{9}$/.test(value);
    setState(fields.emergencyPhone, messages.emergencyPhone, valid,
        valid ? "✓ Valid contact number" : "Enter a valid 10-digit number.");
    return valid;
}

function validatePassword() {
    const value = fields.password.value;
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
    const medium = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value);
    const bar = document.getElementById("strengthBar");

    if (strong) {
        bar.style.width = "100%";
        bar.style.background = "var(--success)";
    } else if (medium) {
        bar.style.width = "65%";
        bar.style.background = "var(--accent)";
    } else if (value.length > 0) {
        bar.style.width = "30%";
        bar.style.background = "var(--danger)";
    } else {
        bar.style.width = "0";
    }

    setState(fields.password, messages.password, strong,
        strong ? "✓ Strong password" : "Use 8+ characters with uppercase, lowercase and a number.");
    return strong;
}

function validateConfirmPassword() {
    const valid = fields.confirmPassword.value !== "" &&
                  fields.confirmPassword.value === fields.password.value;
    setState(fields.confirmPassword, messages.confirm, valid,
        valid ? "✓ Passwords match" : "Passwords do not match.");
    return valid;
}

function validateSelect(element, messageElement, label) {
    const valid = element.value !== "";
    setState(element, messageElement, valid,
        valid ? "✓ " + label + " selected" : "Please select " + label.toLowerCase() + ".");
    return valid;
}

function validateGender() {
    const valid = document.querySelector('input[name="gender"]:checked') !== null;
    messages.gender.textContent = valid ? "✓ Gender selected" : "Please select your gender.";
    messages.gender.className = valid ? "message success" : "message";
    return valid;
}

function validatePlan() {
    const valid = document.querySelector('input[name="plan"]:checked') !== null;
    messages.plan.textContent = valid ? "✓ Membership plan selected" : "Please select a membership plan.";
    messages.plan.className = valid ? "message success" : "message";
    return valid;
}

function validateTerms() {
    const valid = fields.terms.checked;
    messages.terms.textContent = valid ? "✓ Terms accepted" : "Please accept the terms to continue.";
    messages.terms.className = valid ? "message success" : "message";
    return valid;
}

// LIVE INPUT EVENTS
fields.name.addEventListener("input", validateName);
fields.email.addEventListener("input", validateEmail);
fields.phone.addEventListener("input", validatePhone);
fields.dob.addEventListener("change", validateDOB);
fields.emergencyName.addEventListener("input", validateEmergencyName);
fields.emergencyPhone.addEventListener("input", validateEmergencyPhone);
fields.password.addEventListener("input", validatePassword);
fields.confirmPassword.addEventListener("input", validateConfirmPassword);

// BLUR EVENTS
fields.name.addEventListener("blur", validateName);
fields.email.addEventListener("blur", validateEmail);
fields.phone.addEventListener("blur", validatePhone);
fields.emergencyName.addEventListener("blur", validateEmergencyName);
fields.emergencyPhone.addEventListener("blur", validateEmergencyPhone);
fields.password.addEventListener("blur", validatePassword);
fields.confirmPassword.addEventListener("blur", validateConfirmPassword);

// CHANGE EVENTS
fields.goal.addEventListener("change", () => validateSelect(fields.goal, messages.goal, "Fitness goal"));
fields.time.addEventListener("change", () => validateSelect(fields.time, messages.time, "Workout time"));
fields.terms.addEventListener("change", validateTerms);

document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener("change", validateGender);
});
document.querySelectorAll('input[name="plan"]').forEach(radio => {
    radio.addEventListener("change", validatePlan);
});

// Allow only digits in phone fields
[fields.phone, fields.emergencyPhone].forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 10);
    });
});

// FINAL SUBMIT EVENT
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const checks = [
        validateName(),
        validateEmail(),
        validatePhone(),
        validateDOB(),
        validateGender(),
        validatePlan(),
        validateSelect(fields.goal, messages.goal, "Fitness goal"),
        validateSelect(fields.time, messages.time, "Workout time"),
        validateEmergencyName(),
        validateEmergencyPhone(),
        validatePassword(),
        validateConfirmPassword(),
        validateTerms()
    ];

    const status = document.getElementById("formStatus");

    if (checks.every(Boolean)) {
        status.className = "form-status success";
        status.textContent = "✓ Admission application submitted successfully! Welcome to FitZone.";
        status.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        status.className = "form-status error";
        status.textContent = "Please correct the highlighted fields before submitting.";
        status.scrollIntoView({ behavior: "smooth", block: "center" });
    }
});
