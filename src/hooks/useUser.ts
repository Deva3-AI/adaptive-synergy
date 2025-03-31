
// Update the role_name access in line 53 to use .find():
const role = roles.find(r => r.role_id === user.role_id)?.role_name;
