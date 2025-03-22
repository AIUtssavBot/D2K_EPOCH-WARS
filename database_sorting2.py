import csv
import os
import random
from datetime import datetime, timedelta

# Define the CSV file
TASKS_FILE = "tasks1.csv"
POPULATION_SIZE = 10
GENERATIONS = 50
MUTATION_RATE = 0.1

def save_to_csv(tasks):
    """Saves tasks to a CSV file, updating existing entries instead of duplicating."""
    fieldnames = ["task_id", "task_name", "priority", "est_time", "deadline", "assigned", "start_time", "end_time"]
    existing_tasks = load_tasks()
    task_dict = {task["task_id"]: task for task in existing_tasks}
    
    for task in tasks:
        task_dict[task["task_id"]] = {
            **task,
            'start_time': task['start_time'].isoformat() if task['start_time'] else None,
            'end_time': task['end_time'].isoformat() if task['end_time'] else None
        }  # Update existing or add new
    
    with open(TASKS_FILE, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(task_dict.values())

def load_tasks():
    """Loads tasks from CSV, parsing necessary fields."""
    tasks = []
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, mode='r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                row['priority'] = int(row['priority'])
                row['est_time'] = int(row['est_time'])
                row['deadline'] = datetime.strptime(row['deadline'], "%Y-%m-%d %H:%M:%S")
                row['assigned'] = row['assigned'] == 'True'
                row['start_time'] = datetime.fromisoformat(row['start_time']) if row.get('start_time') else None
                row['end_time'] = datetime.fromisoformat(row['end_time']) if row.get('end_time') else None
                tasks.append(row)
    return tasks

def initialize_population(tasks):
    """Generates an initial population of random schedules."""
    if not tasks:
        return []
    population = []
    for _ in range(POPULATION_SIZE):
        schedule = sorted(tasks, key=lambda x: (random.random(), -x['priority'], x['deadline']))
        population.append(schedule)
    return population

def fitness(schedule):
    """Calculates fitness based on priority, deadlines, and non-overlapping schedule."""
    if not schedule:
        return -1
    score = 0
    time_tracker = {}
    
    for task in schedule:
        start_time = max(datetime.now(), time_tracker.get(task['task_name'], datetime.now()))
        end_time = start_time + timedelta(hours=task['est_time'])
        
        if end_time <= task['deadline']:
            score += task['priority']
            time_tracker[task['task_name']] = end_time
        else:
            return -1  # Penalize if deadline missed
    return score

def crossover(parent1, parent2):
    """Performs crossover by swapping parts of the parents."""
    split = len(parent1) // 2
    child = parent1[:split] + [task for task in parent2 if task not in parent1[:split]]
    return child

def mutate(schedule):
    """Randomly swaps two tasks in the schedule, ensuring no duplicates."""
    if random.random() < MUTATION_RATE and len(schedule) > 1:
        idx1, idx2 = random.sample(range(len(schedule)), 2)
        schedule[idx1], schedule[idx2] = schedule[idx2], schedule[idx1]
    
    # Ensure no duplicates after mutation
    seen = set()
    unique_schedule = []
    for task in schedule:
        task_tuple = (task['task_id'], task['task_name'])  # Create a tuple of unique identifiers
        if task_tuple not in seen:
            seen.add(task_tuple)
            unique_schedule.append(task)
    
    return unique_schedule

def genetic_algorithm(tasks):
    """Runs the genetic algorithm for task scheduling."""
    if not tasks:
        return []
    if len(tasks) == 1:
        task = tasks[0]
        start_time = datetime.now()
        end_time = start_time + timedelta(hours=task['est_time'])
        task['start_time'] = start_time
        task['end_time'] = end_time
        task['assigned'] = end_time <= task['deadline']
        return [task]
    
    population = initialize_population(tasks)
    if not population:
        return []
    
    for _ in range(GENERATIONS):
        population = [schedule for schedule in population if schedule]  # Remove empty schedules
        if not population:
            break
        population.sort(key=fitness, reverse=True)
        new_gen = []
        
        for i in range(0, len(population) - 1, 2):
            child1 = crossover(population[i], population[i + 1])
            child2 = crossover(population[i + 1], population[i])
            new_gen.extend([mutate(child1), mutate(child2)])
        
        population = new_gen[:POPULATION_SIZE] if new_gen else population
    
    best_schedule = max(population, key=fitness, default=[])
    if not best_schedule:
        return []
    
    current_time = datetime.now()
    assigned_tasks = []
    unassigned_tasks = []
    
    for task in best_schedule:
        start_time = current_time
        end_time = start_time + timedelta(hours=task['est_time'])
        if end_time <= task['deadline']:
            task['assigned'] = True
            task['start_time'] = start_time
            task['end_time'] = end_time
            assigned_tasks.append(task)
            current_time = end_time
        else:
            task['assigned'] = False
            unassigned_tasks.append(task)
    
    return assigned_tasks + unassigned_tasks

def main():
    tasks = load_tasks()
    task_id = len(tasks) + 1
    
    while True:
        task_name = input("Enter task name: ")
        priority = int(input("Enter priority (higher = more urgent): "))
        est_time = int(input("Enter estimated time (hours): "))
        deadline_str = input("Enter deadline (YYYY-MM-DD HH:MM:SS): ")
        deadline = datetime.strptime(deadline_str, "%Y-%m-%d %H:%M:%S")
        
        new_task = {
            "task_id": str(task_id),
            "task_name": task_name,
            "priority": priority,
            "est_time": est_time,
            "deadline": deadline,
            "assigned": False,
            "start_time": None,
            "end_time": None
        }
        
        existing_tasks = {task['task_id'] for task in tasks}
        if str(task_id) not in existing_tasks:
            tasks.append(new_task)
            task_id += 1
        
        optimized_schedule = genetic_algorithm(tasks)
        save_to_csv(optimized_schedule)
        
        print("\n✅ Optimized Task Order:")
        for task in optimized_schedule:
            if task['assigned']:
                print(f"{task['task_name']} (Start: {task['start_time']}, End: {task['end_time']}, Deadline: {task['deadline']}, Priority: {task['priority']})")
        
        print("\n❌ Unassigned Tasks:")
        for task in optimized_schedule:
            if not task['assigned']:
                print(f"{task['task_name']} (Missed Deadline: {task['deadline']})")
        
        cont = input("Do you want to add another task? (yes/no): ").strip().lower()
        if cont != 'yes':
            break

if __name__ == "__main__":
    main()