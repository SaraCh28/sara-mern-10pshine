const db = require('../../config/db');

const findAllByUser = async (userId) => {
  const { rows } = await db.query(
    'SELECT * FROM notes WHERE user_id = $1 ORDER BY is_pinned DESC, created_at DESC',
    [userId]
  );
  return rows;
};

const findByIdAndUser = async (noteId, userId) => {
  const { rows } = await db.query('SELECT * FROM notes WHERE id = $1 AND user_id = $2', [
    noteId,
    userId,
  ]);
  return rows[0];
};

const create = async (userId, noteData) => {
  const { title, content, tags = '', is_pinned = false } = noteData;
  const { rows } = await db.query(
    'INSERT INTO notes (user_id, title, content, tags, is_pinned) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, title, content, tags, is_pinned]
  );
  return rows[0];
};

const update = async (noteId, userId, updateData) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (fields.length === 0) return null;

  values.push(noteId, userId);
  const query = `UPDATE notes SET ${fields.join(', ')} WHERE id = $${index} AND user_id = $${index + 1} RETURNING *`;
  
  const { rows } = await db.query(query, values);
  return rows[0];
};

const remove = async (noteId, userId) => {
  const result = await db.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [
    noteId,
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
