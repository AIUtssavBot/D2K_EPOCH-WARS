import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib  # Import joblib for saving the model

# Load the dataset
data = pd.read_csv('processed_user_data_Smote.csv')

# Print the column names to verify
print("Columns in the dataset:", data.columns.tolist())

# Convert date-time columns to datetime objects
data['created_at'] = pd.to_datetime(data['created_at'])
data['last_login'] = pd.to_datetime(data['last_login'])

# Extract features from date-time columns
data['created_year'] = data['created_at'].dt.year
data['created_month'] = data['created_at'].dt.month
data['created_day'] = data['created_at'].dt.day
data['last_login_year'] = data['last_login'].dt.year
data['last_login_month'] = data['last_login'].dt.month
data['last_login_day'] = data['last_login'].dt.day

# Drop original date-time columns
data.drop(columns=['created_at', 'last_login'], inplace=True)

# Convert 'activity_status' to numerical values
data['activity_status'] = data['activity_status'].map({'Active': 1, 'Inactive': 0})

# Check if the columns to drop exist before dropping
columns_to_drop = ['user_id', 'full_name', 'email', 'phone_number']
existing_columns_to_drop = [col for col in columns_to_drop if col in data.columns]

# Drop any irrelevant columns or handle missing values
data.drop(columns=existing_columns_to_drop, inplace=True)
data.fillna(0, inplace=True)  # Example of handling missing values

# Define features and target variable
X = data.drop('activity_status', axis=1)
y = data['activity_status']

# Initialize the Random Forest Classifier
model = RandomForestClassifier()

# Fit the model on the entire dataset
model.fit(X, y)

# Save the model to a .pkl file
joblib.dump(model, 'trained_model.pkl')
print("Model saved as 'trained_model.pkl'.")

# Function to predict activity status
def predict_activity_status(input_values):
    input_df = pd.DataFrame([input_values], columns=X.columns)
    prediction = model.predict(input_df)
    return 'Active' if prediction[0] == 1 else 'Inactive'

# Example input values for prediction
input_values = {
    'role': 2,
    'assigned_team': 4,
    'access_level': 1,
    'created_month': 3,
    'team_user_count': 59,
    'workload_hours': 4,
    'created_year': 2025,
    'created_day': 12,
    'last_login_year': 2025,
    'last_login_month': 2,
    'last_login_day': 12
}

# Predict activity status
status = predict_activity_status(input_values)
print(f'Predicted Activity Status: {status}')

# Load the model from the .pkl file
loaded_model = joblib.load('trained_model.pkl')

# # Use the loaded model for predictions
# status2 = loaded_model.predict(input_values)  # input_df should be prepared similarly as before
# print(f'Predicted Activity Status: {status2}')

# Load the model from the .pkl file
loaded_model = joblib.load('trained_model.pkl')

# Convert input values to DataFrame
input_df = pd.DataFrame([input_values])

# This is important to avoid any shape mismatch
input_df = input_df[X.columns]  # X.columns contains the feature names used in training

# Use the loaded model for predictions
status2 = loaded_model.predict(input_df)

# Print the predicted activity status
print(f'Predicted Activity Status: {"Active" if status2[0] == 1 else "Inactive"}')