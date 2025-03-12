# Advanced Fraud Detection System

A comprehensive fraud detection system with machine learning models and an interactive dashboard for real-time fraud monitoring and prediction.

# Fraud Detection in E-Commerce and Banking Transactions

## Business Need

Adey Innovations Inc., a leader in the financial technology sector, aims to enhance fraud detection in e-commerce and bank credit transactions. Fraudulent activities lead to significant financial losses and erode trust in financial systems. This project focuses on developing robust machine learning models for real-time fraud detection by leveraging geolocation analysis and transaction pattern recognition. By improving fraud detection capabilities, Adey Innovations Inc. will enhance transaction security, prevent financial losses, and foster confidence among customers and financial institutions.

## Data and Features

The project utilizes the following datasets:

1. **fraud_data.csv** (E-commerce transaction data):
   - Transaction details: user_id, purchase_value, device_id, browser, source.
   - User details: sex, age.
   - Timestamps: signup_time, purchase_time.
   - Geolocation: ip_address (linked to country using IpAddress_to_Country.csv).
   - Target variable: class (1 for fraud, 0 for non-fraud).

2. **creditcard.csv** (Bank transaction data):
   - Time-based: Time.
   - Anonymized PCA features: V1 to V28.
   - Transaction amount: Amount.
   - Target variable: Class (1 for fraud, 0 for non-fraud).

## Methodology

The project is divided into five key tasks:

### Task 1: Data Analysis and Preprocessing

1. **Handling Missing Values**:
   - Imputation and removal of missing data.
2. **Data Cleaning**:
   - Removing duplicates and correcting data types.
3. **Exploratory Data Analysis (EDA)**:
   - Univariate and bivariate analysis.
   - Geolocation-based fraud distribution.
4. **Feature Engineering**:
   - Transaction frequency and velocity analysis.
   - Time-based features: hour_of_day, day_of_week.
   - Normalization and scaling.
   - Encoding categorical variables.
   - Behavioral features: Tracking transaction frequency and changes in user behavior.
   - Graph-based features: Identifying fraud rings through device-sharing analysis.
   - Anomaly scores: Using Isolation Forest for fraud detection.

### Task 2: Model Building and Training

1. **Data Preparation**:
   - Separation of features and target variables.
   - Train-test split.
2. **Model Selection**:
   - Hybrid Model (XGBoost + LSTM):
     - Advantages:
       - Efficiency:
         - XGBoost handles structured data efficiently.
         - LSTM captures temporal patterns in sequential data.
       - Power:
         - Combines the strengths of both models for better overall performance.
         - Can detect both static and dynamic fraud patterns.
       - Flexibility:
         - Can be extended to include additional models or features.
   - Traditional models: Random Forest, Logistic Regression.
   - Advanced models: LightGBM, CatBoost.
   - Anomaly detection models and autoencoders.
   - Cost-sensitive learning for handling imbalanced data.
3. **Model Training & Evaluation**:
   - Training models on both datasets.
   - Performance metrics: AUC-ROC, Precision-Recall.

### Task 3: Model Explainability

1. **SHAP (Shapley Additive Explanations)**:
   - Feature importance analysis.
   - Summary, force, and dependence plots.
2. **LIME (Local Interpretable Model-agnostic Explanations)**:
   - Individual prediction explanations.
   - Feature importance visualization.

### Task 4: Model Deployment and API Development

1. **Flask API Development**:
   - Setting up a Flask application (serve_model.py).
   - Defining API endpoints for fraud detection.
   - Testing API responses.
2. **Dockerization**:
   - Creating a Dockerfile.
   - Building and running the container:
     ```
     docker build -t fraud-detection-model .
     docker run -p 5000:5000 fraud-detection-model
     ```
   - Implementing logging for monitoring.
3. **Deployment Enhancements**:
   - Using Kafka or Redis for real-time fraud detection instead of batch processing.
   - Adding automated model retraining pipelines.

