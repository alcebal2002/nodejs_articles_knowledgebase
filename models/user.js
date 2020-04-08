function User (id, name, email, username, password) {
    // Set properties
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
}

module.exports = User;