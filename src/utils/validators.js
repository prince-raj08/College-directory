export const validateRegister = (form, existingUsers) => {
  let e = {};

  if (!form.name.trim()) e.name = "Full name required";

  if (!/^[A-Za-z0-9]{8,}$/.test(form.username)) {
  e.username = "Username must be 8+ letters & numbers only";
}

  if (!/\S+@\S+\.\S+/.test(form.email))
    e.email = "Invalid email";

  if (!/^[0-9]{10}$/.test(form.phone))
    e.phone = "Enter 10 digit phone";

  if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$/.test(form.password))
    e.password = "Strong password required";

  if (form.password !== form.confirm)
    e.confirm = "Passwords do not match";

  if (!form.dept) e.dept = "Select department";
  if (!form.year) e.year = "Select year";

  // Duplicate checks
  if (existingUsers.some(u => u.email === form.email))
    e.email = "Email already registered";

  if (existingUsers.some(u => u.phone === form.phone))
    e.phone = "Phone already registered";

  return e;
};
