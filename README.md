# TCGA Breast Cancer Gene Expression Visualizer

**Live Demo:** [tcga-model-frontend.onrender.com](https://tcga-model-frontend.onrender.com/)

---

> One simple question: Can software uncover patterns in clinical research that are difficult to detect through traditional analysis?

When conducting research, collecting, organizing, and analyzing data can be incredibly tedious. This platform takes gene expression data from 151 real breast cancer patients across 54,675 genes and turns it into something you can actually see, explore, and predict from. Built with React, Flask, and a machine learning classifier, it transforms raw genomic data into interactive visualizations that reveal intriguing patterns and surfaces surprising results you wouldn't find staring at a spreadsheet.

---

## Overview

An interactive full-stack platform for exploring breast cancer gene expression data from 151 real patient samples across 54,675 genomic features. Built from scratch with React, Flask, and a machine learning pipeline that classifies cancer subtypes with **96.77% accuracy**.

![Dashboard Screenshot](https://github.com/user-attachments/assets/8f99cf48-d29f-43aa-beac-d1ffa3b4cebf)

---

## Visualizations

Graphing and visualizing data has been around as far back as the 17th century with ancient roots. This visualizer doesn't just display data — it lets researchers explore their curiosities, zoom in on specific genetic markers, and compare predictions to actual outcomes for further testing.

![Visualization 1](https://github.com/user-attachments/assets/60e259aa-7440-43ba-a06c-291812948a0d)

![Visualization 2](https://github.com/user-attachments/assets/3c8c181f-dc00-46ee-89cf-5e1d3d9e28dd)

---

## Why I Built This

Since high school, I've been building websites, learning new languages, and exploring Stack Overflow. But over time, I realized I wanted to do more than just deliver and improve features — I wanted to build something that could make a tangible impact.

At Northeastern, I was surrounded by friends on the pre-med track. At first, their world felt completely different from mine. But the more I listened, the more I realized something important: our fields weren't so different — they were complementary and could amplify each other. The challenges they faced in understanding complex clinical data were problems I could help solve through my technical skills in software.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Flask |
| ML Pipeline | Scikit-learn (96.77% accuracy) |
| Deployment | Netlify + Render |

---

## Architecture & Process

```
TCGA RNA-Seq Dataset (54,675 genes × 151 patients)
        │
        ▼
┌─────────────────────────────┐
│     Data Processing Layer   │
│  Pandas · SciPy · Scikit-learn │
│  - Variance filtering       │
│  - Clustering (unsupervised)│
│  - Feature normalization    │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│     ML Classification       │
│      Random Forest          │
│   96.77% accuracy across    │
│   54,675 genomic features   │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│      Flask REST API         │
│  - Serves predictions       │
│  - Exposes gene expression  │
│    data via JSON endpoints  │
│  Deployed on Render         │
└────────────┬────────────────┘
             │  HTTP (JSON)
             ▼
┌─────────────────────────────┐
│      React Frontend         │
│  Recharts · Dynamic filters │
│  - Interactive visualizations│
│  - Subtype comparisons      │
│  - Prediction vs. actual    │
│  Deployed on Netlify        │
└─────────────────────────────┘
```

### How It Works

1. **Data ingestion** — Raw RNA-Seq expression data from 151 TCGA breast cancer patients is loaded and processed using Pandas and SciPy.
2. **Preprocessing** — Gene features are normalized and filtered; clustering is applied to surface natural groupings across the high-dimensional feature space.
3. **Classification** — A Random Forest model trained on the processed data classifies breast cancer subtypes with 96.77% accuracy across 54,675 features.
4. **API layer** — Flask exposes RESTful endpoints that serve both raw expression data and model predictions as JSON.
5. **Visualization** — The React frontend fetches from the Flask API and renders interactive charts (via Recharts), allowing users to filter by gene, zoom into markers, and compare predicted vs. actual cancer subtypes.

---

## Deployment

- **Frontend:** Netlify
- **Backend:** Render
