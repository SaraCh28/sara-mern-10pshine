const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const { JWT_EXPIRES_IN } = require('../../utils/constants');

const findUserByEmail = async (email) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, hashedPassword]
  );
  return rows[0];
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const updateUser = async (userId, updateData) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined) {
      if (key === 'password') {
        const hashedPassword = await bcrypt.hash(value, 10);
        fields.push(`${key} = $${index}`);
        values.push(hashedPassword);
      } else {
        fields.push(`${key} = $${index}`);
        values.push(value);
      }
      index++;
    }
  }

  if (fields.length === 0) return null;

  values.push(userId);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name, email`;
  
  const { rows } = await db.query(query, values);
  return rows[0];
};

const deleteUser = async (userId) => {
  const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [userId]);
  return rowCount > 0;
};

module.exports = {
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  generateToken,
};
