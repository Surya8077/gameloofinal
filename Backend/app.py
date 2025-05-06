from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import jwt
import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash
from contextlib import contextmanager

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key

# Database connection management
DATABASE = 'database.db'

@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Database initialization
def init_db():
    with get_db() as conn:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS users
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      email TEXT UNIQUE NOT NULL,
                      password TEXT NOT NULL)''')
        
        c.execute('''CREATE TABLE IF NOT EXISTS subscribers
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      email TEXT UNIQUE NOT NULL,
                      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        conn.commit()

init_db()

# Newsletter subscription endpoint
@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
            
        # Basic email validation
        if not '@' in email or not '.' in email:
            return jsonify({'error': 'Invalid email format'}), 400
            
        with get_db() as conn:
            c = conn.cursor()
            
            # Check if email already exists
            c.execute('SELECT email FROM subscribers WHERE email = ?', (email,))
            if c.fetchone():
                return jsonify({'message': 'Email already subscribed'}), 200
                
            # Add new subscriber
            c.execute('INSERT INTO subscribers (email) VALUES (?)', (email,))
            conn.commit()
            
        return jsonify({'message': 'Successfully subscribed to newsletter'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=False) 