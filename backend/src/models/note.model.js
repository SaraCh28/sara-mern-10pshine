const db = require('../config/db');

exports.createNote = async (title, content) => {
  const [result] = await db.execute(
    'INSERT INTO notes (title, content) VALUES (?, ?)',
    [title, content]
  );
  return result;
};

exports.getAllNotes = async () => {
  const [rows] = await db.execute('SELECT * FROM notes');
  return rows;
};

exports.updateNote = async (id, title, content) => {
  const [result] = await db.execute(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?',
    [title, content, id]
  );
  return result;
};

exports.deleteNote = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM notes WHERE id = ?',
    [id]
  );
  return result;
};