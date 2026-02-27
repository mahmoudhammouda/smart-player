import type { Scenario } from "@shared/schema";

export const MOCK_SCENARIOS: Scenario[] = [
  {
    id: "math-lesson",
    name: "Calculus Fundamentals",
    icon: "∑",
    description: "Derivatives, integrals, and the fundamental theorem",
    slide: {
      id: "slide-math-1",
      title: "Introduction to Calculus",
      description: "Core concepts of differential and integral calculus",
      tags: ["math", "calculus", "derivatives"],
      nodes: [
        {
          id: "n1",
          type: "text",
          label: "Overview",
          content:
            "Calculus is the mathematical study of continuous change. It has two major branches: **differential calculus** (concerning rates of change and slopes) and **integral calculus** (concerning accumulation of quantities). Both branches use the fundamental concept of a limit.",
        },
        {
          id: "n2",
          type: "math",
          label: "The Derivative",
          content:
            "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        },
        {
          id: "n3",
          type: "text",
          label: "Chain Rule",
          content:
            "The **chain rule** is a formula for computing the derivative of the composition of two or more functions. If $y = f(g(x))$, then the derivative is found by multiplying the outer derivative by the inner derivative.",
        },
        {
          id: "n4",
          type: "math",
          label: "Chain Rule Formula",
          content:
            "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)",
        },
        {
          id: "n5",
          type: "math",
          label: "Fundamental Theorem of Calculus",
          content:
            "\\int_a^b f(x)\\,dx = F(b) - F(a) \\quad \\text{where} \\quad F'(x) = f(x)",
        },
        {
          id: "n6",
          type: "code",
          label: "Python: Numerical Derivative",
          language: "python",
          content: `def derivative(f, x, h=1e-7):
    """Compute numerical derivative using central difference."""
    return (f(x + h) - f(x - h)) / (2 * h)

# Example: derivative of x^3 at x=2
f = lambda x: x**3
print(f"f'(2) ≈ {derivative(f, 2):.6f}")  # ≈ 12.0

# Integration using trapezoidal rule
def integrate(f, a, b, n=10000):
    h = (b - a) / n
    total = (f(a) + f(b)) / 2
    for i in range(1, n):
        total += f(a + i * h)
    return total * h

area = integrate(lambda x: x**2, 0, 1)
print(f"∫₀¹ x² dx ≈ {area:.6f}")  # ≈ 0.333`,
        },
      ],
    },
  },
  {
    id: "history-interactive",
    name: "World War II Timeline",
    icon: "📜",
    description: "Interactive exploration of key events and battles",
    slide: {
      id: "slide-history-1",
      title: "World War II: Key Events",
      description: "A structured overview of the Second World War",
      tags: ["history", "WWII", "timeline"],
      nodes: [
        {
          id: "n1",
          type: "text",
          label: "Introduction",
          content:
            "World War II (1939–1945) was the deadliest conflict in human history, involving more than **30 countries** and resulting in 70–85 million casualties. It fundamentally reshaped the geopolitical landscape of the 20th century and led to the creation of the United Nations.",
        },
        {
          id: "n2",
          type: "diagram",
          label: "Major Theater Map (Simplified)",
          content: `graph LR
    A[Germany 🇩🇪] -->|Invasion| B[Poland Sep 1939]
    A -->|Blitzkrieg| C[France Jun 1940]
    A -->|Operation Barbarossa| D[Soviet Union Jun 1941]
    E[Japan 🇯🇵] -->|Pearl Harbor| F[USA Dec 1941]
    E -->|Pacific Campaign| G[Pacific Islands]
    F --> H[Allies Counter-attack]
    D --> H
    C --> H
    H -->|D-Day| I[Normandy Jun 1944]
    H -->|Pacific Victory| J[V-J Day Aug 1945]
    I -->|Liberation| K[Berlin May 1945]`,
        },
        {
          id: "n3",
          type: "text",
          label: "Turning Points",
          content:
            "Three battles are widely considered the major turning points of the war:\n\n1. **Battle of Stalingrad** (1942–1943) — First major German defeat on the Eastern Front\n2. **El Alamein** (1942) — Ended Axis advance in North Africa\n3. **Midway** (1942) — Halted Japanese expansion in the Pacific",
        },
        {
          id: "n4",
          type: "interactive-sandbox",
          label: "Casualty Counter",
          content: `<div style="font-family: system-ui; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: #eee; border-radius: 12px; min-height: 200px;">
  <h3 style="margin: 0 0 16px; color: #e94560; font-size: 1.1rem;">WWII Casualty Overview</h3>
  <div id="bars" style="display: flex; flex-direction: column; gap: 10px;"></div>
  <p style="margin-top: 16px; font-size: 0.75rem; color: #888;">Hover over bars for details</p>
</div>
<style>
  .bar-row { display: flex; align-items: center; gap: 10px; }
  .bar-label { width: 120px; font-size: 0.8rem; color: #ccc; text-align: right; }
  .bar-track { flex: 1; background: rgba(255,255,255,0.1); border-radius: 4px; height: 22px; overflow: hidden; cursor: pointer; }
  .bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; padding-left: 8px; font-size: 0.7rem; font-weight: bold; transition: opacity 0.2s; }
  .bar-fill:hover { opacity: 0.8; }
</style>
<script>
const data = [
  { label: "Soviet Union", value: 27, color: "#e94560", unit: "M" },
  { label: "China", value: 15, color: "#f5a623", unit: "M" },
  { label: "Germany", value: 8, color: "#7b68ee", unit: "M" },
  { label: "Poland", value: 6, color: "#50fa7b", unit: "M" },
  { label: "Japan", value: 3, color: "#ff79c6", unit: "M" },
  { label: "USA", value: 0.4, color: "#8be9fd", unit: "M" },
];
const max = Math.max(...data.map(d => d.value));
const container = document.getElementById('bars');
data.forEach(d => {
  const pct = (d.value / max) * 100;
  const row = document.createElement('div');
  row.className = 'bar-row';
  row.innerHTML = \`<div class="bar-label">\${d.label}</div>
    <div class="bar-track" title="\${d.value}\${d.unit} casualties">
      <div class="bar-fill" style="width:\${pct}%;background:\${d.color};">\${d.value}\${d.unit}</div>
    </div>\`;
  container.appendChild(row);
});
</script>`,
        },
      ],
    },
  },
  {
    id: "data-structures",
    name: "Data Structures",
    icon: "🌲",
    description: "Trees, graphs, and complexity analysis",
    slide: {
      id: "slide-ds-1",
      title: "Binary Search Trees",
      description: "Understanding BST operations and complexity",
      tags: ["cs", "algorithms", "trees"],
      nodes: [
        {
          id: "n1",
          type: "text",
          label: "What is a BST?",
          content:
            "A **Binary Search Tree** (BST) is a rooted binary tree where each node has at most two children, referred to as the left and right child. For any node $n$:\n\n- All nodes in the **left subtree** have values **less than** $n$\n- All nodes in the **right subtree** have values **greater than** $n$\n\nThis property enables **O(log n)** search in balanced trees.",
        },
        {
          id: "n2",
          type: "diagram",
          label: "BST Structure",
          content: `graph TD
    A((8)) --> B((3))
    A --> C((10))
    B --> D((1))
    B --> E((6))
    C --> F((9))
    C --> G((14))
    E --> H((4))
    E --> I((7))
    style A fill:#3b82f6,color:#fff,stroke:#1d4ed8
    style B fill:#6366f1,color:#fff,stroke:#4338ca
    style C fill:#6366f1,color:#fff,stroke:#4338ca`,
        },
        {
          id: "n3",
          type: "math",
          label: "Complexity",
          content:
            "T(n) = \\begin{cases} O(\\log n) & \\text{balanced BST} \\\\ O(n) & \\text{degenerate (linked list)} \\end{cases}",
        },
        {
          id: "n4",
          type: "code",
          label: "TypeScript Implementation",
          language: "typescript",
          content: `class BSTNode<T> {
  value: T;
  left: BSTNode<T> | null = null;
  right: BSTNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
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
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }

  inOrder(node = this.root, result: T[] = []): T[] {
    if (node) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }
}

const bst = new BinarySearchTree<number>();
[8, 3, 10, 1, 6, 9, 14, 4, 7].forEach(v => bst.insert(v));
console.log(bst.inOrder()); // [1, 3, 4, 6, 7, 8, 9, 10, 14]`,
        },
        {
          id: "n5",
          type: "interactive-sandbox",
          label: "BST Visualizer",
          content: `<div style="font-family: system-ui; padding: 16px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
  <h3 style="margin: 0 0 12px; font-size: 1rem; color: #7c3aed;">BST Visualizer</h3>
  <div style="display:flex;gap:8px;margin-bottom:12px;">
    <input id="val" type="number" placeholder="Enter value" style="flex:1;padding:6px 10px;background:#1e293b;border:1px solid #334155;border-radius:6px;color:#e2e8f0;font-size:0.875rem;outline:none;" />
    <button id="insertBtn" style="padding:6px 14px;background:#7c3aed;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.875rem;">Insert</button>
    <button id="clearBtn" style="padding:6px 14px;background:#334155;color:#e2e8f0;border:none;border-radius:6px;cursor:pointer;font-size:0.875rem;">Clear</button>
  </div>
  <canvas id="canvas" width="460" height="200" style="width:100%;background:#0f172a;border-radius:8px;"></canvas>
  <div id="inorder" style="margin-top:8px;font-size:0.75rem;color:#94a3b8;"></div>
</div>
<script>
let nodes = {};
let root = null;

function insert(val, node = null, parent = null, dir = null) {
  if (node === null) {
    const n = { val, left: null, right: null };
    if (parent === null) root = n;
    else if (dir === 'L') parent.left = n;
    else parent.right = n;
    return;
  }
  if (val < node.val) insert(val, node.left, node, 'L');
  else if (val > node.val) insert(val, node.right, node, 'R');
}

function draw() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!root) return;

  const positions = {};
  let minX = Infinity, maxX = -Infinity;

  function calcPos(node, depth, order) {
    if (!node) return order;
    order = calcPos(node.left, depth + 1, order);
    positions[node.val] = { x: order * 46, y: depth * 48 + 30 };
    minX = Math.min(minX, order * 46);
    maxX = Math.max(maxX, order * 46);
    order++;
    return calcPos(node.right, depth + 1, order);
  }
  calcPos(root, 0, 0);

  const ox = (canvas.width - (maxX - minX)) / 2 - minX;

  function drawTree(node) {
    if (!node) return;
    const p = positions[node.val];
    if (node.left) {
      const c = positions[node.left.val];
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(p.x+ox, p.y); ctx.lineTo(c.x+ox, c.y); ctx.stroke();
    }
    if (node.right) {
      const c = positions[node.right.val];
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(p.x+ox, p.y); ctx.lineTo(c.x+ox, c.y); ctx.stroke();
    }
    drawTree(node.left); drawTree(node.right);
    ctx.beginPath();
    ctx.arc(p.x+ox, p.y, 18, 0, Math.PI*2);
    ctx.fillStyle = '#7c3aed'; ctx.fill();
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(node.val, p.x+ox, p.y);
  }
  drawTree(root);

  function inorder(n, res = []) { if (n) { inorder(n.left,res); res.push(n.val); inorder(n.right,res); } return res; }
  document.getElementById('inorder').textContent = 'In-order: [' + inorder(root).join(', ') + ']';
}

document.getElementById('insertBtn').onclick = () => {
  const val = parseInt(document.getElementById('val').value);
  if (!isNaN(val)) { insert(val, root); draw(); document.getElementById('val').value = ''; }
};
document.getElementById('clearBtn').onclick = () => { root = null; draw(); document.getElementById('inorder').textContent = ''; };

[8,3,10,1,6].forEach(v => insert(v, root)); draw();
</script>`,
        },
      ],
    },
  },
  {
    id: "physics-waves",
    name: "Wave Mechanics",
    icon: "〜",
    description: "Harmonic oscillators and wave equations",
    slide: {
      id: "slide-physics-1",
      title: "Quantum Wave Functions",
      description: "The Schrödinger equation and probability amplitudes",
      tags: ["physics", "quantum", "waves"],
      nodes: [
        {
          id: "n1",
          type: "text",
          label: "Wave-Particle Duality",
          content:
            "In quantum mechanics, every particle or quantum entity may be described as either a particle or a wave. The **de Broglie hypothesis** proposes that matter exhibits a wave-like nature, with wavelength inversely proportional to momentum.",
        },
        {
          id: "n2",
          type: "math",
          label: "de Broglie Wavelength",
          content: "\\lambda = \\frac{h}{p} = \\frac{h}{mv}",
        },
        {
          id: "n3",
          type: "math",
          label: "Time-Dependent Schrödinger Equation",
          content:
            "i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\hat{H}\\Psi(\\mathbf{r},t) = \\left[-\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t)\\right]\\Psi(\\mathbf{r},t)",
        },
        {
          id: "n4",
          type: "math",
          label: "Probability Density",
          content:
            "P(x) = |\\Psi(x,t)|^2 \\quad \\text{with} \\quad \\int_{-\\infty}^{\\infty}|\\Psi(x,t)|^2\\,dx = 1",
        },
        {
          id: "n5",
          type: "interactive-sandbox",
          label: "Wave Simulator",
          content: `<div style="font-family: system-ui; padding: 16px; background: #020617; color: #e2e8f0; border-radius: 12px;">
  <h3 style="margin: 0 0 12px; font-size: 1rem; color: #06b6d4;">Wave Function Visualizer</h3>
  <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px;">
    <label style="font-size:0.75rem;color:#94a3b8;">Frequency: <input id="freq" type="range" min="1" max="10" value="3" style="vertical-align:middle;" /></label>
    <label style="font-size:0.75rem;color:#94a3b8;">Amplitude: <input id="amp" type="range" min="10" max="80" value="40" style="vertical-align:middle;" /></label>
    <label style="font-size:0.75rem;color:#94a3b8;">Mode: <select id="mode" style="background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:4px;padding:2px 6px;font-size:0.75rem;">
      <option value="sin">Sine</option><option value="gauss">Gaussian</option><option value="square">Square</option>
    </select></label>
  </div>
  <canvas id="waveCanvas" width="460" height="140" style="width:100%;background:#020617;border-radius:8px;border:1px solid #0f172a;"></canvas>
</div>
<script>
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
let t = 0;

function draw() {
  const W = canvas.width, H = canvas.height;
  const freq = parseFloat(document.getElementById('freq').value);
  const amp = parseFloat(document.getElementById('amp').value);
  const mode = document.getElementById('mode').value;

  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();

  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, '#06b6d4'); grad.addColorStop(0.5, '#7c3aed'); grad.addColorStop(1, '#06b6d4');
  ctx.strokeStyle = grad; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = 0; x <= W; x++) {
    const px = (x / W) * Math.PI * 2 * freq;
    let y;
    if (mode === 'sin') y = Math.sin(px + t) * amp;
    else if (mode === 'gauss') {
      const cx = W/2 + Math.cos(t*0.5)*60;
      y = Math.exp(-Math.pow(x-cx,2)/3000) * amp * Math.sin(px + t);
    } else {
      y = (Math.sin(px + t) > 0 ? 1 : -1) * amp * 0.6;
    }
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
    id: "react-architecture",
    name: "React Patterns",
    icon: "⚛",
    description: "Modern component patterns and state management",
    slide: {
      id: "slide-react-1",
      title: "React Architecture Patterns",
      description: "Hooks, composition, and state management",
      tags: ["react", "patterns", "frontend"],
      nodes: [
        {
          id: "n1",
          type: "text",
          label: "Component Composition",
          content:
            "Modern React favors **composition over inheritance**. Instead of building deep class hierarchies, you compose small, focused components together. This leads to more reusable, testable, and maintainable code. The key primitive is the **children prop** and **render props** pattern.",
        },
        {
          id: "n2",
          type: "code",
          label: "Custom Hook Pattern",
          language: "typescript",
          content: `import { useState, useCallback, useEffect } from 'react';

// Generic async state hook
function useAsync<T>(asyncFn: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({ data: null, loading: false, error: null });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await asyncFn();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, deps);

  useEffect(() => { execute(); }, [execute]);

  return { ...state, retry: execute };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useAsync(
    () => fetch(\`/api/users/\${userId}\`).then(r => r.json()),
    [userId]
  );

  if (loading) return <Skeleton />;
  if (error) return <Error message={error.message} />;
  return <ProfileCard user={user} />;
}`,
        },
        {
          id: "n3",
          type: "diagram",
          label: "Data Flow Architecture",
          content: `graph TD
    A[User Interaction] --> B[Component Event Handler]
    B --> C{Local or Global State?}
    C -->|Local| D[useState / useReducer]
    C -->|Global| E[React Query / Zustand]
    D --> F[Re-render Component]
    E --> G[API Request]
    G --> H[Cache Update]
    H --> F
    F --> I[Updated UI]
    style A fill:#3b82f6,color:#fff
    style I fill:#22c55e,color:#fff`,
        },
        {
          id: "n4",
          type: "math",
          label: "Performance: Render Cost",
          content:
            "T_{render} = \\sum_{i=1}^{n} T_{component_i} \\approx O(k) \\text{ with memoization}",
        },
      ],
    },
  },
];
