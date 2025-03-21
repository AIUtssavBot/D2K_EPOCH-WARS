import csv
import os
from datetime import datetime, timedelta
import pandas as pd

# Define CSV file names
TASKS_FILE = "tasks.csv"
FAILED_TASKS_FILE = "failed_tasks.csv"

def save_to_csv(scheduled, failed):
    """Appends new scheduled and failed tasks to CSV files."""
    scheduled_df = pd.DataFrame(scheduled)
    failed_df = pd.DataFrame(failed)

    # Append data to the CSV, writing headers only if the file is empty
    scheduled_df.to_csv(TASKS_FILE, index=False, mode='a', header=not os.path.exists(TASKS_FILE))
    failed_df.to_csv(FAILED_TASKS_FILE, index=False, mode='a', header=not os.path.exists(FAILED_TASKS_FILE))

def load_tasks(filename):
    """Loads tasks from a CSV file, converting deadlines from string to datetime."""
    tasks = []
    if os.path.exists(filename):
        with open(filename, mode='r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                row['est_time'] = int(row['est_time'])
                row['priority'] = int(row['priority'])
                row['deadline'] = datetime.strptime(row['deadline'], "%Y-%m-%d %H:%M")
                tasks.append(row)
    return tasks

def schedule_tasks(tasks):
    """Sorts and schedules tasks while ensuring no time clashes for a single user."""
    
    # Convert deadline from string to datetime if needed
    for task in tasks:
        if isinstance(task['deadline'], str):
            task['deadline'] = datetime.strptime(task['deadline'], "%Y-%m-%d %H:%M")

    # Sort by deadline first, then by priority (higher priority = lower numerical value)
    tasks.sort(key=lambda x: (x['deadline'], -int(x['priority'])))

    scheduled = []  # Successfully scheduled tasks
    failed = []  # Tasks that couldn't be scheduled due to conflicts

    user_task_end_times = {}  # Track last end time for each user

    for task in tasks:
        user_id = task['user_id']
        start_time = task['deadline']
        end_time = start_time + timedelta(hours=task['est_time'])

        # Check if the task can be scheduled without clashing
        if user_id not in user_task_end_times or user_task_end_times[user_id] <= start_time:
            scheduled.append(task)
            user_task_end_times[user_id] = end_time  # Update last end time for this user
        else:
            failed.append(task)  # Task clashes with an existing task

    return scheduled, failed

def main():
    tasks = load_tasks(TASKS_FILE)

    while True:
        task_id = len(tasks) + 1
        user_id = input("Enter user ID: ")
        task_name = input("Enter task name: ")
        priority = int(input("Enter priority (higher = more urgent): "))
        est_time = int(input("Enter estimated time (hours): "))
        deadline_str = input("Enter deadline (YYYY-MM-DD HH:MM): ")
        deadline = datetime.strptime(deadline_str, "%Y-%m-%d %H:%M")

        tasks.append({
            "task_id": task_id,
            "user_id": user_id,
            "task_name": task_name,
            "priority": priority,
            "est_time": est_time,
            "deadline": deadline
        })

        scheduled, failed = schedule_tasks(tasks)
        save_to_csv(scheduled, failed)  # Append new scheduled tasks to CSV

        print("\nOptimized Task Order:")
        for task in scheduled:
            print(f"{task['task_name']} (Deadline: {task['deadline']}, Priority: {task['priority']})")

        print("\nFailed Tasks:")
        for task in failed:
            print(f"{task['task_name']} (Missed Deadline: {task['deadline']})")

        cont = input("Do you want to add another task? (yes/no): ").strip().lower()
        if cont != 'yes':
            break

if __name__ == "__main__":
    main()
