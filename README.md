# Evolving Chrome Dino AI Using NEAT: Neuroevolution in an

# Obstacle Avoidance Game


## Rationale or Goals and Purposes of the Project

The main goal of this project was to apply the NEAT (NeuroEvolution of Augmenting Topologies)
algorithm to evolve a neural network that could play the Chrome Dino game effectively. This
involved not only implementing the NEAT algorithm, but also understanding its mechanisms for
evolving both the topology and weights of neural networks over time. The project aimed to create
a learning AI that could improve its gameplay autonomously by selecting for behaviors that led
to longer survival in a dynamic, obstacle based environment. This was achieved by integrating a
NEAT implementation with a custom built clone of the Chrome Dino game, designing a suitable
observation space (inputs) and a limited but sufficient action space (outputs) for the neural network.
The evolution of the population over generations was guided by a fitness function based on in-game
performance metrics such as survival time and jumping accuracy. The result was a working AI
that gradually learned to avoid obstacles and survive for increasingly longer durations as evolution
progressed, highlighting the effectiveness of NEAT in enabling adaptive behavior in a dynamic
game environment.


## Prior Work Reviewed

One of the key sources that informed my understanding of the NEAT algorithm was the origi-
nal paper by Kenneth Stanley and Risto Miikkulainen titled“Evolving Neural Networks through
Augmenting Topologies” (2002). In this paper, the authors introduced NEAT as a method for
evolving increasingly complex neural networks by starting from minimal structures and gradually
adding nodes and connections through mutation. This paper laid the theoretical groundwork for
my implementation by helping me understand the motivation behind evolving both weights and
topologies simultaneously.

Another major inspiration came from the YouTuber and developerCode Bullet, who applied
NEAT to games likeFlappy BirdandDonkey Kong. In his Flappy Bird NEAT AI video, Code
Bullet demonstrated how a population of neural networks could learn to play the game through
successive generations without hardcoded rules. He visualized both the evolving species and their
performance across generations, which made the abstract NEAT concepts more intuitive. (Video
was taken down during the process of writing this paper) His attempt to train a NEAT AI to beat
levels inDonkey Kongillustrated how the algorithm could handle more complex environments
that require climbing ladders, jumping over obstacles, and navigating multiple levels. Watching
these implementations helped me consider how to structure the inputs (e.g., distance to cactus,
speed, and height) and outputs (e.g., whether to jump) in my own version of the Chrome Dino game.

I also reviewed an open-source NEAT implementation calledNEAT-Python, maintained by
CodeReclaimers on GitHub. This library closely resembles the original NEAT algorithm specifi-
cation and includes features such as speciation, mutation, crossover, and fitness evaluation. By
studying the source code of NEAT-Python, I was able to better understand the mechanics of the
algorithm, such as how genomes are encoded, how fitness sharing is implemented, and how com-
patibility distance is used to assign species. This source served as a technical backbone of my
implementation since I adapted its configuration to my game and used it to manage the evolution-
ary cycle.

Additionally, I came across a blog post titled“Growing an AI with NEAT”by Bal ́azs Vecsey,
in which the author documents his journey of using the SharpNEAT framework to train an AI
to navigate procedurally generated mazes. The AI received four binary inputs representing the
walkability of adjacent tiles, and its outputs determined which direction to move. Vecsey’s expla-
nation of the simulation setup, fitness evaluation based on distance to the maze exit, and milestones
such as learning backtracking provided insight into how NEAT evolves solutions over time. His
use of fixed random seeds and maze caching to improve consistency and performance highlighted
the importance of environmental control in neuroevolution experiments. This article deepened my
understanding of practical NEAT configuration, including how varying mutation rates and species
parameters can affect learning progress, and it helped me refine the fitness metrics for my own Dino
AI.


## Materials and Methods

This project involved implementing a clone of the Chrome Dino game in JavaScript, combined with
an evolving neural network controlled by the NEAT (NeuroEvolution of Augmenting Topologies)
algorithm. The overall objective was to develop an AI that learns how to avoid obstacles through
evolutionary optimization, progressively improving its performance across generations.

### Sources and Prior Work

The structure of the Chrome Dino clone was inspired by Google’s original offline Dino game,
while the approach to applying the NEAT algorithm was influenced by earlier work in AI game
development, particularly from content creators like Code Bullet.

### Author Role and Experience

All aspects of the project, including game design, neural network integration, and performance
visualization, were completed independently. Responsibilities included:

- Designing and coding the game mechanics in JavaScript, such as character physics, animation
    logic, ground texture rendering, and obstacle generation.
- Integrating the NEAT algorithm, designing the neural network structure, defining input-
    output mappings, and implementing the evolutionary process.
- Developing and tuning the fitness function to guide learning and implementing a real time
    decision-making system.
- Debugging AI behavior, refining gameplay logic, and creating custom visualizations for the
    neural network and fitness progression over generations.

### Application Implementation

The player object, a dinosaur character, responds to gravity, jump force, and ducking states.
Obstacles are randomly generated at different intervals, move at a constant speed, and vary in
height and width.
The AI uses a neural network that receives the following inputs:

- Horizontal distance to the next obstacle
- Obstacle height
- The player’s current Y-position
- The player’s vertical velocity
- Obstacle width
    The outputs are:
- Jump
- Duck (fast fall or duck state)
- Small jump (lower vertical velocity jump)


The AI makes decisions each frame by feeding these inputs into its neural network and inter-
preting the output values via binary thresholds. Thethink()method interprets these outputs and
triggers the appropriate player actions.
The fitness function plays a crucial role in driving learning:

