import sqlite3
db_path = "C:/Users/elwax/.engram/engram.db"
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute("SELECT id, title, topic_key FROM observations WHERE topic_key LIKE '%tasks%'")
for row in cur.fetchall():
    print(row)
