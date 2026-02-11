from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

df = pd.read_csv('data/Breast_GSE45827.csv')
print(f"Data loaded: {df.shape}")

@app.route('/api/test')
def test():
    return jsonify({"message": "API working!"})

@app.route('/api/genes')
def get_genes():
    genes = df.columns.tolist()
    return jsonify(genes)

@app.route('/api/info')
def get_info():
    return jsonify({
        "samples": len(df),
        "genes": len(df.columns)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)