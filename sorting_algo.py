import heapq
import datetime

class TaskScheduler:
    def __init__(self):
        self.task_queue = []  # Min-heap for sorting tasks dynamically
        self.failed_tasks = []  # List to store tasks that miss the deadline
        self.current_time = datetime.datetime.now()
        self.task_id = 1  # Auto-incrementing task ID
        self.schedule = []  # Stores scheduled tasks with start & end times (FCFS priority)
    
    def add_task(self):
        task_name = input("Enter task name: ")
        urgency = input("Enter urgency (High, Medium, Low): ")
        estimated_duration = int(input("Enter estimated duration (in hours): "))
        deadline = input("Enter deadline (YYYY-MM-DD HH:MM): ")
        
        # Convert inputs
        urgency_priority = {"High": 1, "Medium": 2, "Low": 3}
        deadline_dt = datetime.datetime.strptime(deadline, "%Y-%m-%d %H:%M")
        
        # First-Come, First-Serve (FCFS) Scheduling
        if not self.schedule:
            start_time = self.current_time
        else:
            start_time = max(self.schedule[-1]["end"], self.current_time)
        
        end_time = start_time + datetime.timedelta(hours=estimated_duration)
        
        # Check if task can be completed before the deadline
        if end_time > deadline_dt:
            self.failed_tasks.append((task_name, urgency, estimated_duration, deadline_dt))
            print(f"Task '{task_name}' cannot be completed before the deadline and has been moved to failed tasks.")
            return
        
        # Add task to schedule using FCFS priority
        heapq.heappush(self.task_queue, (self.task_id, urgency_priority[urgency], deadline_dt, task_name, estimated_duration, start_time, end_time))
        self.schedule.append({"task_name": task_name, "start": start_time, "end": end_time})
        self.task_id += 1
        print("Task added successfully!")
        self.show_schedule()

    def show_schedule(self):
        if not self.task_queue:
            print("No tasks available.")
            return
        
        print("\nOptimized Task Schedule (FCFS Priority):")
        sorted_tasks = sorted(self.task_queue)
        for i, task in enumerate(sorted_tasks, 1):
            task_id, urgency, deadline, task_name, duration, start_time, end_time = task
            print(f"{i}. {task_name} (Urgency: {urgency}, Deadline: {deadline}, Start Time: {start_time}, End Time: {end_time}, Duration: {duration} hrs)")
        print("\n")
    
    def show_failed_tasks(self):
        if not self.failed_tasks:
            print("No tasks missed the deadline or had conflicts.")
            return
        
        print("\nTasks That Could Not Be Completed:")
        for task in self.failed_tasks:
            print(f"Task: {task[0]}, Urgency: {task[1]}, Estimated Duration: {task[2]} hrs, Deadline: {task[3]}")
        print("\n")
    
    def run(self):
        while True:
            choice = input("Do you want to add a new task? (yes/no): ").strip().lower()
            if choice == "yes":
                self.add_task()
            else:
                print("Exiting scheduler.")
                self.show_failed_tasks()
                break

if __name__ == "__main__":
    scheduler = TaskScheduler()
    scheduler.run()
