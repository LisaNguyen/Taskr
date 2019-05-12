const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decode = jwt.verify(token, 'SAjdshdjhsSerfHK');
    const user = await User.findOne({ _id: decode._id, 'tokens.token' : token });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Authentication failed.'});
  }
};

module.exports = auth;
