const db = require('../../config/db');

const findAllByUser = async (userId) => {
  const { rows } = await db.query(
    'SELECT * FROM notebooks WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

const findByIdAndUser = async (id, userId) => {
  const { rows } = await db.query('SELECT * FROM notebooks WHERE id = $1 AND user_id = $2', [
    id,
    userId,
  ]);
  return rows[0];
};

const create = async (userId, name) => {
  const { rows } = await db.query(
    'INSERT INTO notebooks (user_id, name) VALUES ($1, $2) RETURNING *',
    [userId, name]
  );
  return rows[0];
};

const update = async (id, userId, name) => {
  const { rows } = await db.query(
    'UPDATE notebooks SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    [name, id, userId]
  );
  return rows[0];
};

const remove = async (id, userId) => {
  const result = await db.query('DELETE FROM notebooks WHERE id = $1 AND user_id = $2', [
    id,
    userId,
  ]);
  return result.rowCount > 0;
};

module.exports = {
  findAllByUser,
  findByIdAndUser,
  create,
  update,
  remove,
};
