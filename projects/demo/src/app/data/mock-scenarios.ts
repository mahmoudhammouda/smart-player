import { Scenario } from 'smart-player';

export const MOCK_SCENARIOS: Scenario[] = [
  {
    id: 'math-lesson',
    name: 'Calculus Fundamentals',
    icon: 'function',
    description: 'Derivatives, integrals, and the fundamental theorem',
    slide: {
      id: 'slide-math-1',
      title: 'Introduction to Calculus',
      description: 'Core concepts of differential and integral calculus',
      tags: ['math', 'calculus', 'derivatives'],
      nodes: [
        {
          id: 'n1',
          type: 'text',
          label: 'Overview',
          content: 'Calculus is the mathematical study of continuous change. It has two major branches: **differential calculus** (concerning rates of change and slopes) and **integral calculus** (concerning accumulation of quantities). Both branches use the fundamental concept of a limit.',
        },
        {
          id: 'n2',
          type: 'math',
          label: 'The Derivative',
          content: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        },
        {
          id: 'n3',
          type: 'text',
          label: 'Chain Rule',
          content: 'The **chain rule** is a formula for computing the derivative of the composition of two or more functions. If $y = f(g(x))$, then the derivative is found by multiplying the outer derivative by the inner derivative.',
        },
        {
          id: 'n4',
          type: 'math',
          label: 'Chain Rule Formula',
          content: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
        },
        {
          id: 'n5',
          type: 'math',
          label: 'Fundamental Theorem of Calculus',
          content: '\\int_a^b f(x)\\,dx = F(b) - F(a) \\quad \\text{where} \\quad F\'(x) = f(x)',
        },
        {
          id: 'n6',
          type: 'code',
          label: 'Python: Numerical Derivative',
          language: 'python',
          content: `def derivative(f, x, h=1e-7):
    """Compute numerical derivative using central difference."""
    return (f(x + h) - f(x - h)) / (2 * h)

# Example: derivative of x^3 at x=2
f = lambda x: x**3
print(f"f'(2) = {derivative(f, 2):.6f}")  # = 12.0`,
        },
      ],
    },
  },
  {
    id: 'history-interactive',
    name: 'World War II Timeline',
    icon: 'history',
    description: 'Interactive exploration of key events and battles',
    slide: {
      id: 'slide-history-1',
      title: 'World War II: Key Events',
      description: 'A structured overview of the Second World War',
      tags: ['history', 'WWII', 'timeline'],
      nodes: [
        {
          id: 'n1',
          type: 'text',
          label: 'Introduction',
          content: 'World War II (1939-1945) was the deadliest conflict in human history, involving more than **30 countries** and resulting in 70-85 million casualties. It fundamentally reshaped the geopolitical landscape of the 20th century and led to the creation of the United Nations.',
        },
        {
          id: 'n2',
          type: 'diagram',
          label: 'Major Theater Map',
          content: `graph LR
    A[Germany] -->|Invasion| B[Poland Sep 1939]
    A -->|Blitzkrieg| C[France Jun 1940]
    A -->|Barbarossa| D[Soviet Union Jun 1941]
    E[Japan] -->|Pearl Harbor| F[USA Dec 1941]
    F --> G[Allies Counter-attack]
    D --> G
    G -->|D-Day| H[Normandy Jun 1944]
    H -->|Liberation| I[Berlin May 1945]`,
        },
        {
          id: 'n3',
          type: 'text',
          label: 'Turning Points',
          content: 'Three battles are widely considered the major turning points of the war:\n\n1. **Battle of Stalingrad** (1942-1943) - First major German defeat on the Eastern Front\n2. **El Alamein** (1942) - Ended Axis advance in North Africa\n3. **Midway** (1942) - Halted Japanese expansion in the Pacific',
        },
        {
          id: 'n4',
          type: 'interactive-sandbox',
          label: 'Casualty Counter',
          content: `<div style="font-family: system-ui; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: #eee; border-radius: 12px; min-height: 200px;">
  <h3 style="margin: 0 0 16px; color: #e94560; font-size: 1.1rem;">WWII Casualty Overview</h3>
  <div id="bars" style="display: flex; flex-direction: column; gap: 10px;"></div>
</div>
<style>
  .bar-row { display: flex; align-items: center; gap: 10px; }
  .bar-label { width: 120px; font-size: 0.8rem; color: #ccc; text-align: right; }
  .bar-track { flex: 1; background: rgba(255,255,255,0.1); border-radius: 4px; height: 22px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; padding-left: 8px; font-size: 0.7rem; font-weight: bold; }
</style>
<script>
var data = [
  { label: "Soviet Union", value: 27, color: "#e94560", unit: "M" },
  { label: "China", value: 15, color: "#f5a623", unit: "M" },
  { label: "Germany", value: 8, color: "#7b68ee", unit: "M" },
  { label: "Poland", value: 6, color: "#50fa7b", unit: "M" },
  { label: "Japan", value: 3, color: "#ff79c6", unit: "M" },
  { label: "USA", value: 0.4, color: "#8be9fd", unit: "M" },
];
var max = Math.max.apply(null, data.map(function(d) { return d.value; }));
var container = document.getElementById('bars');
data.forEach(function(d) {
  var pct = (d.value / max) * 100;
  var row = document.createElement('div');
  row.className = 'bar-row';
  row.innerHTML = '<div class="bar-label">' + d.label + '</div><div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:' + d.color + ';">' + d.value + d.unit + '</div></div>';
  container.appendChild(row);
});
</script>`,
        },
      ],
    },
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    icon: 'tree',
    description: 'Trees, graphs, and complexity analysis',
    slide: {
      id: 'slide-ds-1',
      title: 'Binary Search Trees',
      description: 'Understanding BST operations and complexity',
      tags: ['cs', 'algorithms', 'trees'],
      nodes: [
        {
          id: 'n1',
          type: 'text',
          label: 'What is a BST?',
          content: 'A **Binary Search Tree** (BST) is a rooted binary tree where each node has at most two children, referred to as the left and right child. For any node $n$:\n\n- All nodes in the **left subtree** have values **less than** $n$\n- All nodes in the **right subtree** have values **greater than** $n$\n\nThis property enables **O(log n)** search in balanced trees.',
        },
        {
          id: 'n2',
          type: 'diagram',
          label: 'BST Structure',
          content: `graph TD
    A((8)) --> B((3))
    A --> C((10))
    B --> D((1))
    B --> E((6))
    C --> F((9))
    C --> G((14))
    style A fill:#3b82f6,color:#fff,stroke:#1d4ed8
    style B fill:#6366f1,color:#fff,stroke:#4338ca
    style C fill:#6366f1,color:#fff,stroke:#4338ca`,
        },
        {
          id: 'n3',
          type: 'math',
          label: 'Complexity',
          content: 'T(n) = \\begin{cases} O(\\log n) & \\text{balanced BST} \\\\ O(n) & \\text{degenerate (linked list)} \\end{cases}',
        },
        {
          id: 'n4',
          type: 'code',
          label: 'TypeScript Implementation',
          language: 'typescript',
          content: `class BSTNode<T> {
  value: T;
  left: BSTNode<T> | null = null;
  right: BSTNode<T> | null = null;
  constructor(value: T) { this.value = value; }
}

class BinarySearchTree<T> {
  root: BSTNode<T> | null = null;

  insert(value: T): void {
    const node = new BSTNode(value);
    if (!this.root) { this.root = node; return; }
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) { current.left = node; return; }
        current = current.left;
      } else {
        if (!current.right) { current.right = node; return; }
        current = current.right;
      }
    }
  }

  search(value: T): boolean {
    let current = this.root;
    while (current) {
      if (value === current.value) return true;
      current = value < current.value
        ? current.left : current.right;
    }
    return false;
  }
}`,
        },
      ],
    },
  },
  {
    id: 'physics-waves',
    name: 'Wave Mechanics',
    icon: 'wave',
    description: 'Harmonic oscillators and wave equations',
    slide: {
      id: 'slide-physics-1',
      title: 'Quantum Wave Functions',
      description: 'The Schrodinger equation and probability amplitudes',
      tags: ['physics', 'quantum', 'waves'],
      nodes: [
        {
          id: 'n1',
          type: 'text',
          label: 'Wave-Particle Duality',
          content: 'In quantum mechanics, every particle or quantum entity may be described as either a particle or a wave. The **de Broglie hypothesis** proposes that matter exhibits a wave-like nature, with wavelength inversely proportional to momentum.',
        },
        {
          id: 'n2',
          type: 'math',
          label: 'de Broglie Wavelength',
          content: '\\lambda = \\frac{h}{p} = \\frac{h}{mv}',
        },
        {
          id: 'n3',
          type: 'math',
          label: 'Time-Dependent Schrodinger Equation',
          content: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\left[-\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t)\\right]\\Psi(\\mathbf{r},t)',
        },
        {
          id: 'n4',
          type: 'math',
          label: 'Probability Density',
          content: 'P(x) = |\\Psi(x,t)|^2 \\quad \\text{with} \\quad \\int_{-\\infty}^{\\infty}|\\Psi(x,t)|^2\\,dx = 1',
        },
        {
          id: 'n5',
          type: 'interactive-sandbox',
          label: 'Wave Simulator',
          content: `<div style="font-family: system-ui; padding: 16px; background: #020617; color: #e2e8f0; border-radius: 12px;">
  <h3 style="margin: 0 0 12px; font-size: 1rem; color: #06b6d4;">Wave Function Visualizer</h3>
  <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px;">
    <label style="font-size:0.75rem;color:#94a3b8;">Frequency: <input id="freq" type="range" min="1" max="10" value="3" /></label>
    <label style="font-size:0.75rem;color:#94a3b8;">Amplitude: <input id="amp" type="range" min="10" max="80" value="40" /></label>
  </div>
  <canvas id="waveCanvas" width="460" height="140" style="width:100%;background:#020617;border-radius:8px;border:1px solid #0f172a;"></canvas>
</div>
<script>
var canvas = document.getElementById('waveCanvas');
var ctx = canvas.getContext('2d');
var t = 0;
function draw() {
  var W = canvas.width, H = canvas.height;
  var freq = parseFloat(document.getElementById('freq').value);
  var amp = parseFloat(document.getElementById('amp').value);
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
  var grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, '#06b6d4'); grad.addColorStop(0.5, '#7c3aed'); grad.addColorStop(1, '#06b6d4');
  ctx.strokeStyle = grad; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (var x = 0; x <= W; x++) {
    var px = (x / W) * Math.PI * 2 * freq;
    var y = Math.sin(px + t) * amp;
    if (x === 0) ctx.moveTo(x, H/2 - y);
    else ctx.lineTo(x, H/2 - y);
  }
  ctx.stroke();
  t += 0.04;
  requestAnimationFrame(draw);
}
draw();
</script>`,
        },
      ],
    },
  },
  {
    id: 'rich-content',
    name: 'Rich Content Showcase',
    icon: 'rich',
    description: 'All 22 node types in a single educational document',
    slide: {
      id: 'slide-rich-1',
      title: 'The Solar System: A Complete Guide',
      description: 'An interactive lesson showcasing every node type available in SmartPlayer',
      tags: ['astronomy', 'showcase', 'interactive'],
      nodes: [
        {
          id: 'rc-toc',
          type: 'toc',
          label: 'Table of Contents',
          content: [
            { title: 'Introduction', level: 1 },
            { title: 'The Sun', level: 2 },
            { title: 'Inner Planets', level: 2 },
            { title: 'Outer Planets', level: 2 },
            { title: 'Key Formulas', level: 1 },
            { title: 'Exercises', level: 1 },
          ],
        },
        {
          id: 'rc-heading1',
          type: 'heading',
          content: 'Introduction to the Solar System',
          meta: { level: 1 },
        },
        {
          id: 'rc-text1',
          type: 'text',
          content: 'Our solar system consists of a star, eight planets, dwarf planets, moons, and countless smaller bodies. It formed approximately **4.6 billion years ago** from a giant molecular cloud.',
        },
        {
          id: 'rc-callout-info',
          type: 'callout',
          content: 'The solar system is located in the Orion Arm of the Milky Way galaxy, about 26,000 light-years from the galactic center.',
          meta: { variant: 'info', title: 'Did you know?' },
        },
        {
          id: 'rc-divider1',
          type: 'divider',
          content: '',
          meta: { style: 'dots' },
        },
        {
          id: 'rc-heading2',
          type: 'heading',
          content: 'Planetary Data',
          meta: { level: 2 },
        },
        {
          id: 'rc-table1',
          type: 'table',
          label: 'Planet Comparison',
          content: {
            headers: ['Planet', 'Distance (AU)', 'Diameter (km)', 'Moons', 'Type'],
            rows: [
              ['Mercury', '0.39', '4,879', '0', 'Rocky'],
              ['Venus', '0.72', '12,104', '0', 'Rocky'],
              ['Earth', '1.00', '12,756', '1', 'Rocky'],
              ['Mars', '1.52', '6,792', '2', 'Rocky'],
              ['Jupiter', '5.20', '142,984', '95', 'Gas Giant'],
              ['Saturn', '9.58', '120,536', '146', 'Gas Giant'],
              ['Uranus', '19.18', '51,118', '28', 'Ice Giant'],
              ['Neptune', '30.07', '49,528', '16', 'Ice Giant'],
            ],
          },
          meta: { caption: 'Basic properties of the eight planets in our solar system' },
        },
        {
          id: 'rc-quote1',
          type: 'quote',
          content: 'Somewhere, something incredible is waiting to be known.',
          meta: { author: 'Carl Sagan', source: 'Cosmos' },
        },
        {
          id: 'rc-key1',
          type: 'key-concept',
          content: 'An Astronomical Unit (AU) is the average distance between the Earth and the Sun, approximately 149.6 million kilometers. It is used as a standard measure for distances within the solar system.',
          meta: { term: 'Astronomical Unit (AU)' },
        },
        {
          id: 'rc-heading3',
          type: 'heading',
          content: 'Orbital Mechanics',
          meta: { level: 2 },
        },
        {
          id: 'rc-text2',
          type: 'text',
          content: "Kepler's three laws describe planetary motion. The third law relates orbital period to distance from the Sun:",
        },
        {
          id: 'rc-math1',
          type: 'math',
          label: "Kepler's Third Law",
          content: 'T^2 = \\frac{4\\pi^2}{GM} a^3',
        },
        {
          id: 'rc-footnote1',
          type: 'footnote',
          content: 'Where T is the orbital period, G is the gravitational constant, M is the solar mass, and a is the semi-major axis of the orbit.',
        },
        {
          id: 'rc-steps1',
          type: 'step-by-step',
          label: 'How to Calculate Orbital Period',
          content: [
            { title: 'Measure the semi-major axis', description: 'Determine the average distance (a) from the planet to the Sun in AU.' },
            { title: 'Apply the formula', description: 'Use T² = a³ when measuring in AU and Earth years.' },
            { title: 'Take the square root', description: 'Calculate T = sqrt(a³) to find the orbital period in Earth years.' },
          ],
        },
        {
          id: 'rc-callout-tip',
          type: 'callout',
          content: "For Earth, a = 1 AU, so T = sqrt(1) = 1 year. For Mars, a = 1.52 AU, so T = sqrt(1.52³) ≈ 1.88 years.",
          meta: { variant: 'tip', title: 'Quick Check' },
        },
        {
          id: 'rc-code1',
          type: 'code',
          label: 'Python: Orbital Period Calculator',
          language: 'python',
          content: `import math

def orbital_period(semi_major_axis_au):
    """Calculate orbital period in Earth years using Kepler's 3rd law."""
    return math.sqrt(semi_major_axis_au ** 3)

planets = {
    "Mercury": 0.39, "Venus": 0.72, "Earth": 1.0,
    "Mars": 1.52, "Jupiter": 5.20, "Saturn": 9.58,
}

for name, au in planets.items():
    period = orbital_period(au)
    print(f"{name}: {period:.2f} Earth years")`,
        },
        {
          id: 'rc-diagram1',
          type: 'diagram',
          label: 'Solar System Structure',
          content: `graph LR
    S((Sun)) --> M[Mercury]
    S --> V[Venus]
    S --> E[Earth]
    S --> Ma[Mars]
    Ma --> AB[Asteroid Belt]
    AB --> J[Jupiter]
    J --> Sa[Saturn]
    Sa --> U[Uranus]
    U --> N[Neptune]
    style S fill:#f59e0b,color:#fff,stroke:#d97706
    style E fill:#3b82f6,color:#fff,stroke:#1d4ed8
    style Ma fill:#ef4444,color:#fff,stroke:#dc2626
    style J fill:#f97316,color:#fff,stroke:#ea580c`,
        },
        {
          id: 'rc-list1',
          type: 'list',
          content: ['Rocky planets: Mercury, Venus, Earth, Mars', 'Gas giants: Jupiter, Saturn', 'Ice giants: Uranus, Neptune', 'Dwarf planets: Pluto, Eris, Ceres, Haumea, Makemake'],
          meta: { ordered: false },
        },
        {
          id: 'rc-divider2',
          type: 'divider',
          content: '',
          meta: { style: 'stars' },
        },
        {
          id: 'rc-heading4',
          type: 'heading',
          content: 'Exercises',
          meta: { level: 2 },
        },
        {
          id: 'rc-fill1',
          type: 'fill-blanks',
          label: 'Fill in the Blanks',
          content: 'The closest planet to the Sun is ___Mercury___. The largest planet is ___Jupiter___. Earth has ___1___ natural satellite(s).',
        },
        {
          id: 'rc-flash1',
          type: 'flash-card',
          label: 'Planet Flash Cards',
          content: [
            { front: 'Which planet is known as the Red Planet?', back: 'Mars — due to iron oxide (rust) on its surface' },
            { front: 'Which planet has the most moons?', back: 'Saturn — with 146 confirmed moons' },
            { front: 'What is the Great Red Spot?', back: 'A giant storm on Jupiter, larger than Earth, that has been raging for over 350 years' },
            { front: 'Which planet rotates on its side?', back: 'Uranus — its axial tilt is about 98 degrees' },
          ],
        },
        {
          id: 'rc-callout-warn',
          type: 'callout',
          content: 'Pluto was reclassified as a dwarf planet in 2006 by the International Astronomical Union (IAU). This remains a topic of debate in the scientific community.',
          meta: { variant: 'warning', title: 'Common Misconception' },
        },
        {
          id: 'rc-image1',
          type: 'image-caption',
          content: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_blue_marble.jpg/600px-The_blue_marble.jpg',
          meta: { caption: 'The Blue Marble — Earth as seen from Apollo 17 (1972)', alt: 'Earth from space showing Africa and Antarctica' },
        },
        {
          id: 'rc-video1',
          type: 'video-embed',
          label: 'The Scale of the Universe',
          content: 'https://www.youtube.com/watch?v=Kj4524AAZdE',
          meta: { provider: 'youtube' },
        },
        {
          id: 'rc-progress1',
          type: 'progress',
          content: 'Introduction to the Solar System',
          meta: { completed: true },
        },
        {
          id: 'rc-progress2',
          type: 'progress',
          content: 'Planetary data and orbital mechanics',
          meta: { completed: true },
        },
        {
          id: 'rc-progress3',
          type: 'progress',
          content: 'Exercises and review',
          meta: { completed: false },
        },
      ],
    },
  },
  {
    id: 'quiz-demo',
    name: 'Quiz Demo',
    icon: 'quiz',
    description: 'Custom node type: interactive quiz questions',
    slide: {
      id: 'slide-quiz-1',
      title: 'Science Quiz',
      description: 'Test your knowledge with this interactive quiz powered by a custom node type',
      tags: ['quiz', 'custom-node', 'extensibility'],
      nodes: [
        {
          id: 'n1',
          type: 'text',
          label: 'Instructions',
          content: 'This scenario demonstrates the **extensibility** of SmartPlayer. The quiz node below is a **custom node type** registered by the consumer application, not built into the library.',
        },
        {
          id: 'n2',
          type: 'quiz',
          label: 'General Science',
          content: JSON.stringify([
            {
              question: 'What is the chemical symbol for water?',
              options: ['H2O', 'CO2', 'NaCl', 'O2'],
              answer: 0
            },
            {
              question: 'Which planet is known as the Red Planet?',
              options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
              answer: 2
            },
            {
              question: 'What is the speed of light in vacuum (approximately)?',
              options: ['3 x 10^6 m/s', '3 x 10^8 m/s', '3 x 10^10 m/s', '3 x 10^4 m/s'],
              answer: 1
            }
          ]),
        },
      ],
    },
  },
];
