from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from scipy import stats

app = Flask(__name__)
CORS(app)

df = pd.read_csv('data/Breast_GSE45827.csv')
print(f"Data loaded: {df.shape}")

@app.route('/api/info')
def get_info():
    return jsonify({
        "samples": len(df),
        "genes": len(df.columns) - 2,  # exclude 'samples' and 'type'
        "subtypes": df['type'].unique().tolist()
    })

@app.route('/api/genes')
def get_genes():
    genes = [c for c in df.columns if c not in ['samples', 'type']]
    return jsonify(genes)

@app.route('/api/scatter')
def get_scatter():
    gene_x = request.args.get('gene_x')
    gene_y = request.args.get('gene_y')

    if not gene_x or not gene_y:
        return jsonify({"error": "gene_x and gene_y required"}), 400
    if gene_x not in df.columns or gene_y not in df.columns:
        return jsonify({"error": "Gene not found"}), 404

    x = df[gene_x].tolist()
    y = df[gene_y].tolist()
    types = df['type'].tolist()

    # Pearson correlation + p-value
    r, p = stats.pearsonr(x, y)

    # Linear regression for trendline
    slope, intercept, _, _, _ = stats.linregress(x, y)
    x_min, x_max = min(x), max(x)
    trendline = {
        "x": [x_min, x_max],
        "y": [slope * x_min + intercept, slope * x_max + intercept]
    }

    return jsonify({
        "x": x,
        "y": y,
        "types": types,
        "gene_x": gene_x,
        "gene_y": gene_y,
        "correlation": round(r, 4),
        "p_value": float(f"{p:.2e}"),
        "trendline": trendline
    })

if __name__ == '__main__':
    app.run(debug=True, port=8080)