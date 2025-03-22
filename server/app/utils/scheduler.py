from datetime import datetime, timedelta
import random
from typing import List, Dict

from app.database import get_db
from app.models.task import Task

POPULATION_SIZE = 10
GENERATIONS = 50
MUTATION_RATE = 0.1

class GeneticScheduler:
    @staticmethod
    def initialize_population(tasks: List[Dict]):
        if not tasks:
            return []
        population = []
        for _ in range(POPULATION_SIZE):
            schedule = sorted(tasks, key=lambda x: (random.random(), -x['priority'], x['deadline']))
            population.append(schedule)
        return population

    @staticmethod
    def fitness(schedule: List[Dict]):
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
                return -1
        return score

    @staticmethod
    def crossover(parent1: List[Dict], parent2: List[Dict]):
        split = len(parent1) // 2
        child = parent1[:split] + [task for task in parent2 if task not in parent1[:split]]
        return child

    @staticmethod
    def mutate(schedule: List[Dict]):
        if random.random() < MUTATION_RATE and len(schedule) > 1:
            idx1, idx2 = random.sample(range(len(schedule)), 2)
            schedule[idx1], schedule[idx2] = schedule[idx2], schedule[idx1]
        
        seen = set()
        unique_schedule = []
        for task in schedule:
            task_tuple = (task['task_id'], task['task_name'])
            if task_tuple not in seen:
                seen.add(task_tuple)
                unique_schedule.append(task)
        return unique_schedule

    @staticmethod
    def schedule_tasks(tasks: List[Dict]):
        if not tasks:
            return [], []
            
        if len(tasks) == 1:
            task = tasks[0]
            start_time = datetime.now()
            end_time = start_time + timedelta(hours=task['est_time'])
            if end_time <= task['deadline']:
                return [task], []
            return [], [task]

        population = GeneticScheduler.initialize_population(tasks)
        for _ in range(GENERATIONS):
            population = [schedule for schedule in population if schedule]
            if not population:
                break
            population.sort(key=GeneticScheduler.fitness, reverse=True)
            new_gen = []
            
            for i in range(0, len(population) - 1, 2):
                child1 = GeneticScheduler.crossover(population[i], population[i+1])
                child2 = GeneticScheduler.crossover(population[i+1], population[i])
                new_gen.extend([GeneticScheduler.mutate(child1), 
                              GeneticScheduler.mutate(child2)])
            
            population = new_gen[:POPULATION_SIZE] if new_gen else population
        
        best_schedule = max(population, key=GeneticScheduler.fitness, default=[])
        current_time = datetime.now()
        assigned = []
        unassigned = []
        
        for task in best_schedule:
            start_time = current_time
            end_time = start_time + timedelta(hours=task['est_time'])
            if end_time <= task['deadline']:
                assigned.append(task)
                current_time = end_time
            else:
                unassigned.append(task)
                
        return assigned, unassigned
    
    @staticmethod
    def save_to_db(assigned: List[Dict], unassigned: List[Dict]):
        db = next(get_db())  # Get a database session
        try:
            # Clear existing scheduled tasks
            db.query(Task).delete()
            
            # Create new task records
            for task in assigned + unassigned:
                deadline = task['deadline']
                db_task = Task(
                    task_name=task['task_name'],
                    urgency={3: 'High', 2: 'Medium', 1: 'Low'}[task['priority']],
                    estimated_duration=task['est_time'],
                    deadline=deadline,
                    status='completed' if task in assigned else 'missed',
                    created_year=deadline.year,
                    created_month=deadline.month,
                    created_day=deadline.day
                )
                db.add(db_task)
            
            db.commit()
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()