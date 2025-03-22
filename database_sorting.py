import csv
import os
import random
from datetime import datetime, timedelta

# CSV file to store tasks
TASKS_FILE = "tasks.csv"
POPULATION_SIZE = 10
GENERATIONS = 50
MUTATION_RATE = 0.1

def load_tasks():
    """Loads tasks from the CSV file."""
    tasks = []
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, mode='r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                row['task_id'] = int(row['task_id'])
                row['priority'] = int(row['priority'])
                row['est_time'] = int(row['est_time'])
                row['deadline'] = datetime.strptime(row['deadline'], "%Y-%m-%d %H:%M")
                row['assigned'] = row['assigned'] == 'True'
                tasks.append(row)
    return tasks

def save_tasks(tasks):
    """Saves all tasks back to the CSV file."""
    with open(TASKS_FILE, mode='w', newline='') as file:
        fieldnames = ["task_id", "task_name", "priority", "est_time", "deadline", "assigned"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for task in tasks:
            writer.writerow({
                "task_id": task['task_id'],
                "task_name": task['task_name'],
                "priority": task['priority'],
                "est_time": task['est_time'],
                "deadline": task['deadline'].strftime("%Y-%m-%d %H:%M"),
                "assigned": task['assigned']
            })

def fitness(schedule):
    """Evaluates the fitness of a schedule based on priority and deadline adherence."""
    score = 0
    current_time = datetime.now()
    for task in schedule:
        start_time = current_time
        end_time = start_time + timedelta(hours=task['est_time'])
        if end_time <= task['deadline']:
            score += task['priority']  # Higher priority tasks contribute more
            task['assigned'] = True
            current_time = end_time
        else:
            task['assigned'] = False  # Mark unassignable tasks
    return score

def generate_population(tasks):
    """Creates an initial random population of schedules."""
    return [random.sample(tasks, len(tasks)) for _ in range(POPULATION_SIZE)]

def crossover(parent1, parent2):
    """Performs crossover between two schedules."""
    split = len(parent1) // 2
    child = parent1[:split] + [t for t in parent2 if t not in parent1[:split]]
    return child

def mutate(schedule):
    """Mutates a schedule by swapping two tasks."""
    if random.random() < MUTATION_RATE:
        i, j = random.sample(range(len(schedule)), 2)
        schedule[i], schedule[j] = schedule[j], schedule[i]
    return schedule

def genetic_algorithm(tasks):
    """Applies genetic algorithm to optimize task scheduling."""
    if len(tasks) == 1:
        task = tasks[0]
        start_time = datetime.now()
        end_time = start_time + timedelta(hours=task['est_time'])
        task['assigned'] = end_time <= task['deadline']
        return [task]
    
    population = generate_population(tasks)
    for _ in range(GENERATIONS):
        population = sorted(population, key=fitness, reverse=True)
        new_gen = [crossover(population[i], population[i + 1]) for i in range(0, len(population) - 1, 2)]
        population = new_gen + population[:2]
        population = [mutate(ind) for ind in population]
    
    best_schedule = sorted(population, key=fitness, reverse=True)[0]
    return best_schedule

def main():
    tasks = load_tasks()
    while True:
        task_id = len(tasks) + 1
        task_name = input("Enter task name: ")
        priority = int(input("Enter priority (higher = more urgent): "))
        est_time = int(input("Enter estimated time (hours): "))
        deadline_str = input("Enter deadline (YYYY-MM-DD HH:MM): ")
        deadline = datetime.strptime(deadline_str, "%Y-%m-%d %H:%M")
        
        tasks.append({
            "task_id": task_id,
            "task_name": task_name,
            "priority": priority,
            "est_time": est_time,
            "deadline": deadline,
            "assigned": False
        })
        
        optimized_schedule = genetic_algorithm(tasks)
        save_tasks(tasks)
        
        print("\nOptimized Task Schedule:")
        for task in optimized_schedule:
            status = "Assigned" if task['assigned'] else "Not Assigned"
            print(f"{task['task_name']} (Deadline: {task['deadline']}, Priority: {task['priority']}) - {status}")
        
        cont = input("Do you want to add another task? (yes/no): ").strip().lower()
        if cont != 'yes':
            break

if __name__ == "__main__":
    main()
