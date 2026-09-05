class MinHeap {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(item) {
    this.items.push(item);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.items[parent].priority <= this.items[i].priority) break;
      [this.items[parent], this.items[i]] = [this.items[i], this.items[parent]];
      i = parent;
    }
  }

  pop() {
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length) {
      this.items[0] = last;
      let i = 0;
      const n = this.items.length;
      while (true) {
        let smallest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && this.items[l].priority < this.items[smallest].priority) smallest = l;
        if (r < n && this.items[r].priority < this.items[smallest].priority) smallest = r;
        if (smallest === i) break;
        [this.items[smallest], this.items[i]] = [this.items[i], this.items[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

/**
 * Dijkstra clásico con min-heap binario: O((V + E) log V).
 * `graph` es un Map<nodeId, Array<{ to, weight }>>.
 */
export function dijkstra(graph, source) {
  const dist = new Map([[source, 0]]);
  const prev = new Map();
  const visited = new Set();
  const heap = new MinHeap();
  heap.push({ node: source, priority: 0 });

  while (heap.size) {
    const { node, priority } = heap.pop();
    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = graph.get(node) || [];
    for (const { to, weight } of neighbors) {
      const candidate = priority + weight;
      if (candidate < (dist.get(to) ?? Infinity)) {
        dist.set(to, candidate);
        prev.set(to, node);
        heap.push({ node: to, priority: candidate });
      }
    }
  }

  return { dist, prev };
}

export function reconstructPath(prev, source, target) {
  if (source === target) return [source];
  if (!prev.has(target)) return null;
  const path = [target];
  let current = target;
  while (current !== source) {
    current = prev.get(current);
    if (current === undefined) return null;
    path.push(current);
  }
  return path.reverse();
}
