export const validateRegister = (form, existingUsers = []) => {
  let e = {};

  // Name check (min 3 as per Backend)
  if (!form.name || form.name.trim().length < 3) {
    e.name = "Name must be at least 3 characters";
  }

  // Username check (min 3 as per Backend - aapka 8 tha isliye fail ho raha tha)
  if (!form.username || form.username.trim().length < 3) {
    e.username = "Username must be at least 3 characters";
  }

  // Email check
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    e.email = "Invalid email format";
  }

  // Phone check (Exactly 10 digits as per Backend @Length(10,10))
  if (!/^[0-9]{10}$/.test(form.phone)) {
    e.phone = "Phone must be exactly 10 digits";
  }

  // Password check (Min 8 as per Backend)
  if (!form.password || form.password.length < 8) {
    e.password = "Password must be at least 8 characters";
  }

  // Confirm Password
  if (form.password !== form.confirm) {
    e.confirm = "Passwords do not match";
  }

  // Dept & Year
  if (!form.dept) e.dept = "Select department";
  if (!form.year) e.year = "Select year";

  return e;
};