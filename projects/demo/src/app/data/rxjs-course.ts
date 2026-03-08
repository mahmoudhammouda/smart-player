import { Scenario } from 'smart-player';

export const RXJS_COURSE: Scenario = {
  id: 'rxjs-advanced',
  name: 'Advanced RxJS',
  icon: 'rxjs',
  description: 'Subjects, multicasting, error handling, custom operators & testing',
  slide: {
    id: 'slide-rxjs-1',
    title: 'Advanced RxJS Course',
    description: 'Deep dive into Subjects, multicasting, error handling, custom operators, higher-order observables, and marble testing.',
    tags: ['rxjs', 'reactive', 'typescript', 'angular', 'observables'],
    nodes: [

      // ═══════════════════════════════════════════════════
      // TABLE OF CONTENTS
      // ═══════════════════════════════════════════════════
      {
        id: 'rx-toc',
        type: 'toc',
        content: [
          { title: 'Recap — Observer & Observable', level: 1 },
          { title: 'Observables are Unicast', level: 2 },
          { title: 'Subjects are Multicast', level: 1 },
          { title: 'Multicasting Operators', level: 1 },
          { title: 'connectable()', level: 2 },
          { title: 'connect() Operator', level: 2 },
          { title: 'share() Operator', level: 2 },
          { title: 'Subject Variants', level: 1 },
          { title: 'AsyncSubject', level: 2 },
          { title: 'BehaviorSubject', level: 2 },
          { title: 'ReplaySubject', level: 2 },
          { title: 'WebSocketSubject', level: 2 },
          { title: 'Error Handling', level: 1 },
          { title: 'throwError()', level: 2 },
          { title: 'catchError()', level: 2 },
          { title: 'finalize()', level: 2 },
          { title: 'retry()', level: 2 },
          { title: 'retryWhen()', level: 2 },
          { title: 'throwIfEmpty()', level: 2 },
          { title: 'Custom Operators', level: 1 },
          { title: 'Higher Order Observables', level: 1 },
          { title: 'Testing with Marble Diagrams', level: 1 },
        ],
      },

      // ═══════════════════════════════════════════════════
      // SECTION 1 — RECAP OBSERVER / OBSERVABLE
      // ═══════════════════════════════════════════════════
      { id: 'rx-div-1', type: 'divider', content: '', meta: { style: 'line' } },
      {
        id: 'rx-h1',
        type: 'heading',
        content: 'Recap — Observer & Observable',
        meta: { level: 1 },
      },
      {
        id: 'rx-recap-text',
        type: 'text',
        content: 'An **Observable** is a lazy push-based collection. It doesn\'t do anything until you **subscribe**. An **Observer** is the consumer — an object with `next`, `error`, and `complete` callbacks.\n\nThink of an Observable as a **function** that can return multiple values over time, both synchronously and asynchronously.',
      },
      {
        id: 'rx-recap-diagram',
        type: 'diagram',
        content: 'sequenceDiagram\n    participant O as Observable\n    participant S as Subscriber\n    S->>O: subscribe(observer)\n    O-->>S: next(value1)\n    O-->>S: next(value2)\n    O-->>S: next(value3)\n    O-->>S: complete()',
      },
      {
        id: 'rx-recap-code',
        type: 'code',
        language: 'typescript',
        label: 'Basic Observable & Observer',
        content: `import { Observable } from 'rxjs';

const observable$ = new Observable<number>(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

// The Observer
const observer = {
  next: (value: number) => console.log('Received:', value),
  error: (err: any) => console.error('Error:', err),
  complete: () => console.log('Done!'),
};

observable$.subscribe(observer);
// Output: Received: 1, Received: 2, Received: 3, Done!`,
      },
      {
        id: 'rx-recap-callout',
        type: 'callout',
        content: 'The three guarantees of the Observable contract:\n1. An Observable can emit **zero or more** `next` notifications\n2. It can emit **at most one** `error` OR `complete` notification (never both)\n3. After `error` or `complete`, **no more** values are emitted',
        meta: { variant: 'info', title: 'Observable Contract' },
      },

      // ═══════════════════════════════════════════════════
      // UNICAST
      // ═══════════════════════════════════════════════════
      { id: 'rx-div-2', type: 'divider', content: '', meta: { style: 'line' } },
      {
        id: 'rx-h-unicast',
        type: 'heading',
        content: 'Observables are Unicast',
        meta: { level: 2 },
      },
      {
        id: 'rx-unicast-text',
        type: 'text',
        content: 'Each subscription to an Observable triggers an **independent execution**. If the Observable makes an HTTP call, each subscriber fires its own request. This is **unicast** behavior — one producer per consumer.',
      },
      {
        id: 'rx-unicast-code',
        type: 'code',
        language: 'typescript',
        label: 'Unicast Demonstration',
        content: `import { Observable } from 'rxjs';

const random$ = new Observable<number>(subscriber => {
  const value = Math.random();
  console.log('Producing:', value);
  subscriber.next(value);
  subscriber.complete();
});

// Each subscription gets its OWN value
random$.subscribe(v => console.log('Sub A:', v));
random$.subscribe(v => console.log('Sub B:', v));
// Output:
// Producing: 0.4812...
// Sub A: 0.4812...
// Producing: 0.7231...   <-- different execution!
// Sub B: 0.7231...`,
      },
      {
        id: 'rx-unicast-key',
        type: 'key-concept',
        content: 'Each call to `subscribe()` triggers a **new, independent** execution of the Observable\'s producer function. Subscribers do not share the same stream — they each get their own.',
        meta: { term: 'Unicast' },
      },

      // EXERCISE — UNICAST
      {
        id: 'rx-ex-unicast',
        type: 'callout',
        content: 'Create an Observable that emits the current timestamp (`Date.now()`) on subscribe. Subscribe **three times** and verify each subscriber receives a **different** timestamp. Add a 100ms delay between subscriptions using `setTimeout`.',
        meta: { variant: 'tip', title: '📝 Exercise — Unicast' },
      },
      {
        id: 'rx-sol-unicast-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — Unicast',
            body: '```typescript\nimport { Observable } from \'rxjs\';\n\nconst timestamp$ = new Observable<number>(subscriber => {\n  subscriber.next(Date.now());\n  subscriber.complete();\n});\n\ntimestamp$.subscribe(ts => console.log(\'Sub 1:\', ts));\n\nsetTimeout(() => {\n  timestamp$.subscribe(ts => console.log(\'Sub 2:\', ts));\n}, 100);\n\nsetTimeout(() => {\n  timestamp$.subscribe(ts => console.log(\'Sub 3:\', ts));\n}, 200);\n// Each subscriber logs a different timestamp\n```',
          },
        ],
      },

      // ═══════════════════════════════════════════════════
      // SUBJECTS — MULTICAST
      // ═══════════════════════════════════════════════════
      { id: 'rx-div-3', type: 'divider', content: '', meta: { style: 'line' } },
      {
        id: 'rx-h-subjects',
        type: 'heading',
        content: 'Subjects are Multicast',
        meta: { level: 1 },
      },
      {
        id: 'rx-subjects-text',
        type: 'text',
        content: 'A **Subject** is both an Observable **and** an Observer. It maintains a list of subscribers and broadcasts each value to **all of them** simultaneously. This is **multicast** behavior.\n\nUnlike a plain Observable where each subscription creates an independent execution, a Subject shares a single execution among all subscribers.',
      },
      {
        id: 'rx-subjects-diagram',
        type: 'diagram',
        content: 'graph LR\n    P[Producer] -->|next| S((Subject))\n    S -->|next| A[Subscriber A]\n    S -->|next| B[Subscriber B]\n    S -->|next| C[Subscriber C]',
      },
      {
        id: 'rx-subjects-code',
        type: 'code',
        language: 'typescript',
        label: 'Subject — Multicast',
        content: `import { Subject } from 'rxjs';

const subject = new Subject<number>();

// Subscribe BEFORE emitting
subject.subscribe(v => console.log('Sub A:', v));
subject.subscribe(v => console.log('Sub B:', v));

subject.next(1);
subject.next(2);
subject.complete();

// Output:
// Sub A: 1
// Sub B: 1   <-- same value, shared execution
// Sub A: 2
// Sub B: 2`,
      },
      {
        id: 'rx-subjects-callout',
        type: 'callout',
        content: 'A Subject that is subscribed to **after** a value has been emitted will **miss** that value. Late subscribers only receive future emissions. This is an important distinction from BehaviorSubject and ReplaySubject (covered later).',
        meta: { variant: 'warning', title: 'Late Subscribers' },
      },

      // EXERCISE — MULTICAST
      {
        id: 'rx-ex-multicast',
        type: 'callout',
        content: 'Create a Subject of type `string`. Subscribe two observers to it. Then emit the values `"Hello"`, `"World"`. Subscribe a **third** observer, then emit `"!"`. Observe that the third subscriber only receives `"!"` and not the previous values.',
        meta: { variant: 'tip', title: '📝 Exercise — Multicast' },
      },
      {
        id: 'rx-sol-multicast-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — Multicast',
            body: '```typescript\nimport { Subject } from \'rxjs\';\n\nconst subject = new Subject<string>();\n\nsubject.subscribe(v => console.log(\'A:\', v));\nsubject.subscribe(v => console.log(\'B:\', v));\n\nsubject.next(\'Hello\');\nsubject.next(\'World\');\n\n// Late subscriber\nsubject.subscribe(v => console.log(\'C:\', v));\n\nsubject.next(\'!\');\n// A: Hello, B: Hello, A: World, B: World\n// A: !, B: !, C: !    <-- C only gets \"!\"\n```',
          },
        ],
      },

      // ═══════════════════════════════════════════════════
      // MULTICASTING OPERATORS
      // ═══════════════════════════════════════════════════
      { id: 'rx-div-4', type: 'divider', content: '', meta: { style: 'line' } },
      {
        id: 'rx-h-multicast-ops',
        type: 'heading',
        content: 'Multicasting Operators',
        meta: { level: 1 },
      },
      {
        id: 'rx-multicast-ops-text',
        type: 'text',
        content: 'RxJS provides several operators and utilities to convert a **unicast** Observable into a **multicast** one without manually managing a Subject. These operators control **when** the underlying source is subscribed to and **how** values are shared.',
      },

      // ── connectable() ──
      {
        id: 'rx-h-connectable',
        type: 'heading',
        content: 'connectable()',
        meta: { level: 2 },
      },
      {
        id: 'rx-connectable-text',
        type: 'text',
        content: 'The `connectable()` function wraps an Observable and returns a `ConnectableObservable`. Subscribers can subscribe, but the source won\'t execute until you call `.connect()`. This lets you set up all subscribers **before** any values flow.',
      },
      {
        id: 'rx-connectable-code',
        type: 'code',
        language: 'typescript',
        label: 'connectable() Usage',
        content: `import { connectable, interval, take } from 'rxjs';

const source$ = interval(1000).pipe(take(3));
const multicasted$ = connectable(source$);

// Set up subscribers first — no values yet
multicasted$.subscribe(v => console.log('A:', v));
multicasted$.subscribe(v => console.log('B:', v));

// NOW start the shared execution
const connection = multicasted$.connect();

// After 3 seconds:
// A: 0, B: 0, A: 1, B: 1, A: 2, B: 2

// To stop early:
// connection.unsubscribe();`,
      },
      {
        id: 'rx-connectable-callout',
        type: 'callout',
        content: 'By default, `connectable()` uses a plain `Subject` internally. You can pass a `connector` option to use a different Subject type:\n```typescript\nconnectable(source$, { connector: () => new ReplaySubject(1) })\n```',
        meta: { variant: 'info', title: 'Custom Connector' },
      },

      // EXERCISE — connectable()
      {
        id: 'rx-ex-connectable',
        type: 'callout',
        content: 'Use `connectable()` with `interval(500)` and `take(4)`. Set up **two** subscribers. Call `connect()` and verify both subscribers receive the same 4 values at the same time.',
        meta: { variant: 'tip', title: '📝 Exercise — connectable()' },
      },
      {
        id: 'rx-sol-connectable-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — connectable()',
            body: '```typescript\nimport { connectable, interval, take } from \'rxjs\';\n\nconst source$ = interval(500).pipe(take(4));\nconst multi$ = connectable(source$);\n\nmulti$.subscribe(v => console.log(\'Observer 1:\', v));\nmulti$.subscribe(v => console.log(\'Observer 2:\', v));\n\nmulti$.connect();\n// Both observers receive 0, 1, 2, 3 in lockstep\n```',
          },
        ],
      },

      // ── connect() operator ──
      {
        id: 'rx-h-connect-op',
        type: 'heading',
        content: 'connect() Operator',
        meta: { level: 2 },
      },
      {
        id: 'rx-connect-op-text',
        type: 'text',
        content: 'The `connect()` **operator** (not to be confused with the `.connect()` method) is a pipeable operator that lets you share an Observable with multiple inner subscriptions defined via a **selector function**. The source is subscribed **once** and all inner subscriptions share that execution.',
      },
      {
        id: 'rx-connect-op-code',
        type: 'code',
        language: 'typescript',
        label: 'connect() Operator',
        content: `import { interval, connect, take, map, merge } from 'rxjs';

const source$ = interval(1000).pipe(take(4));

source$.pipe(
  connect(shared$ => merge(
    shared$.pipe(map(v => \`Even check: \${v % 2 === 0}\`)),
    shared$.pipe(map(v => \`Doubled: \${v * 2}\`)),
  ))
).subscribe(console.log);

// Output (interleaved):
// Even check: true
// Doubled: 0
// Even check: false
// Doubled: 2
// ...`,
      },
      {
        id: 'rx-connect-op-key',
        type: 'key-concept',
        content: 'The `connect()` operator ensures the source Observable is subscribed to **only once**. The selector function receives a shared Observable and must return a new Observable that combines inner subscriptions as needed.',
        meta: { term: 'connect() Operator' },
      },

      // EXERCISE — connect()
      {
        id: 'rx-ex-connect-op',
        type: 'callout',
        content: 'Use `connect()` to share an `interval(300).pipe(take(5))` source. Inside the selector, create two inner streams: one that filters even values and one that maps values to their square. Merge them and subscribe.',
        meta: { variant: 'tip', title: '📝 Exercise — connect() Operator' },
      },
      {
        id: 'rx-sol-connect-op-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — connect() Operator',
            body: '```typescript\nimport { interval, connect, take, map, filter, merge } from \'rxjs\';\n\ninterval(300).pipe(\n  take(5),\n  connect(shared$ => merge(\n    shared$.pipe(filter(v => v % 2 === 0), map(v => `Even: ${v}`)),\n    shared$.pipe(map(v => `Square: ${v * v}`)),\n  ))\n).subscribe(console.log);\n```',
          },
        ],
      },

      // ── share() ──
      {
        id: 'rx-h-share',
        type: 'heading',
        content: 'share() Operator',
        meta: { level: 2 },
      },
      {
        id: 'rx-share-text',
        type: 'text',
        content: 'The `share()` operator is the most commonly used multicasting operator. It automatically:\n\n1. **Subscribes** to the source when the **first** subscriber subscribes\n2. **Multicasts** values to all current subscribers\n3. **Unsubscribes** from the source when the **last** subscriber unsubscribes\n\nIt\'s essentially a `Subject`-based multicast with reference counting.',
      },
      {
        id: 'rx-share-code',
        type: 'code',
        language: 'typescript',
        label: 'share() in Action',
        content: `import { interval, take, share, tap } from 'rxjs';

const source$ = interval(1000).pipe(
  take(3),
  tap(v => console.log('Source emits:', v)),
  share()  // <-- multicast with refcount
);

// First subscriber triggers source subscription
source$.subscribe(v => console.log('A:', v));

// Second subscriber joins the shared stream
setTimeout(() => {
  source$.subscribe(v => console.log('B:', v));
}, 1500);

// Output:
// Source emits: 0  (t=1s)
// A: 0
// Source emits: 1  (t=2s)  -- source runs only ONCE
// A: 1
// B: 1             <-- B joins and gets value 1
// Source emits: 2  (t=3s)
// A: 2
// B: 2`,
      },
      {
        id: 'rx-share-config',
        type: 'code',
        language: 'typescript',
        label: 'share() Configuration Options',
        content: `import { share, ReplaySubject, timer } from 'rxjs';

source$.pipe(
  share({
    connector: () => new ReplaySubject(1),  // replay last value to late subscribers
    resetOnError: true,      // reset on error (default: true)
    resetOnComplete: false,  // keep completed state (default: true)
    resetOnRefCountZero: () => timer(2000),  // wait 2s before resetting
  })
);`,
      },
      {
        id: 'rx-share-callout',
        type: 'callout',
        content: '`share()` replaces the deprecated `publish()`, `publishReplay()`, `publishLast()`, and `multicast()` operators from RxJS 6. Use `share()` with its configuration options instead.',
        meta: { variant: 'warning', title: 'Deprecation Notice' },
      },

      // EXERCISE — share()
      {
        id: 'rx-ex-share',
        type: 'callout',
        content: 'Create an Observable using `ajax.getJSON()` (or simulate with `defer(() => of(...))`) and apply `share()`. Subscribe **twice** immediately. Verify the HTTP call (or factory) is invoked only **once**. Then add a `share({ connector: () => new ReplaySubject(1) })` and subscribe a **late** subscriber — confirm it gets the last emitted value.',
        meta: { variant: 'tip', title: '📝 Exercise — share()' },
      },
      {
        id: 'rx-sol-share-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — share()',
            body: '```typescript\nimport { defer, of, share, ReplaySubject, delay } from \'rxjs\';\n\nlet callCount = 0;\nconst api$ = defer(() => {\n  callCount++;\n  console.log(\'API called! Count:\', callCount);\n  return of({ id: 1, name: \'RxJS\' });\n}).pipe(\n  delay(500),\n  share({ connector: () => new ReplaySubject(1) })\n);\n\napi$.subscribe(v => console.log(\'Sub 1:\', v));\napi$.subscribe(v => console.log(\'Sub 2:\', v));\n// API called! Count: 1  <-- only once!\n\nsetTimeout(() => {\n  api$.subscribe(v => console.log(\'Late sub:\', v));\n  // Late sub gets the replayed value\n}, 2000);\n```',
          },
        ],
      },

      // ═══════════════════════════════════════════════════
      // SUBJECT VARIANTS
      // ═══════════════════════════════════════════════════
      { id: 'rx-div-5', type: 'divider', content: '', meta: { style: 'line' } },
      {
        id: 'rx-h-variants',
        type: 'heading',
        content: 'Subject Variants',
        meta: { level: 1 },
      },
      {
        id: 'rx-variants-text',
        type: 'text',
        content: 'RxJS offers four Subject variants, each with different behavior for **late subscribers** and **value retention**:',
      },
      {
        id: 'rx-variants-table',
        type: 'table',
        content: {
          headers: ['Subject Type', 'Emits to Late Subscriber', 'Buffer', 'Use Case'],
          rows: [
            ['Subject', 'Nothing (only future values)', 'None', 'Event bus, simple multicast'],
            ['AsyncSubject', 'Last value on complete', '1 (last)', 'HTTP-like single-value streams'],
            ['BehaviorSubject', 'Current value immediately', '1 (current)', 'State management, current user'],
            ['ReplaySubject', 'N buffered values', 'N (configurable)', 'Chat history, audit log'],
          ],
        },
        meta: { caption: 'Subject Variants Comparison' },
      },

      // ── AsyncSubject ──
      {
        id: 'rx-h-async-subject',
        type: 'heading',
        content: 'AsyncSubject',
        meta: { level: 2 },
      },
      {
        id: 'rx-async-subject-text',
        type: 'text',
        content: 'An `AsyncSubject` only emits the **last value** to its subscribers, and only when it **completes**. If it errors, no value is emitted — only the error. This is similar to a `Promise` that resolves to a single value.',
      },
      {
        id: 'rx-async-subject-code',
        type: 'code',
        language: 'typescript',
        label: 'AsyncSubject',
        content: `import { AsyncSubject } from 'rxjs';

const subject = new AsyncSubject<number>();

subject.subscribe(v => console.log('A:', v));

subject.next(1);
subject.next(2);
subject.next(3);

// Nothing logged yet — AsyncSubject waits for complete()
subject.subscribe(v => console.log('B:', v));

subject.complete();
// NOW both subscribers receive the LAST value:
// A: 3
// B: 3`,
      },

      // Exercise — AsyncSubject
      {
        id: 'rx-ex-async-subject',
        type: 'callout',
        content: 'Create an AsyncSubject. Emit values `10, 20, 30`. Subscribe **before** and **after** calling `complete()`. Verify that:\n1. No subscriber receives anything until `complete()` is called\n2. Both subscribers receive only `30` (the last value)\n3. Even post-complete subscribers get `30`',
        meta: { variant: 'tip', title: '📝 Exercise — AsyncSubject' },
      },
      {
        id: 'rx-sol-async-subject-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — AsyncSubject',
            body: '```typescript\nimport { AsyncSubject } from \'rxjs\';\n\nconst async$ = new AsyncSubject<number>();\n\nasync$.subscribe(v => console.log(\'Before complete:\', v));\n\nasync$.next(10);\nasync$.next(20);\nasync$.next(30);\nasync$.complete();\n// Before complete: 30\n\n// Subscribe AFTER complete\nasync$.subscribe(v => console.log(\'After complete:\', v));\n// After complete: 30\n```',
          },
        ],
      },

      // ── BehaviorSubject ──
      {
        id: 'rx-h-behavior-subject',
        type: 'heading',
        content: 'BehaviorSubject',
        meta: { level: 2 },
      },
      {
        id: 'rx-behavior-subject-text',
        type: 'text',
        content: 'A `BehaviorSubject` requires an **initial value** and always emits the **current value** to new subscribers immediately. It\'s the go-to choice for state management in Angular services.',
      },
      {
        id: 'rx-behavior-subject-code',
        type: 'code',
        language: 'typescript',
        label: 'BehaviorSubject for State Management',
        content: `import { BehaviorSubject } from 'rxjs';

// Must provide an initial value
const currentUser$ = new BehaviorSubject<string | null>(null);

// Subscriber gets the current value immediately
currentUser$.subscribe(user => console.log('A:', user));
// A: null  <-- immediate

currentUser$.next('Alice');
// A: Alice

// Late subscriber gets the CURRENT value
currentUser$.subscribe(user => console.log('B:', user));
// B: Alice  <-- gets current value, not null

currentUser$.next('Bob');
// A: Bob
// B: Bob

// You can also read the value synchronously:
console.log('Current:', currentUser$.getValue()); // Bob`,
      },
      {
        id: 'rx-behavior-subject-pattern',
        type: 'code',
        language: 'typescript',
        label: 'Angular Service Pattern with BehaviorSubject',
        content: `@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(null);

  // Expose as Observable (consumers can't call next)
  readonly user$ = this._user$.asObservable();

  // Synchronous getter
  get currentUser(): User | null {
    return this._user$.getValue();
  }

  login(user: User): void {
    this._user$.next(user);
  }

  logout(): void {
    this._user$.next(null);
  }
}`,
      },

      // Exercise — BehaviorSubject
      {
        id: 'rx-ex-behavior-subject',
        type: 'callout',
        content: 'Build a simple `ThemeService` using `BehaviorSubject<\'light\' | \'dark\'>` with an initial value of `\'light\'`. Create a `toggle()` method that switches between light and dark. Subscribe a component-like observer, call toggle twice, and verify the subscriber gets: `light` (initial), `dark`, `light`.',
        meta: { variant: 'tip', title: '📝 Exercise — BehaviorSubject' },
      },
      {
        id: 'rx-sol-behavior-subject-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — BehaviorSubject',
            body: '```typescript\nimport { BehaviorSubject } from \'rxjs\';\n\nclass ThemeService {\n  private _theme$ = new BehaviorSubject<\'light\' | \'dark\'>(\'light\');\n  readonly theme$ = this._theme$.asObservable();\n\n  toggle(): void {\n    const next = this._theme$.getValue() === \'light\' ? \'dark\' : \'light\';\n    this._theme$.next(next);\n  }\n}\n\nconst svc = new ThemeService();\nsvc.theme$.subscribe(t => console.log(\'Theme:\', t));\n// Theme: light\nsvc.toggle();\n// Theme: dark\nsvc.toggle();\n// Theme: light\n```',
          },
        ],
      },

      // ── ReplaySubject ──
      {
        id: 'rx-h-replay-subject',
        type: 'heading',
        content: 'ReplaySubject',
        meta: { level: 2 },
      },
      {
        id: 'rx-replay-subject-text',
        type: 'text',
        content: 'A `ReplaySubject` records **N** values and replays them to every new subscriber. You can also specify a **time window** — values older than the window are discarded.',
      },
      {
        id: 'rx-replay-columns',
        type: 'columns-layout',
        content: [
          [
            {
              id: 'rx-replay-col1-code',
              type: 'code',
              language: 'typescript',
              label: 'Buffer by Count',
              content: `import { ReplaySubject } from 'rxjs';

// Replay last 2 values
const rs = new ReplaySubject<number>(2);

rs.next(1);
rs.next(2);
rs.next(3);

rs.subscribe(v => console.log(v));
// 2, 3  (only the last 2)`,
            },
          ],
          [
            {
              id: 'rx-replay-col2-code',
              type: 'code',
              language: 'typescript',
              label: 'Buffer by Time',
              content: `import { ReplaySubject } from 'rxjs';

// Replay values from last 500ms
const rs = new ReplaySubject<number>(
  Infinity, // buffer size
  500       // windowTime in ms
);

rs.next(1);  // t=0
setTimeout(() => {
  rs.next(2);  // t=300
  setTimeout(() => {
    rs.subscribe(v => console.log(v));
    // Only 2 (1 is too old)
  }, 300);  // t=600
}, 300);`,
            },
          ],
        ],
        meta: { columns: 2 },
      },

      // Exercise — ReplaySubject
      {
        id: 'rx-ex-replay-subject',
        type: 'callout',
        content: 'Create a `ReplaySubject<string>` with a buffer of **3**. Emit 5 messages: `"A", "B", "C", "D", "E"`. Then subscribe. Verify the subscriber receives only `"C", "D", "E"` (the last 3).',
        meta: { variant: 'tip', title: '📝 Exercise — ReplaySubject' },
      },
      {
        id: 'rx-sol-replay-subject-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — ReplaySubject',
            body: '```typescript\nimport { ReplaySubject } from \'rxjs\';\n\nconst replay$ = new ReplaySubject<string>(3);\n\nreplay$.next(\'A\');\nreplay$.next(\'B\');\nreplay$.next(\'C\');\nreplay$.next(\'D\');\nreplay$.next(\'E\');\n\nreplay$.subscribe(v => console.log(v));\n// C\n// D\n// E\n```',
          },
        ],
      },

      // ── WebSocketSubject ──
      {
        id: 'rx-h-websocket-subject',
        type: 'heading',
        content: 'WebSocketSubject',
        meta: { level: 2 },
      },
      {
        id: 'rx-websocket-subject-text',
        type: 'text',
        content: 'The `WebSocketSubject` from `rxjs/webSocket` wraps a WebSocket connection as an Observable. It automatically handles **serialization** (JSON.stringify on send) and **deserialization** (JSON.parse on receive). Subscribing opens the connection; unsubscribing closes it.',
      },
      {
        id: 'rx-websocket-code',
        type: 'code',
        language: 'typescript',
        label: 'WebSocketSubject',
        content: `import { webSocket } from 'rxjs/webSocket';

// Create a WebSocket connection
const ws$ = webSocket<{ type: string; data: any }>('wss://echo.websocket.org');

// Subscribe opens the connection
ws$.subscribe({
  next: msg => console.log('Received:', msg),
  error: err => console.error('WS Error:', err),
  complete: () => console.log('Connection closed'),
});

// Send data (auto-serialized to JSON)
ws$.next({ type: 'greeting', data: 'Hello server!' });

// Multiplex — filter messages by channel
const chat$ = ws$.multiplex(
  () => ({ subscribe: 'chat' }),     // sent on subscribe
  () => ({ unsubscribe: 'chat' }),   // sent on unsubscribe
  msg => msg.type === 'chat'         // filter incoming
);

chat$.subscribe(msg => console.log('Chat:', msg.data));`,
      },
      {
        id: 'rx-websocket-callout',
        type: 'callout',
        content: 'WebSocketSubject **reconnects automatically** if you resubscribe after an error or completion. Combine with `retry()` or `retryWhen()` for automatic reconnection strategies.',
        meta: { variant: 'info', title: 'Auto-reconnect' },
      },

      // Exercise — WebSocketSubject
      {
        id: 'rx-ex-websocket',
        type: 'callout',
        content: 'Create a `webSocket` connection to `wss://echo.websocket.org`. Send `{ message: "ping" }` and subscribe to log the echoed response. Add `retry(3)` to auto-reconnect on failure. Use `finalize()` to log when the subscription is torn down.',
        meta: { variant: 'tip', title: '📝 Exercise — WebSocketSubject' },
      },
      {
        id: 'rx-sol-websocket-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — WebSocketSubject',
            body: '```typescript\nimport { webSocket } from \'rxjs/webSocket\';\nimport { retry, finalize } from \'rxjs\';\n\nconst ws$ = webSocket(\'wss://echo.websocket.org\');\n\nws$.pipe(\n  retry(3),\n  finalize(() => console.log(\'Subscription torn down\'))\n).subscribe({\n  next: msg => console.log(\'Echo:\', msg),\n  error: err => console.error(\'Failed after 3 retries:\', err),\n});\n\nws$.next({ message: \'ping\' });\n```',
          },
        ],
      },

      // ═══════════════════════════════════════════════════
      // ERROR HANDLING
      // ═══════════════════════════════════════════════════
      { id: 'rx-div-6', type: 'divider', content: '', meta: { style: 'line' } },
      {
        id: 'rx-h-errors',
        type: 'heading',
        content: 'Error Handling',
        meta: { level: 1 },
      },
      {
        id: 'rx-errors-text',
        type: 'text',
        content: 'Errors in RxJS are **terminal** — once an error notification is sent, the Observable stops emitting. RxJS provides several operators to intercept, recover from, retry, and clean up after errors.',
      },
      {
        id: 'rx-error-flow-diagram',
        type: 'diagram',
        content: 'graph TD\n    A[Source Observable] -->|error| B{catchError?}\n    B -->|Yes| C[Recovery Observable]\n    B -->|No| D[Error propagates to subscriber]\n    A -->|error| E{retry?}\n    E -->|attempts left| A\n    E -->|exhausted| D\n    A -->|complete/error| F[finalize cleanup]',
      },

      // ── Error Notification ──
      {
        id: 'rx-h-error-notif',
        type: 'heading',
        content: 'Error Notification',
        meta: { level: 2 },
      },
      {
        id: 'rx-error-notif-text',
        type: 'text',
        content: 'When an Observable encounters an error (either thrown inside the producer or via `subscriber.error()`), it sends an **error notification** to the subscriber. This notification is **terminal** — no more `next` or `complete` calls follow.',
      },
      {
        id: 'rx-error-notif-code',
        type: 'code',
        language: 'typescript',
        label: 'Error Notification Example',
        content: `import { Observable } from 'rxjs';

const broken$ = new Observable<number>(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.error(new Error('Something went wrong!'));
  subscriber.next(3); // NEVER reached
});

broken$.subscribe({
  next: v => console.log('Value:', v),
  error: err => console.error('Error:', err.message),
  complete: () => console.log('Complete'), // NEVER called
});

// Output:
// Value: 1
// Value: 2
// Error: Something went wrong!`,
      },

      // ── throwError() ──
      {
        id: 'rx-h-throwerror',
        type: 'heading',
        content: 'throwError() Operator',
        meta: { level: 2 },
      },
      {
        id: 'rx-throwerror-text',
        type: 'text',
        content: '`throwError()` creates an Observable that **immediately** emits an error notification without emitting any `next` values. It\'s commonly used inside `catchError()` to rethrow or map errors.',
      },
      {
        id: 'rx-throwerror-code',
        type: 'code',
        language: 'typescript',
        label: 'throwError()',
        content: `import { throwError, of, catchError } from 'rxjs';

// Factory function form (recommended)
const err$ = throwError(() => new Error('Custom error'));

err$.subscribe({
  next: v => console.log(v),       // never called
  error: e => console.error(e.message), // "Custom error"
});

// Common pattern: rethrow a mapped error
source$.pipe(
  catchError(err => throwError(() =>
    new Error(\`Request failed: \${err.status}\`)
  ))
);`,
      },

      // Exercise — throwError()
      {
        id: 'rx-ex-throwerror',
        type: 'callout',
        content: 'Create an Observable that emits `1, 2, 3` then errors with `"Oops"`. Use `catchError` to catch the error and rethrow it as a new Error with the message `"Mapped: Oops"` using `throwError()`.',
        meta: { variant: 'tip', title: '📝 Exercise — throwError()' },
      },
      {
        id: 'rx-sol-throwerror-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — throwError()',
            body: '```typescript\nimport { Observable, catchError, throwError } from \'rxjs\';\n\nconst source$ = new Observable<number>(sub => {\n  sub.next(1);\n  sub.next(2);\n  sub.next(3);\n  sub.error(\'Oops\');\n});\n\nsource$.pipe(\n  catchError(err => throwError(() => new Error(`Mapped: ${err}`)))\n).subscribe({\n  next: v => console.log(v),\n  error: e => console.error(e.message), // \"Mapped: Oops\"\n});\n// 1, 2, 3, Error: Mapped: Oops\n```',
          },
        ],
      },

      // ── catchError() ──
      {
        id: 'rx-h-catcherror',
        type: 'heading',
        content: 'catchError() Operator',
        meta: { level: 2 },
      },
      {
        id: 'rx-catcherror-text',
        type: 'text',
        content: '`catchError()` intercepts an error and lets you **recover** by returning a new Observable. The original source is replaced by the recovery Observable. You can also rethrow to propagate the error.',
      },
      {
        id: 'rx-catcherror-code',
        type: 'code',
        language: 'typescript',
        label: 'catchError() Patterns',
        content: `import { of, throwError, catchError, map } from 'rxjs';

// Pattern 1: Replace with fallback value
source$.pipe(
  catchError(err => {
    console.warn('Error caught:', err);
    return of('fallback value');  // recover
  })
);

// Pattern 2: Rethrow (transform error)
source$.pipe(
  catchError(err => throwError(() =>
    new HttpError(err.status, err.message)
  ))
);

// Pattern 3: Retry the source (2nd arg = source)
source$.pipe(
  catchError((err, caught$) => {
    if (err.status === 503) {
      return caught$;  // retry by resubscribing to source
    }
    return throwError(() => err);
  })
);

// Pattern 4: Return EMPTY to swallow errors silently
import { EMPTY } from 'rxjs';
source$.pipe(
  catchError(() => EMPTY)  // completes silently
);`,
      },

      // Exercise — catchError()
      {
        id: 'rx-ex-catcherror',
        type: 'callout',
        content: 'Simulate an HTTP call that fails with `{ status: 404, message: "Not found" }`. Use `catchError` to return a fallback value `{ id: 0, name: "Default User" }`. Then change the error status to `500` and rethrow it as a `ServerError`.',
        meta: { variant: 'tip', title: '📝 Exercise — catchError()' },
      },
      {
        id: 'rx-sol-catcherror-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — catchError()',
            body: '```typescript\nimport { throwError, of, catchError } from \'rxjs\';\n\nconst api$ = throwError(() => ({ status: 404, message: \'Not found\' }));\n\n// Fallback\napi$.pipe(\n  catchError(err => {\n    if (err.status === 404) {\n      return of({ id: 0, name: \'Default User\' });\n    }\n    return throwError(() => err);\n  })\n).subscribe(v => console.log(v));\n// { id: 0, name: \'Default User\' }\n\n// Rethrow for 500\nconst api500$ = throwError(() => ({ status: 500, message: \'Server error\' }));\napi500$.pipe(\n  catchError(err => {\n    if (err.status >= 500) {\n      return throwError(() => new Error(`ServerError: ${err.message}`));\n    }\n    return of(null);\n  })\n).subscribe({ error: e => console.error(e.message) });\n// ServerError: Server error\n```',
          },
        ],
      },

      // ── finalize() ──
      {
        id: 'rx-h-finalize',
        type: 'heading',
        content: 'finalize() Operator',
        meta: { level: 2 },
      },
      {
        id: 'rx-finalize-text',
        type: 'text',
        content: '`finalize()` is like a `finally` block — it runs a callback when the Observable **completes**, **errors**, or is **unsubscribed**. It\'s perfect for cleanup tasks like hiding spinners, closing connections, or releasing resources.',
      },
      {
        id: 'rx-finalize-code',
        type: 'code',
        language: 'typescript',
        label: 'finalize() for Cleanup',
        content: `import { of, delay, finalize, throwError } from 'rxjs';

// Runs on complete
of('data').pipe(
  delay(1000),
  finalize(() => console.log('Cleanup! (complete)'))
).subscribe(console.log);
// data
// Cleanup! (complete)

// Runs on error too
throwError(() => new Error('fail')).pipe(
  finalize(() => console.log('Cleanup! (error)'))
).subscribe({ error: () => {} });
// Cleanup! (error)

// Common Angular pattern:
this.loading = true;
this.http.get('/api/data').pipe(
  finalize(() => this.loading = false)
).subscribe(data => this.data = data);`,
      },

      // Exercise — finalize()
      {
        id: 'rx-ex-finalize',
        type: 'callout',
        content: 'Create an Observable that emits values `1, 2` then completes. Add `finalize()` to log `"Cleaned up"`. Then create another that errors — verify finalize still runs. Add a `tap()` for logging each value before finalize.',
        meta: { variant: 'tip', title: '📝 Exercise — finalize()' },
      },
      {
        id: 'rx-sol-finalize-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — finalize()',
            body: '```typescript\nimport { of, throwError, finalize, tap } from \'rxjs\';\n\nof(1, 2).pipe(\n  tap(v => console.log(\'Value:\', v)),\n  finalize(() => console.log(\'Cleaned up\'))\n).subscribe({ complete: () => console.log(\'Done\') });\n// Value: 1, Value: 2, Done, Cleaned up\n\nthrowError(() => new Error(\'oops\')).pipe(\n  finalize(() => console.log(\'Cleaned up after error\'))\n).subscribe({ error: () => console.log(\'Error handled\') });\n// Error handled, Cleaned up after error\n```',
          },
        ],
      },

      // ── retry() ──
      {
        id: 'rx-h-retry',
        type: 'heading',
        content: 'retry() Operator',
        meta: { level: 2 },
      },
      {
        id: 'rx-retry-text',
        type: 'text',
        content: '`retry()` resubscribes to the source Observable when an error occurs, up to a specified count. In RxJS 7+, `retry()` accepts a configuration object with `count`, `delay`, and `resetOnSuccess` options.',
      },
      {
        id: 'rx-retry-code',
        type: 'code',
        language: 'typescript',
        label: 'retry() with Configuration',
        content: `import { interval, tap, retry, timer, map } from 'rxjs';

let attempt = 0;

const flaky$ = interval(500).pipe(
  tap(() => {
    attempt++;
    if (attempt % 3 !== 0) {
      throw new Error(\`Attempt \${attempt} failed\`);
    }
  })
);

flaky$.pipe(
  retry({
    count: 5,                   // max 5 retries
    delay: (error, retryCount) => {
      console.log(\`Retry #\${retryCount}: \${error.message}\`);
      return timer(retryCount * 1000);  // exponential backoff
    },
    resetOnSuccess: true,       // reset count after a success
  })
).subscribe({
  next: v => console.log('Success:', v),
  error: e => console.error('All retries exhausted:', e.message),
});`,
      },

      // Exercise — retry()
      {
        id: 'rx-ex-retry',
        type: 'callout',
        content: 'Simulate a flaky API that succeeds on the 3rd attempt. Use `retry({ count: 3, delay: 500 })`. Log each retry attempt. Verify the subscriber receives the value on the 3rd attempt. Then reduce `count` to `1` and verify the error reaches the subscriber.',
        meta: { variant: 'tip', title: '📝 Exercise — retry()' },
      },
      {
        id: 'rx-sol-retry-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — retry()',
            body: '```typescript\nimport { defer, of, throwError, retry, timer } from \'rxjs\';\n\nlet attempt = 0;\nconst flakyApi$ = defer(() => {\n  attempt++;\n  console.log(`Attempt ${attempt}`);\n  if (attempt < 3) {\n    return throwError(() => new Error(\'Server unavailable\'));\n  }\n  return of({ data: \'success\' });\n});\n\nflakyApi$.pipe(\n  retry({ count: 3, delay: () => timer(500) })\n).subscribe({\n  next: v => console.log(\'Got:\', v),\n  error: e => console.error(\'Failed:\', e.message),\n});\n// Attempt 1, Attempt 2, Attempt 3, Got: { data: \'success\' }\n```',
          },
        ],
      },

      // ── retryWhen() ──
      {
        id: 'rx-h-retrywhen',
        type: 'heading',
        content: 'retryWhen() Operator',
        meta: { level: 2 },
      },
      {
        id: 'rx-retrywhen-callout',
        type: 'callout',
        content: '`retryWhen()` is **deprecated** in RxJS 7+. Use `retry({ delay: (error, retryCount) => ... })` instead. This section is included for legacy codebases.',
        meta: { variant: 'warning', title: 'Deprecated' },
      },
      {
        id: 'rx-retrywhen-code',
        type: 'code',
        language: 'typescript',
        label: 'retryWhen() (Legacy)',
        content: `import { interval, retryWhen, delay, take, tap } from 'rxjs';

// Legacy pattern — DO NOT use in new code
source$.pipe(
  retryWhen(errors$ =>
    errors$.pipe(
      tap(err => console.log('Error:', err)),
      delay(2000),      // wait 2 seconds between retries
      take(3)           // max 3 retries
    )
  )
);

// Modern equivalent using retry():
source$.pipe(
  retry({
    count: 3,
    delay: () => timer(2000),
  })
);`,
      },

      // Exercise — retryWhen()
      {
        id: 'rx-ex-retrywhen',
        type: 'callout',
        content: 'Refactor a `retryWhen()` call to use `retry()` with delay configuration. The legacy code retries 5 times with a 1-second delay. Write the modern equivalent.',
        meta: { variant: 'tip', title: '📝 Exercise — retryWhen()' },
      },
      {
        id: 'rx-sol-retrywhen-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — retryWhen() Migration',
            body: '```typescript\nimport { retry, timer } from \'rxjs\';\n\n// Legacy:\n// source$.pipe(\n//   retryWhen(errors$ => errors$.pipe(delay(1000), take(5)))\n// );\n\n// Modern:\nsource$.pipe(\n  retry({\n    count: 5,\n    delay: () => timer(1000),\n  })\n);\n```',
          },
        ],
      },

      // ── throwIfEmpty() ──
      {
        id: 'rx-h-throwifempty',
        type: 'heading',
        content: 'throwIfEmpty() Operator',
        meta: { level: 2 },
      },
      {
        id: 'rx-throwifempty-text',
        type: 'text',
        content: '`throwIfEmpty()` emits an error if the source Observable completes **without emitting any values**. This is useful when you expect at least one result from a query or filter operation.',
      },
      {
        id: 'rx-throwifempty-code',
        type: 'code',
        language: 'typescript',
        label: 'throwIfEmpty()',
        content: `import { EMPTY, of, throwIfEmpty, filter } from 'rxjs';

// Throws because EMPTY emits nothing
EMPTY.pipe(
  throwIfEmpty(() => new Error('No values!'))
).subscribe({
  error: e => console.error(e.message), // "No values!"
});

// Works fine — source emits a value
of(42).pipe(
  throwIfEmpty(() => new Error('No values!'))
).subscribe(v => console.log(v)); // 42

// Common pattern: filter that might match nothing
of(1, 2, 3).pipe(
  filter(v => v > 10),
  throwIfEmpty(() => new Error('No items match filter'))
).subscribe({
  error: e => console.error(e.message),
  // "No items match filter"
});`,
      },

      // ═══════════════════════════════════════════════════
      // CUSTOM OPERATORS
      // ═══════════════════════════════════════════════════
      { id: 'rx-div-7', type: 'divider', content: '', meta: { style: 'line' } },
      {
        id: 'rx-h-custom-ops',
        type: 'heading',
        content: 'Custom Operators',
        meta: { level: 1 },
      },
      {
        id: 'rx-custom-ops-text',
        type: 'text',
        content: 'A custom operator is just a **function that takes an Observable and returns an Observable**. There are two approaches:\n\n1. **Pipe function** — a simple function `(source$) => source$.pipe(...)`\n2. **Higher-order function operator** — a factory function that returns a pipe function, allowing parameters',
      },

      // ── Higher Order Observables ──
      {
        id: 'rx-h-higher-order',
        type: 'heading',
        content: 'Higher Order Observables',
        meta: { level: 1 },
      },
      {
        id: 'rx-higher-order-text',
        type: 'text',
        content: 'A **higher-order Observable** is an Observable that emits **other Observables** as values. Flattening operators like `mergeMap`, `switchMap`, `concatMap`, and `exhaustMap` subscribe to the inner Observables and flatten the results.',
      },
      {
        id: 'rx-higher-order-diagram',
        type: 'diagram',
        content: 'graph TD\n    A[Outer Observable] -->|emits inner| B[Inner Observable 1]\n    A -->|emits inner| C[Inner Observable 2]\n    A -->|emits inner| D[Inner Observable 3]\n    B -->|flattenend| E[Flat Output]\n    C -->|flattened| E\n    D -->|flattened| E',
      },

      // ── Pipe Function ──
      {
        id: 'rx-h-pipe-fn',
        type: 'heading',
        content: 'Exercise — Pipe Function',
        meta: { level: 2 },
      },
      {
        id: 'rx-ex-pipe-fn',
        type: 'callout',
        content: 'Create a custom operator called `doubleOdds` that filters only odd numbers and doubles them. It should be usable as `source$.pipe(doubleOdds)`. Test it with `of(1, 2, 3, 4, 5)` — expected output: `2, 6, 10`.',
        meta: { variant: 'tip', title: '📝 Exercise — Pipe Function' },
      },
      {
        id: 'rx-sol-pipe-fn-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — Pipe Function',
            body: '```typescript\nimport { Observable, of, filter, map, pipe } from \'rxjs\';\nimport type { OperatorFunction } from \'rxjs\';\n\n// Approach 1: Direct function\nconst doubleOdds = (source$: Observable<number>) =>\n  source$.pipe(\n    filter(n => n % 2 !== 0),\n    map(n => n * 2)\n  );\n\n// Approach 2: Using pipe() utility\nconst doubleOdds2 = pipe(\n  filter((n: number) => n % 2 !== 0),\n  map((n: number) => n * 2)\n);\n\nof(1, 2, 3, 4, 5).pipe(doubleOdds).subscribe(console.log);\n// 2, 6, 10\n```',
          },
        ],
      },

      // ── Higher-order Function Operator ──
      {
        id: 'rx-h-hof-operator',
        type: 'heading',
        content: 'Higher-order Function Operator',
        meta: { level: 2 },
      },
      {
        id: 'rx-hof-text',
        type: 'text',
        content: 'A higher-order function operator is a **factory** that accepts configuration parameters and returns a pipe function. This is the standard pattern for all built-in RxJS operators like `map()`, `filter()`, `take()`, etc.',
      },
      {
        id: 'rx-hof-code',
        type: 'code',
        language: 'typescript',
        label: 'Custom Parameterized Operator',
        content: `import { Observable, of, timer, switchMap, takeUntil } from 'rxjs';

// Factory: returns an operator function
function multiplyBy(factor: number) {
  return (source$: Observable<number>): Observable<number> =>
    new Observable(subscriber => {
      return source$.subscribe({
        next: value => subscriber.next(value * factor),
        error: err => subscriber.error(err),
        complete: () => subscriber.complete(),
      });
    });
}

of(1, 2, 3).pipe(
  multiplyBy(10)
).subscribe(console.log);
// 10, 20, 30

// More advanced: polling operator
function poll<T>(intervalMs: number) {
  return (source$: Observable<T>): Observable<T> =>
    timer(0, intervalMs).pipe(
      switchMap(() => source$)
    );
}

fetchData$.pipe(
  poll(5000),                        // poll every 5s
  takeUntil(stopPolling$)
).subscribe(data => updateUI(data));`,
      },

      // Exercise — Higher-order Function Operator
      {
        id: 'rx-ex-hof',
        type: 'callout',
        content: 'Create a custom operator `takeWhileInclusive(predicate)` that works like `takeWhile` but also emits the **first value that fails the predicate** before completing. Test with `of(1, 2, 3, 4, 5)` and predicate `v => v < 4` — expected: `1, 2, 3, 4` (includes the 4).',
        meta: { variant: 'tip', title: '📝 Exercise — Higher-order Function Operator' },
      },
      {
        id: 'rx-sol-hof-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — Higher-order Function Operator',
            body: '```typescript\nimport { Observable, of } from \'rxjs\';\n\nfunction takeWhileInclusive<T>(\n  predicate: (value: T) => boolean\n) {\n  return (source$: Observable<T>): Observable<T> =>\n    new Observable<T>(subscriber => {\n      return source$.subscribe({\n        next: value => {\n          subscriber.next(value);\n          if (!predicate(value)) {\n            subscriber.complete();\n          }\n        },\n        error: err => subscriber.error(err),\n        complete: () => subscriber.complete(),\n      });\n    });\n}\n\nof(1, 2, 3, 4, 5).pipe(\n  takeWhileInclusive(v => v < 4)\n).subscribe(console.log);\n// 1, 2, 3, 4\n```',
          },
        ],
      },

      // ═══════════════════════════════════════════════════
      // TESTING
      // ═══════════════════════════════════════════════════
      { id: 'rx-div-8', type: 'divider', content: '', meta: { style: 'line' } },
      {
        id: 'rx-h-testing',
        type: 'heading',
        content: 'Testing with Marble Diagrams',
        meta: { level: 1 },
      },
      {
        id: 'rx-testing-text',
        type: 'text',
        content: 'RxJS provides the **TestScheduler** for deterministic, synchronous testing of asynchronous Observable streams. It uses **marble syntax** — a visual DSL that represents Observable timelines as strings.',
      },

      // ── TestScheduler ──
      {
        id: 'rx-h-test-scheduler',
        type: 'heading',
        content: 'TestScheduler',
        meta: { level: 2 },
      },
      {
        id: 'rx-test-scheduler-code',
        type: 'code',
        language: 'typescript',
        label: 'TestScheduler Setup',
        content: `import { TestScheduler } from 'rxjs/testing';

const scheduler = new TestScheduler((actual, expected) => {
  // Use your test framework's assertion
  expect(actual).toEqual(expected);  // Jest
  // assert.deepEqual(actual, expected);  // Mocha
});

// Run test inside scheduler.run()
scheduler.run(({ cold, hot, expectObservable, expectSubscriptions }) => {
  // All test assertions happen here
  // Time is virtualized — no real waiting
});`,
      },

      // ── Marble Syntax ──
      {
        id: 'rx-h-marble-syntax',
        type: 'heading',
        content: 'Marble Syntax',
        meta: { level: 2 },
      },
      {
        id: 'rx-marble-syntax-table',
        type: 'table',
        content: {
          headers: ['Symbol', 'Meaning', 'Example'],
          rows: [
            ['-', 'One frame of virtual time (1ms in run mode)', '---a---b---'],
            ['a-z', 'Emission (value mapped via values object)', 'a = values.a'],
            ['|', 'Complete notification', '---a---|'],
            ['#', 'Error notification', '---a---#'],
            ['()', 'Synchronous grouping (same frame)', '--(ab|)'],
            ['^', 'Subscription point (hot only)', '---^---a---'],
            ['!', 'Unsubscription point', '---^---!'],
            [' ', 'Ignored (for readability)', 'a - b - c'],
          ],
        },
        meta: { caption: 'Marble Diagram Syntax Reference' },
      },
      {
        id: 'rx-marble-visual',
        type: 'code',
        language: 'text',
        label: 'Reading Marble Diagrams',
        content: `Source:    --a--b--c--d--|
                   ↑     ↑     ↑     ↑  ↑
                  2ms   5ms   8ms  11ms complete

Filtered: --a-----c-----|    (filter: odd values)

Mapped:   --A--B--C--D--|    (map: uppercase)

Error:    --a--b--#          (error at frame 8)

Grouped:  --(abc|)           (a, b, c emitted synchronously, then complete)`,
      },

      // ── Getting Started with Marble Tests ──
      {
        id: 'rx-h-marble-start',
        type: 'heading',
        content: 'Getting Started with Marble Tests',
        meta: { level: 2 },
      },
      {
        id: 'rx-marble-start-code',
        type: 'code',
        language: 'typescript',
        label: 'First Marble Test',
        content: `import { TestScheduler } from 'rxjs/testing';
import { map } from 'rxjs';

describe('marble tests', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should double values', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source = cold(' --a--b--c--|', { a: 1, b: 2, c: 3 });
      const expected =     '--x--y--z--|';
      const values = { x: 2, y: 4, z: 6 };

      const result$ = source.pipe(map(v => v * 2));

      expectObservable(result$).toBe(expected, values);
    });
  });
});`,
      },

      // EXERCISE — First Test
      {
        id: 'rx-ex-first-test',
        type: 'callout',
        content: 'Write a marble test for a `filter(v => v > 2)` operator. Use source `--a-b-c-d-|` with values `{ a: 1, b: 2, c: 3, d: 4 }`. What should the expected marble string be?',
        meta: { variant: 'tip', title: '📝 Exercise — First Test' },
      },
      {
        id: 'rx-sol-first-test-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — First Test',
            body: '```typescript\nit(\'should filter values > 2\', () => {\n  scheduler.run(({ cold, expectObservable }) => {\n    const source = cold(\'--a-b-c-d-|\', { a: 1, b: 2, c: 3, d: 4 });\n    const expected =    \'------c-d-|\';\n    const values = { c: 3, d: 4 };\n\n    const result$ = source.pipe(filter(v => v > 2));\n    expectObservable(result$).toBe(expected, values);\n  });\n});\n```\n\nNote: `a` and `b` are filtered out, so their frames become `-` (empty). The timing is preserved — `c` still appears at the same position.',
          },
        ],
      },

      // EXERCISE — Subscription
      {
        id: 'rx-h-test-subs',
        type: 'heading',
        content: 'Testing Subscriptions',
        meta: { level: 2 },
      },
      {
        id: 'rx-test-subs-text',
        type: 'text',
        content: 'You can also assert **when** a source is subscribed to and unsubscribed from using `expectSubscriptions()`. This is critical for testing operators like `switchMap` that unsubscribe from inner sources.',
      },
      {
        id: 'rx-ex-subscription',
        type: 'callout',
        content: 'Write a test that creates a cold Observable and applies `take(2)`. Use `expectSubscriptions` to verify the source is unsubscribed after 2 emissions.',
        meta: { variant: 'tip', title: '📝 Exercise — Subscription' },
      },
      {
        id: 'rx-sol-subscription-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — Subscription',
            body: '```typescript\nit(\'should unsubscribe after take(2)\', () => {\n  scheduler.run(({ cold, expectObservable, expectSubscriptions }) => {\n    const source = cold(\'--a--b--c--d--|\');\n    const expected =    \'--a--b|\';\n    const subs =        \'^----!\';\n\n    const result$ = source.pipe(take(2));\n\n    expectObservable(result$).toBe(expected);\n    expectSubscriptions(source.subscriptions).toBe(subs);\n  });\n});\n```\n\nThe `^` marks the subscription point and `!` marks where `take(2)` unsubscribes.',
          },
        ],
      },

      // EXERCISE — Error
      {
        id: 'rx-ex-error-test',
        type: 'callout',
        content: 'Write a marble test for a stream that emits `a, b` then errors. Apply `catchError` to replace the error with a fallback value `z`. Assert the output is `--a--b--z|`.',
        meta: { variant: 'tip', title: '📝 Exercise — Error' },
      },
      {
        id: 'rx-sol-error-test-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — Error',
            body: '```typescript\nit(\'should catch error and emit fallback\', () => {\n  scheduler.run(({ cold, expectObservable }) => {\n    const source = cold(\'--a--b--#\', { a: \'a\', b: \'b\' }, new Error(\'fail\'));\n    const expected =    \'--a--b--(z|)\';\n    const values = { a: \'a\', b: \'b\', z: \'fallback\' };\n\n    const result$ = source.pipe(\n      catchError(() => of(\'fallback\'))\n    );\n\n    expectObservable(result$).toBe(expected, values);\n  });\n});\n```\n\nNote the `(z|)` — `catchError` returns `of(\'fallback\')` which emits and completes in the same frame.',
          },
        ],
      },

      // ── Flush ──
      {
        id: 'rx-h-flush',
        type: 'heading',
        content: 'Flush',
        meta: { level: 2 },
      },
      {
        id: 'rx-flush-text',
        type: 'text',
        content: 'The `flush()` method on `TestScheduler` processes all pending actions up to the current virtual time. Inside `scheduler.run()`, flushing happens automatically. Outside of `run()`, you must call `flush()` manually. The `run()` helper is the recommended approach.',
      },
      {
        id: 'rx-flush-code',
        type: 'code',
        language: 'typescript',
        label: 'Manual vs Automatic Flush',
        content: `// Automatic (recommended) — flush is called at the end of run()
scheduler.run(({ cold, expectObservable }) => {
  const source = cold('--a--|');
  expectObservable(source).toBe('--a--|');
  // flush happens automatically
});

// Manual (legacy approach — avoid)
const source = scheduler.createColdObservable('--a--|');
const result: string[] = [];
source.subscribe(v => result.push(v));
scheduler.flush();  // manually trigger
expect(result).toEqual(['a']);`,
      },

      // EXERCISE — Test Custom Operator
      {
        id: 'rx-ex-test-custom',
        type: 'callout',
        content: 'Remember the `takeWhileInclusive()` operator from earlier? Write a marble test for it:\n- Source: `--a--b--c--d--|` with values `{ a: 1, b: 2, c: 3, d: 4 }`\n- Predicate: `v => v < 3`\n- Expected output: the stream should emit `1, 2, 3` and then complete (3 is the first value failing the predicate, but it\'s still included)',
        meta: { variant: 'tip', title: '📝 Exercise — Test Custom Operator' },
      },
      {
        id: 'rx-sol-test-custom-toggle',
        type: 'toggle-list',
        content: [
          {
            title: '💡 Solution — Test Custom Operator',
            body: '```typescript\nimport { TestScheduler } from \'rxjs/testing\';\n// import { takeWhileInclusive } from \'./custom-operators\';\n\ndescribe(\'takeWhileInclusive\', () => {\n  let scheduler: TestScheduler;\n\n  beforeEach(() => {\n    scheduler = new TestScheduler((actual, expected) => {\n      expect(actual).toEqual(expected);\n    });\n  });\n\n  it(\'should include the first failing value then complete\', () => {\n    scheduler.run(({ cold, expectObservable, expectSubscriptions }) => {\n      const source = cold(  \'--a--b--c--d--|\', { a: 1, b: 2, c: 3, d: 4 });\n      const expected =      \'--a--b--(c|)\';\n      const subs =          \'^-------!\';\n      const values = { a: 1, b: 2, c: 3 };\n\n      const result$ = source.pipe(\n        takeWhileInclusive(v => v < 3)\n      );\n\n      expectObservable(result$).toBe(expected, values);\n      expectSubscriptions(source.subscriptions).toBe(subs);\n    });\n  });\n\n  it(\'should emit all values if predicate always true\', () => {\n    scheduler.run(({ cold, expectObservable }) => {\n      const source = cold(  \'--a--b--|\', { a: 1, b: 2 });\n      const expected =      \'--a--b--|\';\n\n      const result$ = source.pipe(\n        takeWhileInclusive(v => v < 10)\n      );\n\n      expectObservable(result$).toBe(expected, { a: 1, b: 2 });\n    });\n  });\n});\n```',
          },
        ],
      },

      // ═══════════════════════════════════════════════════
      // SUMMARY / CHEAT SHEET
      // ═══════════════════════════════════════════════════
      { id: 'rx-div-9', type: 'divider', content: '', meta: { style: 'line' } },
      {
        id: 'rx-h-summary',
        type: 'heading',
        content: 'Course Summary — Cheat Sheet',
        meta: { level: 1 },
      },
      {
        id: 'rx-summary-step',
        type: 'step-by-step',
        content: [
          { title: 'Unicast vs Multicast', description: 'Observables are unicast (one execution per subscriber). Subjects are multicast (shared execution). Use share() to convert unicast → multicast.' },
          { title: 'Multicasting Operators', description: 'connectable() for manual connect, connect() operator for inline sharing, share() for automatic refcounted sharing.' },
          { title: 'Subject Variants', description: 'Subject (no replay), AsyncSubject (last value on complete), BehaviorSubject (current value + initial), ReplaySubject (N buffered values).' },
          { title: 'Error Handling', description: 'catchError() to recover, throwError() to create/rethrow, retry() to resubscribe, finalize() for cleanup, throwIfEmpty() for empty guards.' },
          { title: 'Custom Operators', description: 'Simple pipe functions or parameterized factories that return (source$) => Observable. Compose with pipe() utility.' },
          { title: 'Marble Testing', description: 'TestScheduler + marble syntax for deterministic, synchronous testing. Use cold/hot helpers and expectObservable/expectSubscriptions assertions.' },
        ],
      },
      {
        id: 'rx-summary-checklist',
        type: 'checklist',
        content: [
          { text: 'I understand the difference between unicast and multicast', checked: false },
          { text: 'I can use share() to multicast an Observable', checked: false },
          { text: 'I know when to use BehaviorSubject vs ReplaySubject', checked: false },
          { text: 'I can handle errors with catchError and retry', checked: false },
          { text: 'I can write custom RxJS operators', checked: false },
          { text: 'I can write marble tests with TestScheduler', checked: false },
        ],
      },
      {
        id: 'rx-end-quote',
        type: 'quote',
        content: 'Think of Observables as a function call that can return multiple values over time. Subjects are like event emitters that can be observed. Everything else is composition.',
        meta: { author: 'Ben Lesh, RxJS Lead' },
      },
    ],
  },
};
