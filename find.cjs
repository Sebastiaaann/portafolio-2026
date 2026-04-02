const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('C:/Users/elwax/.engram/engram.db');
db.all("SELECT id, title, topic_key FROM observations WHERE project = 'D:\\proyectos\\Portafolio 2026'", [], (err, rows) => {
  if (err) throw err;
  rows.forEach((row) => console.log(row.id, row.title, row.topic_key));
});