- It rewards survival time and grounded movement to discourage unnecessary jumps.
- It penalizes excessive jumping and poor decisions that lead to collisions.

### Challenges and Iterations

One early challenge was ensuring that jump penalties did not destabilize learning. The original
proposal relied on a simpler “jump or don’t jump” binary action space, but testing revealed the
benefit of expanding to three outputs (jump, duck, small jump), which increased learning flexibility.
Debugging neural connections and tracking fitness progression also posed challenges. These were
overcome by implementing detailed visualization functions for the neural network (drawBrain())
and inspecting the mutation effects over generations.
Additionally, I refined the obstacle generation logic to ensure consistent training difficulty and
avoid unintentional patterns that allowed for overfitting. Ducking and fast-fall logic were also
tuned, as overly punishing gravity changes destabilized learning at first.


## Implementation and Results

The game mechanics include a consistent horizontal scroll speed, randomized cactus obstacle gen-
eration, and a dinosaur character with basic physics such as jumping, ducking (fast-falling), and
ground detection. Each NEAT network controlled a dinosaur, and its performance was evaluated
using a fitness function that rewarded longer survival and penalized excessive or poorly timed
jumps.
The AI was provided with the following five normalized inputs:

- The dinosaur’s vertical position (y)
- Its vertical velocity
- Distance to the nearest cactus
- Width of the nearest cactus
- Height of the nearest cactus

```
There were three binary outputs:
```
- Full jump
- Duck (fast-fall or crouch)
- Small jump (lower vertical velocity)

```
Over the course of training, several key behavioral patterns emerged:
```
- In early generations, dinosaurs learned to clear obstacles by simply jumping, although ineffi-
    ciently.
- In mid-training, they began fast-falling immediately after clearing a cactus, reducing airtime
    and preparing earlier for the next obstacle.
- In more advanced generations, some AIs discovered how to perform smaller jumps just before
    reaching a cactus, maintaining a lower altitude for longer, and thus improving reactivity.
- Occasionally, elite networks exhibited the most desirable behavior: remaining in the neutral
    state until an obstacle approached, then executing a well-timed jump at the last moment.
    This minimized unnecessary motion and was a key indicator of successful learning.

These results highlight the evolution of strategies from inefficient to highly reactive behaviors
and offered insight into how fitness shaping influenced the learning trajectory.
The graphs visualizing training progress were capped at a maximum fitness value of 750 and
20,000 to better illustrate trends over time without being skewed by extreme outliers in certain
generations.


## Conclusions

The project met its goals by successfully implementing a working Chrome Dino AI using the NEAT
(NeuroEvolution of Augmenting Topologies) algorithm. The integration of evolutionary methods
into a real time game environment demonstrated the feasibility and flexibility of neuroevolution for
adaptive control tasks. Through iterative testing and refinement, I gained valuable insight into how
evolutionary algorithms can perform complex tasks, including those requiring real time decisions
and fine-tuned inputs.
The final product exceeded my expectations in terms of how “human-like” the AI behaved.
Many of them developed strategies such as fast-falling after jumps, performing minimal small hops
to clear low obstacles efficiently, and even waiting in a neutral state until the last possible moment
before jumping, mirroring tactics a skilled human player might use. These results suggest that
evolutionary algorithms like NEAT can be a powerful tool not just for academic experimentation,
but also for building intelligent AIs in interactive entertainment or simulation environments.
There were, however, some limitations and unimplemented features due to time constraints.
One of my goals was to add flying bird obstacles which are an important part of the original
Chrome Dino game but this was not feasible given the complexity of integrating NEAT. Much
of the development time was spent debugging the evolutionary loop and the fitness function to
produce stable learning behavior. Additionally, I hoped to significantly accelerate the simulation
speed to allow faster training, but found that doing so introduced inconsistencies, which negatively
impacted the training process.
Overall, this project served as both a learning experience and a proof of concept for applying
evolutionary AI to real time control problems in games. It revealed the importance of thought-
ful design in AI inputs, action space, fitness functions, and highlighted both the strengths and
limitations of neuroevolution in dynamic environments.

```
Effort Distribution:
```
- Game development and rendering: 15%
- NEAT integration and tuning: 65%
- Evaluation and analysis: 10%
- Report writing: 10%


## References

Code Bullet.Flappy Bird A.I., GitHub,https://github.com/Code-Bullet/Flappy-Bird-AI.

Code Bullet. “DESTROYING Donkey Kong with AI (Deep Reinforcement Learning)”YouTube,
25 Feb. 2023,https://www.youtube.com/watch?v=ovIykchkW5I.

Stanley, Kenneth O., and Risto Miikkulainen. “Evolving Neural Networks through Augmenting
Topologies.”Evolutionary Computation, vol. 10, no. 2, Summer 2002, pp. 99–127. MIT Press,
https://doi.org/10.1162/106365602320169811.

Vecsey, Bal ́azs. “Growing an AI with NEAT.”VB Studio, 17 Mar. 2019,
https://vbstudio.hu/en/blog/20190317-Growing-an-AI-with-NEAT.

CodeReclaimers.NEAT-Python. GitHub,https://github.com/CodeReclaimers/neat-python.


## Appendices

- Appendix A: Screenshot of AI gameplay:
- Appendix B: Fitness graphs over generations:
- Appendix C: Link to code repository:https://github.com/Tw1tchy0/DinoAIFinal
- Appendix D: Video of AI:https://www.youtube.com/watch?v=20Z5zSkOdFw


