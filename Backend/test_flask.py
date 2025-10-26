from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Flask test running successfully!"

if __name__ == '__main__':
    print("🚀 Starting simple Flask test...")
    app.run(debug=True, port=5000)
