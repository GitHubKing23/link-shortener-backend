// controllers/adminController.js
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username !== process.env.ADMIN_USER ||
      password !== process.env.ADMIN_PASS
    ) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};
