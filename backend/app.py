from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from scipy import stats
import os
import requests

DATA_PATH = 'data/Breast_GSE45827.csv'

if not os.path.exists(DATA_PATH)::
    os.makedirs('data', exist_ok=True)
    print("Downloading dataset...")
    import gdown
    gdown.download(
        'https://drive.google.com/uc?id=16DloVkpkGM2MvX1grnvL7yRcJLMD47CZ',
        DATA_PATH,
        quiet=False
    )
    print("Download complete.")

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

@app.route('/api/boxplot')
def get_boxplot():
    gene = request.args.get('gene')
    if not gene:
        return jsonify({"error": "gene required"}), 400
    if gene not in df.columns:
        return jsonify({"error": "Gene not found"}), 404

    result = {}
    for subtype in df['type'].unique():
        vals = df[df['type'] == subtype][gene].tolist()
        vals_sorted = sorted(vals)
        n = len(vals_sorted)
        q1 = vals_sorted[n // 4]
        median = vals_sorted[n // 2]
        q3 = vals_sorted[(3 * n) // 4]
        iqr = q3 - q1
        lower = max(min(vals_sorted), q1 - 1.5 * iqr)
        upper = min(max(vals_sorted), q3 + 1.5 * iqr)
        outliers = [v for v in vals if v < lower or v > upper]
        result[subtype] = {
            "min": lower, "q1": q1,
            "median": median, "q3": q3,
            "max": upper, "outliers": outliers
        }

    return jsonify({"gene": gene, "data": result})

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

@app.route('/api/accuracy')
def get_accuracy():
    genes = [c for c in df.columns if c not in ['samples', 'type']]
    X = df[genes].values
    y = df['type'].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    labels = sorted(list(set(y)))
    cm = confusion_matrix(y_test, y_pred, labels=labels).tolist()
    report = classification_report(y_test, y_pred, labels=labels, output_dict=True)

    per_class = {
        label: {
            "precision": round(report[label]["precision"], 3),
            "recall": round(report[label]["recall"], 3),
            "f1": round(report[label]["f1-score"], 3),
            "support": int(report[label]["support"])
        }
        for label in labels
    }

    return jsonify({
        "accuracy": round(accuracy_score(y_test, y_pred), 4),
        "labels": labels,
        "confusion_matrix": cm,
        "per_class": per_class
    })

@app.route('/api/samples')
def get_samples():
    top_genes = [c for c in df.columns if c not in ['samples', 'type']][:5]
    result = []
    for _, row in df.iterrows():
        result.append({
            "sample_id": int(row['samples']),
            "subtype": row['type'],
            "genes": {g: round(row[g], 3) for g in top_genes}
        })
    return jsonify({"samples": result, "gene_columns": top_genes})

# changed port to listen to render 
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)