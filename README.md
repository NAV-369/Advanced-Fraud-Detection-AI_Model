# Advanced Fraud Detection AI Model

This project implements an advanced fraud detection system using a hybrid approach combining XGBoost and LSTM models. The system analyzes both static and sequential transaction patterns to identify fraudulent activities.

## Features

- Hybrid model architecture (XGBoost + LSTM)
- Real-time transaction analysis
- Sequential pattern recognition
- Advanced feature engineering
- MLOps implementation with MLflow

## Project Structure

```
fraud-detection/
├── data/               # Data files (not tracked in git)
├── notebooks/          # Jupyter notebooks
├── models/            # Saved models (not tracked in git)
└── README.md          # Project documentation
```

## Setup

1. Create a virtual environment:
```bash
conda create -n fraud_env python=3.10
conda activate fraud_env
```

2. Install dependencies:
```bash
pip install tensorflow scikit-learn pandas numpy xgboost mlflow jupyter
```

3. Run Jupyter Notebook:
```bash
jupyter notebook
```

## Model Architecture

The project uses a hybrid approach:
- XGBoost: For static feature analysis
- LSTM: For sequential pattern detection
- Meta-model: Combines predictions from both models

## Performance Metrics

- AUC-ROC Score
- Precision-Recall Curve
- Confusion Matrix
- F1-Score

## MLOps Implementation

- Experiment tracking with MLflow
- Model versioning
- Performance monitoring
- Automated metrics logging

## License

MIT License
