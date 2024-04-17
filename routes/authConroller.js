const bcrypt = require('bcrypt');


exports.loginPage = (req, res) => {
  res.render('login'); 
};


exports.login = async (req, res) => {
  const { username, password } = req.body;
  res.redirect('/'); 
};

exports.registerPage = (req, res) => {
  res.render('register');
};

exports.register = async (req, res) => {
  const { name, username, email, password, pet } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); 
  res.redirect('/login'); 
};
