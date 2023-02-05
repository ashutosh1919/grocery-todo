from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import urllib.parse as up
import psycopg2
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

DB_URL = os.environ['DB_URL']
up.uses_netloc.append("postgres")
url = up.urlparse(DB_URL)

def get_db():
    conn = psycopg2.connect(
        database=url.path[1:],
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port
    )
    return conn

@app.route('/get-todos')
def get_todos():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM groceries;')
    todos = cursor.fetchall()
    cursor.close()
    db.close()
    formatted_todos = []
    for elm in todos:
        formatted_todos.append({
            'id': elm[0],
            'text': elm[1]
        })
    return {'data': formatted_todos}

@app.route('/update-todo', methods=['POST'])
def update_todo():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("UPDATE groceries SET item_name='{}' WHERE item_id={};".format(
        request.form['item_name'],
        int(request.form['item_id'])
    ))
    db.commit()
    cursor.close()
    db.close()
    return {"status": 200}

@app.route('/add-todo', methods=['POST'])
def add_todo():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO groceries (item_name) VALUES('{}');".format(request.form['item_name']))
    db.commit()
    cursor.close()
    db.close()
    return {"status": 200}

@app.route('/remove-todo', methods=['POST'])
def remove_todo():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM groceries WHERE item_id='{}';".format(int(request.form['item_id'])))
    db.commit()
    cursor.close()
    db.close()
    return {"status": 200}

@app.route('/')
def ping_server():
    return "Welcome to the API of TODO List app."

if __name__=='__main__':
    app.run(host="0.0.0.0", port=5000)
