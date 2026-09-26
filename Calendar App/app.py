from flask import Flask, render_template, request, jsonify
import sqlite3

def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS events (
            date TEXT,
            time TEXT,
            all_day INTEGER,
            text TEXT
        )
    ''')

    conn.commit()
    conn.close()

app = Flask(__name__)
init_db()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/event-dates')
def event_dates():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute('SELECT DISTINCT date FROM events')
    dates = [row[0] for row in c.fetchall()]

    conn.close()
    return jsonify(dates)

@app.route('/add-event', methods=['POST'])
def add_event():
    data = request.get_json()

    date = data['date']
    time = data['time']
    text = data['text']
    all_day = int(data['all_day'])

    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute('CREATE TABLE IF NOT EXISTS events (date TEXT, time TEXT, all_day INTEGER, text TEXT)')
    c.execute('INSERT INTO events VALUES (?, ?, ?, ?)', (date, time, all_day, text))

    conn.commit()
    conn.close()

    print("Saved:", date, time, text)  # debug

    return jsonify({"status": "success"})

@app.route('/get-events/<date>')
def get_events(date):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute(
    'SELECT time, all_day, text FROM events WHERE date=? ORDER BY all_day DESC, time',
    (date,)
)
    events = c.fetchall()

    conn.close()

    return jsonify(events)

app.run(host='0.0.0.0', port=5500)