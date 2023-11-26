const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models')

const authUser = async (req, res, next) => {
  let message; 
  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({ where: { emailAddress: credentials.name } });
    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.emailAddress}`);
        req.currentUser = user;  
      } else {
        message = 'Authentication failure';
      }
    } else {
      message = 'User not found';
    }
  } else {
    message = 'Auth header not found';
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};

module.exports = authUser;
