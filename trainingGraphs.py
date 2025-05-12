import json
import glob
import matplotlib.pyplot as plt

file_paths = glob.glob("jsonsTrainer/*.json") 

all_top_scores = []
all_avg_scores = []

for path in file_paths:
    with open(path, 'r') as f:
        data = json.load(f)
        top_scores = [gen["topScore"] for gen in data]
        avg_scores = [gen["averageScore"] for gen in data]
        all_top_scores.append(top_scores)
        all_avg_scores.append(avg_scores)

generations = list(range(1, len(all_top_scores[0]) + 1))

#graph top
plt.figure(figsize=(10, 5))
for i, top_scores in enumerate(all_top_scores):
    plt.plot(generations, top_scores, label=f'Training Set {i+1}')
plt.title("Top Score per Generation")
plt.xlabel("Generation")
plt.ylabel("Top Score")
plt.legend()
plt.ylim(0, top=20000)
#plt.yscale('log')
plt.grid(True)
plt.tight_layout()
plt.show()

#graph avg
plt.figure(figsize=(10, 5))
for i, avg_scores in enumerate(all_avg_scores):
    plt.plot(generations, avg_scores, label=f'Training Set {i+1}')
plt.title("Average Score per Generation")
plt.xlabel("Generation")
plt.ylabel("Average Score")
plt.legend()
plt.ylim(150, top=750)
#plt.yscale('log')
plt.grid(True)
plt.tight_layout()
plt.show()