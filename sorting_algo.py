import heapq
import datetime

class TaskScheduler:
    def __init__(self):
        self.task_queue = []  # Min-heap for sorting tasks dynamically
        self.task_id = 1  # Auto-incrementing task ID

    def add_task(self):
        task_name = input("Enter task name: ")
        urgency = input("Enter urgency (High, Medium, Low): ")
        estimated_duration = int(input("Enter estimated duration (in hours): "))
        deadline = input("Enter deadline (YYYY-MM-DD HH:MM): ")
        
        # Convert inputs
        urgency_priority = {"High": 1, "Medium": 2, "Low": 3}
        deadline_dt = datetime.datetime.strptime(deadline, "%Y-%m-%d %H:%M")
        
        # Push task into priority queue (sorted by urgency, then deadline)
        heapq.heappush(self.task_queue, (urgency_priority[urgency], deadline_dt, self.task_id, task_name, estimated_duration))
        self.task_id += 1
        print("Task added successfully!")
        self.show_schedule()

    def show_schedule(self):
        if not self.task_queue:
            print("No tasks available.")
            return
        
        print("\nOptimized Task Schedule:")
        sorted_tasks = sorted(self.task_queue)
        for i, task in enumerate(sorted_tasks, 1):
            urgency, deadline, task_id, task_name, duration = task
            print(f"{i}. {task_name} (Urgency: {urgency}, Deadline: {deadline}, Estimated Duration: {duration} hrs)")
        print("\n")

    def run(self):
        while True:
            choice = input("Do you want to add a new task? (yes/no): ").strip().lower()
            if choice == "yes":
                self.add_task()
            else:
                print("Exiting scheduler.")
                break

if __name__ == "__main__":
    scheduler = TaskScheduler()
    scheduler.run()
