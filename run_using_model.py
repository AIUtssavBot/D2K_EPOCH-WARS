import pandas as pd
import joblib  # Import joblib for loading the model

# Load the trained model from the .pkl file
model = joblib.load('trained_model.pkl')
print("Model loaded successfully.")

# Function to predict activity status based on user input
def predict_activity_status(input_values):
    # Convert input values to DataFrame
    input_df = pd.DataFrame([input_values])
    
    # Use the model to predict
    prediction = model.predict(input_df)
    return 'Active' if prediction[0] == 1 else 'Inactive'

# Gather user input for prediction
def get_user_input():
    input_values = {}
    input_values['role'] = int(input("Enter role (numeric value): "))
    input_values['assigned_team'] = int(input("Enter assigned team (numeric value): "))
    input_values['access_level'] = int(input("Enter access level (numeric value): "))
    input_values['team_user_count'] = int(input("Enter team user count (numeric value): "))
    input_values['workload_hours'] = int(input("Enter workload hours (numeric value): "))
    input_values['created_month'] = int(input("Enter created month (1-12): "))
    input_values['created_year'] = int(input("Enter created year (e.g., 2025): "))
    input_values['created_day'] = int(input("Enter created day (1-31): "))
    input_values['last_login_year'] = int(input("Enter last login year (e.g., 2025): "))
    input_values['last_login_month'] = int(input("Enter last login month (1-12): "))
    input_values['last_login_day'] = int(input("Enter last login day (1-31): "))
    
    return input_values

# Get user input
user_input_values = get_user_input()

# Predict activity status based on user input
status = predict_activity_status(user_input_values)
print(f'Predicted Activity Status: {status}')


#'role': 2,
#     'assigned_team': 4,
#     'access_level': 1,
#     'team_user_count': 59,
#     'workload_hours': 4,
#     'created_month': 3,
#     'created_year': 2025,
#     'created_day': 12,
#     'last_login_year': 2025,
#     'last_login_month': 2,
#     'last_login_day': 12