### Task 5: Dashboard Development

1. **Flask Backend**:
   - Serving fraud detection insights via API endpoints.
2. **React + TypeScript + Vite Frontend**:
   - Data visualizations: Utilizing Recharts and D3.js.
   - Business-friendly metrics:
     - Heatmaps for fraud hotspots.
     - Custom alert thresholds based on fraud probability.
   - Enhanced user experience:
     - Interactive dashboards.
     - Filters for real-time data insights.

## Learning Outcomes

1. **Machine Learning & MLOps**:
   - Model selection and training for fraud detection.
   - Explainability using SHAP and LIME.
   - Experiment tracking with MLflow.
   - Implementation of anomaly detection models.
2. **Software Development**:
   - Building and deploying REST APIs with Flask.
   - Containerization with Docker.
   - Implementing real-time fraud detection with Kafka/Redis.
3. **Data Analysis & Visualization**:
   - EDA and feature engineering.
   - Fraud insights visualization using Dash, Recharts, and D3.js.
4. **Knowledge Gained**:
   - Model deployment and serving principles.
   - Best practices for API development and security.
   - Real-time fraud prediction and monitoring techniques.

## Conclusion

This project successfully developed an advanced fraud detection system using machine learning models, explainability techniques, and real-time monitoring solutions. By integrating Flask, Docker, Kafka, and a React-based dashboard, Adey Innovations Inc. can deploy scalable fraud detection solutions that enhance security and trust in financial transactions.

## Future Improvements

1. **Real-Time Anomaly Detection**:
   - Implement adaptive fraud prevention using real-time anomaly detection.
2. **Reinforcement Learning (RL)**:
   - Integrate RL for continuous fraud adaptation.
3. **Enhanced Geolocation Intelligence**:
   - Refine fraud pattern detection using advanced geolocation analysis.
4. **Automated Retraining Pipelines**:
   - Set up pipelines for automated model retraining to keep the system up-to-date.
5. **Graph-Based Fraud Detection**:
   - Enhance fraud ring detection using graph-based algorithms.
6. **Attention Mechanisms in LSTM**:
   - Use attention mechanisms in the LSTM to focus on important time steps.
7. **Automated Hyperparameter Tuning**:
   - Implement automated hyperparameter optimization for model performance.

## Project Overview

This project implements an end-to-end fraud detection system with the following components:

1. **Machine Learning Models**: LightGBM-based fraud detection model with SHAP explainability
2. **API Service**: Flask-based API for model serving and predictions
3. **Interactive Dashboard**: React-based dashboard with visualization tools

## Repository Structure

```
├── api/                      # Flask API for model serving
│   ├── Dockerfile            # Docker configuration for API
│   ├── requirements.txt      # Python dependencies
│   └── serve_model.py        # API implementation
├── fraud-dashboard/          # React frontend
│   ├── src/                  # Source code
│   │   ├── api/              # API client
│   │   ├── components/       # UI components
│   │   ├── pages/            # Dashboard pages
│   │   └── types/            # TypeScript type definitions
├── notebooks/                # Jupyter notebooks for model development
│   └── Task3-Model Training & Evaluation.ipynb  # Model training notebook
```

## Features

- **Fraud Detection Model**: High-performance LightGBM model for detecting fraudulent transactions
- **Model Explainability**: SHAP-based explanations for model predictions
- **Interactive Dashboard**:
  - Real-time fraud metrics and KPIs
  - Advanced visualizations (3D Area Chart, Radar Chart, Stacked Bar Chart)
  - Transaction monitoring
  - Real-time fraud prediction tool

## Technologies Used

- **Backend**:
  - Python
  - Flask
  - LightGBM
  - SHAP
  - Pandas, NumPy, Scikit-learn

