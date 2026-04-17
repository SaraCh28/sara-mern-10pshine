const db = require('../../config/db');

const findAllByUser = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM notes WHERE user_id = ? ORDER BY is_pinned DESC, created_at DESC',
    [userId]
  );
  return rows;
};

const findByIdAndUser = async (noteId, userId) => {
  const [rows] = await db.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [
    noteId,
    userId,
  ]);
  return rows[0];
};

const create = async (userId, noteData) => {
  const { title, content, is_pinned = false } = noteData;
  const [result] = await db.query(
    'INSERT INTO notes (user_id, title, content, is_pinned) VALUES (?, ?, ?, ?)',
    [userId, title, content, is_pinned]
  );
  return { id: result.insertId, user_id: userId, title, content, is_pinned };
};

const update = async (noteId, userId, updateData) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return null;

  values.push(noteId, userId);

  const query = `UPDATE notes SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
  await db.query(query, values);

  return findByIdAndUser(noteId, userId);
};

const remove = async (noteId, userId) => {
  const [result] = await db.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [
    noteId,
    userId,
  ]);
  return result.affectedRows > 0;
};

module.exports = {
  findAllByUser,
  findByIdAndUser,
  create,
  update,
  remove,
};
