class AdminUser {
  constructor(
    admin_id,
    first_name,
    last_name,
    mobile,
    email,
    password_hash,
    is_superadmin,
    last_login
    // token,
    // token_expiry
  ) {
    this.admin_id = admin_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.mobile = mobile;
    this.email = email;
    this.password_hash = password_hash;
    this.is_superadmin = is_superadmin;
    this.last_login = last_login;
    // this.token = token;
    // this.token_expiry = token_expiry;
  }

  static fromUserData(userData) {
    return new AdminUser(
      userData.admin_id,
      userData.first_name,
      userData.last_name,
      userData.mobile,
      userData.email,
      userData.password_hash,
      userData.is_superadmin,
      userData.last_login
      // userData.token,
      // userData.token_expiry
    );
  }
}

module.exports = AdminUser;