- **Frontend**:
  - React
  - TypeScript
  - Material-UI
  - Recharts
  - Nivo

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/NAV-369/Advanced-Fraud-Detection-AI_Model.git
   cd Advanced-Fraud-Detection-AI_Model
   ```

2. Set up the Python environment:
   ```
   python -m venv shared_env
   source shared_env/bin/activate  # On Windows: shared_env\Scripts\activate
   pip install -r api/requirements.txt
   ```

3. Set up the frontend:
   ```
   cd fraud-dashboard
   npm install
   ```

### Running the Application

1. Start the API server:
   ```
   cd api
   python serve_model.py
   ```

2. Start the frontend development server:
   ```
   cd fraud-dashboard
   npm run dev
   ```

3. Access the dashboard at http://localhost:5173

## Dashboard Features

- **Overview**: Key metrics, fraud activity patterns, and trends
- **Advanced Analytics**: Detailed fraud analysis with interactive visualizations
- **Transactions**: Monitoring of recent transactions with risk scores
- **Prediction**: Real-time fraud risk assessment tool

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- SHAP library for model explainability
- LightGBM for high-performance gradient boosting
- React and Material-UI for the frontend implementation

# Fraud Detection Dashboard

A real-time fraud detection dashboard built with React and Flask, providing interactive visualizations and insights for transaction monitoring and fraud analysis.

## Features

- **Real-time Transaction Monitoring**
  - View key metrics including total transactions, fraud rate, and average transaction value
  - Interactive time series visualization of fraud patterns
  - Transaction table with detailed information and fraud probability scores

- **Interactive Visualizations**
  - Radar chart showing fraud patterns by day of the week
  - Stacked bar chart displaying fraud distribution across time blocks
  - Heat map visualization of transaction patterns

- **Fraud Prediction**
  - Real-time fraud probability assessment for new transactions
  - Input form for transaction details
  - Instant feedback on transaction risk level

## Technology Stack

- **Frontend**
  - React with TypeScript
  - Material-UI for component styling
  - Nivo for data visualizations
  - Axios for API communication

- **Backend**
  - Flask API server
  - Scikit-learn for machine learning model
  - Pandas for data processing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd fraud-detection
   ```

2. Set up the frontend:
   ```bash
   cd fraud-dashboard
   npm install
   ```

3. Set up the backend:
   ```bash
   cd ../api
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the Flask API server:
   ```bash
   cd api
   python app.py
   ```
   The API will be available at `http://localhost:5000`

2. Start the React development server:
   ```bash
   cd fraud-dashboard
   npm run dev
   ```
   The dashboard will be available at `http://localhost:5173`

## Using the Dashboard

### Main Dashboard

The main dashboard displays:
- Key performance metrics at the top
- Fraud activity visualization (switchable between daily patterns and time block distribution)
- Transaction table showing recent transactions
- Prediction form for assessing new transactions

### Making Predictions

To assess a new transaction:
1. Navigate to the prediction form
2. Enter the transaction details:
   - Transaction amount
   - Merchant category
   - Time of day
   - Additional relevant features
3. Submit the form to receive a fraud probability score

### Interpreting Visualizations

- **Radar Chart**: Shows fraud patterns across days of the week, helping identify high-risk periods
- **Stacked Bar Chart**: Displays fraud distribution across time blocks (morning, afternoon, evening, night)
- **Transaction Table**: Lists recent transactions with details and fraud probability scores

## Development

### Project Structure

```
fraud-detection/
├── api/                 # Flask backend
│   ├── app.py          # Main API server
│   ├── model/          # ML model files
│   └── requirements.txt
└── fraud-dashboard/    # React frontend
    ├── src/
    │   ├── components/ # React components
    │   ├── api/        # API services
    │   └── types/      # TypeScript definitions
    └── package.json
```

### API Endpoints

- `GET /api/metrics` - Retrieve dashboard metrics
- `GET /api/transactions` - Get recent transactions
- `POST /api/predict` - Submit transaction for fraud prediction

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
