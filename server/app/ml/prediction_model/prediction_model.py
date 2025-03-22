import joblib
import pandas as pd
from pathlib import Path
from fastapi import HTTPException

# Load the trained model
try:
    model_path = Path(__file__).parent / "prediction_model.pkl"
    model = joblib.load(model_path)
    # Get feature names from the model
    feature_names = model.feature_names_in_ if hasattr(model, 'feature_names_in_') else [
        'role', 'assigned_team', 'access_level', 'created_month',
        'team_user_count', 'workload_hours', 'created_year', 'created_day',
        'last_login_year', 'last_login_month', 'last_login_day'
    ]
except Exception as e:
    raise RuntimeError(f"Failed to load model: {str(e)}")

def predict(input_data: dict):
    try:
        # Create DataFrame with correct column order
        input_df = pd.DataFrame([input_data])
        
        # Ensure all required columns are present
        for col in feature_names:
            if col not in input_df.columns:
                input_df[col] = 0  # Fill missing columns with default value
                
        # Reorder columns to match training data
        input_df = input_df[feature_names]
        
        # Make prediction
        prediction = model.predict(input_df)
        probabilities = model.predict_proba(input_df)
        print("Prediction Probabilities:", probabilities)  # Debugging output
        return "active" if prediction[0] == 1 else "inactive"
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )