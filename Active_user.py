import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

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

# Print a message indicating that the model has been trained
print("Model trained on the entire dataset.")

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


