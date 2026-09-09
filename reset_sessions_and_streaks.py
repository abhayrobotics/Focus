import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_path = r"d:\Code\RoadMap 2026\Project\CareerTracker\prisma\career_os.db"

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Clear all historical work sessions and daily reviews
cur.execute("DELETE FROM WorkSession")
deleted_sessions = cur.rowcount

cur.execute("DELETE FROM DailyReview")
deleted_reviews = cur.rowcount

# Reset DSA questions to NOT_STARTED and clear dateSolved
cur.execute("""
UPDATE DSAQuestion
SET status = 'NOT_STARTED',
    dateSolved = NULL,
    needsRevision = 0,
    solution = NULL,
    mistake = NULL
""")
reset_questions = cur.rowcount

conn.commit()
conn.close()

print(f"🧹 Successfully cleared {deleted_sessions} work sessions.")
print(f"🧹 Successfully cleared {deleted_reviews} daily reviews.")
print(f"🔄 Reset {reset_questions} DSA questions to NOT_STARTED.")
print("✨ Fresh slate ready starting today (Streak = 0, Logged Time = 0h)!")
