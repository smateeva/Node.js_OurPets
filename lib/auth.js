const bcrypt = require('bcrypt');
const db = require('../db/database');

async function registerUser({ name, username, email, password, pet = 'unknown' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (name, username, email, password, pet) VALUES (?, ?, ?, ?, ?)',
            [name, username, email, hashedPassword, pet], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}

async function loginUser(email, password) {
    try {
      console.log("Login with email:", email);
      const user = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      if (!user) {
        throw new Error('User not found');
      }
  
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        throw new Error('Password is incorrect');
      }
  
      return user; 
  
    } catch (error) {
      throw error; 
    }
  }
  
module.exports = { loginUser, registerUser };


