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

    scheduled_df.to_csv(TASKS_FILE, index=False, mode='w', header=True)  # Overwrite with latest schedule
    failed_df.to_csv(FAILED_TASKS_FILE, index=False, mode='w', header=True)  # Overwrite failed tasks

def load_tasks(filename):
    """Loads tasks from a CSV file, converting deadlines from string to datetime."""
    tasks = []
    if os.path.exists(filename):
        with open(filename, mode='r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                row['task_id'] = int(row['task_id'])
                row['priority'] = int(row['priority'])
                row['est_time'] = int(row['est_time'])
                row['deadline'] = datetime.strptime(row['deadline'], "%Y-%m-%d %H:%M")
                tasks.append(row)
    return tasks

def get_unique_task_id(existing_tasks):
    """Generates a unique task ID."""
    existing_ids = {task["task_id"] for task in existing_tasks}
    new_id = 1
    while new_id in existing_ids:
        new_id += 1
    return new_id

def schedule_tasks(tasks):
    """Schedules tasks dynamically to prioritize higher-priority tasks before deadlines."""
    
    current_time = datetime.now()  # Start scheduling from the current time
    
    # Convert deadline from string to datetime if needed
    for task in tasks:
        if isinstance(task['deadline'], str):
            task['deadline'] = datetime.strptime(task['deadline'], "%Y-%m-%d %H:%M")

    # Sort tasks based on:
    # 1. Higher priority (lower value = more urgent)
    # 2. Earliest deadline (complete urgent tasks before they expire)
    # 3. Shortest duration (fit more tasks in available time)
    tasks.sort(key=lambda x: (x['priority'], x['deadline'], x['est_time']))

    scheduled = []  # Successfully scheduled tasks
    failed = []  # Tasks that couldn't be scheduled due to conflicts

    user_task_end_times = {}  # Track last end time for each user

    for task in tasks:
        user_id = task['user_id']

        # Start scheduling from current time or after the last scheduled task for this user
        start_time = max(current_time, user_task_end_times.get(user_id, current_time))
        end_time = start_time + timedelta(hours=task['est_time'])

        # Ensure we don't schedule a lower-priority task before a higher-priority one
        if end_time <= task['deadline']:
            scheduled.append({
                "task_id": task['task_id'],
                "user_id": task['user_id'],
                "task_name": task['task_name'],
                "priority": task['priority'],
                "est_time": task['est_time'],
                "deadline": task['deadline'].strftime("%Y-%m-%d %H:%M"),
                "start_time": start_time.strftime("%Y-%m-%d %H:%M"),  # Store actual start time
                "end_time": end_time.strftime("%Y-%m-%d %H:%M")  # Store actual end time
            })
            user_task_end_times[user_id] = end_time  # Update last scheduled end time for this user
        else:
            failed.append(task)  # Task couldn't be scheduled before the deadline

    return scheduled, failed

def main():
    tasks = load_tasks(TASKS_FILE)

    while True:
        task_id = get_unique_task_id(tasks)  # Auto-generate unique task ID
        user_id = input("Enter user ID: ")  # Keep user input for user identification
        task_name = input("Enter task name: ")
        priority = int(input("Enter priority (lower number = more urgent): "))
        est_time = int(input("Enter estimated time (hours): "))
        deadline_str = input("Enter deadline (YYYY-MM-DD HH:MM): ")
        deadline = datetime.strptime(deadline_str, "%Y-%m-%d %H:%M")

        tasks.append({
            "task_id": task_id,  # Automatically assigned
            "user_id": user_id,
            "task_name": task_name,
            "priority": priority,
            "est_time": est_time,
            "deadline": deadline
        })

        scheduled, failed = schedule_tasks(tasks)
        save_to_csv(scheduled, failed)  # Save latest schedule to CSV

        print("\n✅ Optimized Task Order:")
        for task in scheduled:
            print(f"{task['task_name']} (ID: {task['task_id']}, Start: {task['start_time']}, End: {task['end_time']}, Deadline: {task['deadline']}, Priority: {task['priority']})")

        print("\n❌ Failed Tasks:")
        for task in failed:
            print(f"{task['task_name']} (ID: {task['task_id']}, Missed Deadline: {task['deadline']})")

        cont = input("Do you want to add another task? (yes/no): ").strip().lower()
        if cont != 'yes':
            break

if __name__ == "__main__":
    main()
