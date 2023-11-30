const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models')

// Authentication for user
const authUser = async (req, res, next) => {
  let message; 
  const credentials = auth(req);

  // check that user entered credentials
  if (credentials) {
    const user = await User.findOne({ where: { emailAddress: credentials.name } });
    // check that user is truthy and user returned 
    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);
      // checking credentials are correct
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.emailAddress}`);
        req.currentUser = user;  
      } else {
        message = 'Authentication failed';
      }
    } else {
      message = 'User not found';
    }
  } else {
    message = 'Authorization header not found';
  }
  // If failure above, a message will be returned to user
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};

module.exports = authUser;
