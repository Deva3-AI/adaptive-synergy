
// Update line 92 to use .find():
const role = roles.find(r => r.role_id === userResponse.role_id)?.role_name;
