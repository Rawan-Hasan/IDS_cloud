# backend/app.py
from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from io import StringIO

app = Flask(__name__)

# Load models
rf_model = joblib.load('models/rf_model.joblib')
knn_model = joblib.load('models/knn_model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.get_json()
        
        # Convert to DataFrame
        df = pd.read_csv(StringIO(data['csv_data']))
        
        # Preprocess (assuming same preprocessing as training)
        # You should include your preprocessing steps here
        
        # Make predictions
        rf_pred = rf_model.predict(df)
        rf_proba = rf_model.predict_proba(df)[:, 1]
        
        knn_pred = knn_model.predict(df)
        knn_proba = knn_model.predict_proba(df)[:, 1]
        
        # Prepare response
        response = {
            'rf_prediction': rf_pred.tolist(),
            'rf_probability': rf_proba.tolist(),
            'knn_prediction': knn_pred.tolist(),
            'knn_probability': knn_proba.tolist()
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/')
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)