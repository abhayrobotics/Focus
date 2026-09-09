export interface SeedInterviewTopic {
  category: string;
  name: string;
  status: 'NOT_STARTED' | 'LEARNING' | 'PRACTICED' | 'INTERVIEW_READY';
  confidence: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  phase: 'PHASE_1' | 'PHASE_2';
  notes?: string;
  keyQuestions?: string;
  practicalTips?: string;
}

export const INTERVIEW_TOPICS_CATALOG: SeedInterviewTopic[] = [
  // ==========================================
  // 1. JavaScript (20 Topics)
  // ==========================================
  {
    category: 'JAVASCRIPT',
    name: '1. Variables, Data Types & Type Coercion',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Primitive vs reference types, typeof quirks (typeof null === "object"), implicit vs explicit coercion (== vs ===, +[], {} + []).',
    keyQuestions: '1. What does [] + {} vs {} + [] evaluate to and why?\n2. Difference between undefined, null, and undeclared?\n3. How does JavaScript handle floating-point arithmetic (0.1 + 0.2 !== 0.3)?',
    practicalTips: 'Always use === for strict equality. Use Number(), String(), and Boolean() for explicit casting.'
  },
  {
    category: 'JAVASCRIPT',
    name: '2. Scope, Hoisting & TDZ',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Global, function, and block scope. Var hoisting (initialized to undefined) vs let/const hoisting (Temporal Dead Zone until declaration).',
    keyQuestions: '1. What is the Temporal Dead Zone (TDZ) and why was it introduced in ES6?\n2. What will be the output of accessing a let variable before declaration?\n3. How does function declaration hoisting differ from function expression hoisting?',
    practicalTips: 'Declare all variables at the top of their block and always prefer const > let, avoid var.'
  },
  {
    category: 'JAVASCRIPT',
    name: '3. Functions & Higher-Order Functions',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'First-class citizens, pure functions, higher-order functions (functions taking/returning functions), currying, and function composition.',
    keyQuestions: '1. What makes a function a Higher-Order Function?\n2. Implement a generic curry() function in JavaScript.\n3. What is function composition and how does pipe() differ from compose()?',
    practicalTips: 'Master passing callbacks and returning functions for reusable utility logic.'
  },
  {
    category: 'JAVASCRIPT',
    name: '4. Closures',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'A closure is the combination of a function bundled together with references to its surrounding state (lexical environment). Enables private variables and memoization.',
    keyQuestions: '1. Explain closures with a real-world example (e.g. createCounter() or memoization).\n2. How can closures cause memory leaks in JavaScript if not cleaned up?\n3. Solve the classic for (var i = 0; i < 3; i++) { setTimeout(...) } bug using closures.',
    practicalTips: 'Closures retain variables by reference, not value!'
  },
  {
    category: 'JAVASCRIPT',
    name: '5. this, call, apply & bind',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Dynamic binding of this depending on call-site: default binding, implicit binding, explicit binding (call/apply/bind), and arrow functions (lexical this).',
    keyQuestions: '1. How does arrow function `this` differ from regular function `this`?\n2. Implement a polyfill for Function.prototype.bind.\n3. Difference between .call() and .apply() with examples?',
    practicalTips: 'Arrow functions do NOT have their own this, arguments, or super.'
  },
  {
    category: 'JAVASCRIPT',
    name: '6. Arrays & Array Methods',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Mutating (push, pop, shift, unshift, splice, sort, reverse) vs Non-mutating (map, filter, reduce, slice, concat, flatMap).',
    keyQuestions: '1. Implement a custom polyfill for Array.prototype.reduce.\n2. Difference between Array.prototype.slice() and Array.prototype.splice()?\n3. Why does [10, 2, 5].sort() give [10, 2, 5] instead of [2, 5, 10]?',
    practicalTips: 'Always pass a comparator to Array.prototype.sort((a,b)=>a-b) for numeric sorting.'
  },
  {
    category: 'JAVASCRIPT',
    name: '7. Objects & Object Methods',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Object.entries, Object.keys, Object.values, Object.freeze (shallow immutable) vs Object.seal, deep cloning (structuredClone vs JSON vs spread).',
    keyQuestions: '1. Difference between Object.freeze() and Object.seal()?\n2. How to implement a recursive deep clone function in JavaScript?\n3. How does Object.is() differ from === (NaN and -0 cases)?',
    practicalTips: 'Use native structuredClone(obj) for deep copying without JSON circular reference traps.'
  },
  {
    category: 'JAVASCRIPT',
    name: '8. Destructuring, Spread & Rest',
    priority: 'LOW',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Array/Object destructuring, default values, renaming variables, rest parameter syntax in function signatures, and shallow copying with spread.',
    keyQuestions: '1. How does rest parameter syntax differ from the arguments object?\n2. Can spread operator perform deep copying?\n3. How do you swap two variables without a temporary variable using destructuring?',
    practicalTips: '[a, b] = [b, a] cleanly swaps variables without a temporary variable.'
  },
  {
    category: 'JAVASCRIPT',
    name: '9. Prototypes & Prototype Chain',
    priority: 'MEDIUM',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Every JavaScript object has a private property [[Prototype]] linked to another object. Object.prototype is the top of the chain (null).',
    keyQuestions: '1. What is the difference between `__proto__` and `prototype`?\n2. How does property lookup traversal work on the prototype chain?\n3. How does Object.create(proto) work under the hood?',
    practicalTips: 'ES6 class syntax is syntactic sugar over prototypal inheritance.'
  },
  {
    category: 'JAVASCRIPT',
    name: '10. Classes & OOP in JS',
    priority: 'MEDIUM',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Class syntax, constructor, super keyword, private fields (#field), static methods/properties, getters and setters, and inheritance.',
    keyQuestions: '1. How are private class fields (#) implemented compared to closure-based privacy?\n2. What is the purpose of the super() call in derived class constructors?\n3. What are static methods and why can they not access this.instanceProperty?',
    practicalTips: 'Use #privateField for native class privacy in modern JS.'
  },
  {
    category: 'JAVASCRIPT',
    name: '11. ES Modules & CommonJS',
    priority: 'LOW',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'ESM (import/export, static analysis, async loading, live bindings) vs CJS (require/module.exports, synchronous, runtime evaluation, copy of values).',
    keyQuestions: '1. Why are ES Modules statically analyzable while CommonJS is dynamic?\n2. What happens when circular dependencies occur in ESM vs CommonJS?\n3. How does Node.js handle ESM with "type": "module" in package.json?',
    practicalTips: 'Prefer ESM (import/export) for tree-shaking and modern bundles.'
  },
  {
    category: 'JAVASCRIPT',
    name: '12. Error Handling',
    priority: 'LOW',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'try...catch...finally, throw statement, custom Error subclasses, Error.cause chaining, unhandled promise rejections, and window.onerror/process.on.',
    keyQuestions: '1. What executes in a try...catch...finally block if the try block contains a return statement?\n2. How to create custom application error classes inheriting from Error?\n3. How do you catch asynchronous errors inside setTimeout without unhandled rejections?',
    practicalTips: 'The finally block ALWAYS executes, even after return or throw inside try/catch.'
  },
  {
    category: 'JAVASCRIPT',
    name: '13. Callbacks & Asynchronous JS',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Callback pattern, inversion of control, Callback Hell (Pyramid of Doom), error-first callbacks in Node.js (err, data).',
    keyQuestions: '1. What is "Inversion of Control" in callback-based programming?\n2. Why was the Promise pattern introduced to replace callbacks?\n3. How do you convert a callback-based API to a Promise (promisify)?',
    practicalTips: 'Use util.promisify or wrap callbacks in new Promise((resolve, reject) => ...).'
  },
  {
    category: 'JAVASCRIPT',
    name: '14. Promises & async/await',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Promise states (pending, fulfilled, rejected), chaining (.then/.catch/.finally), Promise.all, Promise.allSettled, Promise.race, Promise.any, async/await syntax.',
    keyQuestions: '1. Implement Promise.all() polyfill from scratch.\n2. Difference between Promise.all() (fails fast) and Promise.allSettled() (waits for all)?\n3. How does async/await transform into generator functions + promise runner?',
    practicalTips: 'Use Promise.allSettled when individual failures shouldn’t abort the batch.'
  },
  {
    category: 'JAVASCRIPT',
    name: '15. Event Loop & Execution Model',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Call Stack, Memory Heap, Web APIs / C++ APIs, Callback Queue (Macrotasks), Microtask Queue, and Render Queue. Single-threaded non-blocking execution.',
    keyQuestions: '1. Trace the exact console output order of sync code, setTimeout, Promise.then, and process.nextTick.\n2. What causes the browser UI to freeze/lock up?\n3. How does the event loop prioritize the microtask queue over macrotasks?',
    practicalTips: 'Microtasks (Promises) ALWAYS drain completely before the next macrotask (setTimeout) runs.'
  },
  {
    category: 'JAVASCRIPT',
    name: '16. Microtasks vs Macrotasks',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Microtasks: Promise callbacks, MutationObserver, queueMicrotask, process.nextTick. Macrotasks: setTimeout, setInterval, setImmediate, I/O, UI rendering.',
    keyQuestions: '1. What happens if a microtask continuously schedules another microtask recursively?\n2. Why does queueMicrotask() execute before setTimeout(..., 0)?\n3. How does requestAnimationFrame relate to the rendering step in the event loop?',
    practicalTips: 'Recursive microtasks will starve macrotasks and freeze the UI rendering cycle.'
  },
  {
    category: 'JAVASCRIPT',
    name: '17. Debouncing & Throttling',
    priority: 'MEDIUM',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Debounce: Delays execution until N ms have passed since the last call (search inputs, resize). Throttle: Ensures execution at most once every N ms (scroll, gaming, mousemove).',
    keyQuestions: '1. Write a complete debounce function with immediate/leading option.\n2. Write a complete throttle function using timestamp or timer.\n3. Real-world scenario: Search autocomplete vs Window scroll pagination — which one to use?',
    practicalTips: 'Debounce = "wait until user stops typing". Throttle = "fire at most once every 100ms".'
  },
  {
    category: 'JAVASCRIPT',
    name: '18. Map, Set, WeakMap & WeakSet',
    priority: 'MEDIUM',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Map (any key type, preserves insertion order) vs Object. Set (unique values). WeakMap & WeakSet hold weak references to objects allowing garbage collection (metadata caching).',
    keyQuestions: '1. Why can WeakMap keys only be objects and not primitives?\n2. How do WeakMaps prevent memory leaks when associating metadata with DOM elements?\n3. Compare Map vs Object performance and key type flexibility.',
    practicalTips: 'Use Set for O(1) membership checks and deduplication.'
  },
  {
    category: 'JAVASCRIPT',
    name: '19. Iterators, Generators & Symbols',
    priority: 'MEDIUM',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Iterable protocol (Symbol.iterator), next() { value, done }, generator functions function* and yield keyword, Symbol unique identifiers, well-known symbols.',
    keyQuestions: '1. How does for...of loop interact with Symbol.iterator under the hood?\n2. How to implement an infinite ID generator with function*?\n3. How do generators enable two-way communication via generator.next(value)?',
    practicalTips: 'Objects are not iterable by default unless you define [Symbol.iterator]().'
  },
  {
    category: 'JAVASCRIPT',
    name: '20. JS Interview Problems & Output Questions',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Tricky output questions on hoisting, closures, async execution, this binding, prototype lookup, coercion, and machine coding polyfills.',
    keyQuestions: '1. Predict output of complex nested setTimeout and Promise chains.\n2. Implement a custom Event Emitter / PubSub in vanilla JS.\n3. Implement a deep object flatten and unflatten algorithm.',
    practicalTips: 'Practice drawing the Call Stack, Microtask Queue, and Callback Queue on paper.'
  },

  // ==========================================
  // 2. TypeScript (15 Topics)
  // ==========================================
  {
    category: 'TYPESCRIPT',
    name: '1. TypeScript Fundamentals',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Static typing vs dynamic typing, TypeScript compiler (tsc), tsconfig.json options (strict, target, module, moduleResolution), type erasure at runtime.',
    keyQuestions: '1. What does TypeScript "type erasure" mean and how does it impact runtime performance?\n2. Key tsconfig compiler options for production projects (noImplicitAny, strictNullChecks)?',
    practicalTips: 'TypeScript types do not exist at runtime — they only protect at compile time.'
  },
  {
    category: 'TYPESCRIPT',
    name: '2. Type Inference',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Best common type algorithm, contextual typing, type widening, const assertions (as const) preventing widening to string/number.',
    keyQuestions: '1. When should you explicitly annotate types vs letting TypeScript infer them?\n2. What is the effect of `as const` on an object literal?\n3. Explain contextual typing in callback parameters.',
    practicalTips: 'Avoid redundant type annotations when inference is clear: let x = 5 already infers number.'
  },
  {
    category: 'TYPESCRIPT',
    name: '3. Interfaces vs Types',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Declaration merging in interfaces, extending interfaces (extends) vs type intersections (&), union types only possible in types, primitives and tuples.',
    keyQuestions: '1. What are the key differences between interface and type alias?\n2. What is interface declaration merging and when is it useful (e.g. library augmentation)?\n3. Can an interface extend a union type?',
    practicalTips: 'Use interfaces for public API shape definitions and object contracts; use types for unions/primitives/utility types.'
  },
  {
    category: 'TYPESCRIPT',
    name: '4. Union & Intersection Types',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Union (|) represents a value that can be one of several types; Intersection (&) combines multiple types into one.',
    keyQuestions: '1. If type A has { a: string } and type B has { b: number }, what properties are accessible on A | B vs A & B?\n2. What is type never and when does an intersection produce never?',
    practicalTips: 'On a union (A | B), you can only directly access common properties before narrowing.'
  },
  {
    category: 'TYPESCRIPT',
    name: '5. Literal Types',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'String, numeric, boolean literal types, combining with unions for discrete status sets, and template literal types (`status_${Status}`).',
    keyQuestions: '1. How do string literal unions provide safer alternatives to enums?\n2. Build a template literal type for CSS units (e.g. `${number}px` | `${number}rem`).',
    practicalTips: 'Literal unions (type Status = "IDLE" | "LOADING" | "SUCCESS") are lighter and cleaner than numeric enums.'
  },
  {
    category: 'TYPESCRIPT',
    name: '6. Functions & Function Types',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Function type signatures, optional parameters (?), default parameters, rest parameters, function overloads, and typing `this` in functions.',
    keyQuestions: '1. How do function overloads work in TypeScript and why is only the implementation signature visible?\n2. How to type a function that accepts variable arguments and returns a strongly typed result?',
    practicalTips: 'Overload signatures must precede the implementation signature.'
  },
  {
    category: 'TYPESCRIPT',
    name: '7. Generics',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Type parameters <T>, generic functions, generic interfaces, generic classes, and reusable typed data structures (e.g. ApiResponse<T>, PaginatedResult<T>).',
    keyQuestions: '1. Why are Generics preferred over `any` for reusable components and functions?\n2. Write a generic ApiResponse<T> interface supporting data, error, and status.\n3. How does generic type inference work when invoking a generic function?',
    practicalTips: 'Think of Generics as variables for types: arguments passed to a type factory.'
  },
  {
    category: 'TYPESCRIPT',
    name: '8. Generic Constraints',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'The `extends` keyword in generics: <T extends { id: string }>, constraining to objects, arrays, or primitive subsets.',
    keyQuestions: '1. How do you constrain a generic type parameter to have specific properties (e.g. length or id)?\n2. Explain `<T, K extends keyof T>` pattern in helper functions like getProperty(obj, key).',
    practicalTips: 'Use `T extends Record<string, any>` to ensure T is an object.'
  },
  {
    category: 'TYPESCRIPT',
    name: '9. keyof, typeof & Indexed Access',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: '`keyof T` produces union of property keys; `typeof val` captures the type of a value; `T[K]` accesses property type (indexed access).',
    keyQuestions: '1. How do you extract all value types of an object using `T[keyof T]`?\n2. How to create a strongly typed lookup function `getValue<T, K extends keyof T>(obj: T, key: K): T[K]`?',
    practicalTips: 'Combine `as const` and `typeof` to derive types directly from configuration objects.'
  },
  {
    category: 'TYPESCRIPT',
    name: '10. Type Narrowing & Type Guards',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Control flow analysis: typeof guards, instanceof guards, in operator, truthiness checks, equality checks, and custom user-defined type guards (`val is Type`).',
    keyQuestions: '1. How do you write a custom type predicate function `isAxiosError(err: unknown): err is AxiosError`?\n2. What is the difference between `is` type predicate and boolean return?\n3. How does TypeScript narrow types through switch/case statements?',
    practicalTips: 'Custom type guards (`arg is SpecificType`) tell TypeScript the type has been validated.'
  },
  {
    category: 'TYPESCRIPT',
    name: '11. Utility Types',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Partial<T>, Required<T>, Readonly<T>, Pick<T, K>, Omit<T, K>, Record<K, T>, Exclude<T, U>, Extract<T, U>, NonNullable<T>, ReturnType<T>, Parameters<T>.',
    keyQuestions: '1. How does `Omit<T, K>` differ from `Exclude<T, U>` (object keys vs union types)?\n2. Implement a custom polyfill type for `MyPick<T, K extends keyof T>`.\n3. How does `ReturnType<T>` extract the return type of a function using `infer`?',
    practicalTips: 'Pick and Omit work on Object types; Extract and Exclude work on Union types!'
  },
  {
    category: 'TYPESCRIPT',
    name: '12. Enums, Tuples & Special Types',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Numeric/String enums vs const enums, fixed-length typed arrays (Tuples [string, number]), `any` vs `unknown` (type-safe any), `never` (impossible state), and `void`.',
    keyQuestions: '1. Why is `unknown` preferred over `any` in error handling and API boundaries?\n2. What is `never` type and how is it used for exhaustive type checking?\n3. What are the runtime trade-offs of TypeScript enums vs string unions?',
    practicalTips: 'Always type caught errors as `err: unknown` and use type guards before accessing properties.'
  },
  {
    category: 'TYPESCRIPT',
    name: '13. Discriminated Unions',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Tagged unions with a common literal discriminator field (e.g. `kind: "SUCCESS" | "ERROR"`), exhaustive checking in switch statements with never.',
    keyQuestions: '1. How do discriminated unions prevent invalid state combinations in UI state management?\n2. Implement an exhaustive switch statement that causes a compile error if a new state is added without handling.',
    practicalTips: 'Use `const _exhaustiveCheck: never = state;` in default case for compile-time safety.'
  },
  {
    category: 'TYPESCRIPT',
    name: '14. TypeScript with React',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Typing component Props (children: React.ReactNode), React.FC vs plain functions, typing useState, useRef (DOM vs mutable value), event handlers (React.MouseEvent, ChangeEvent).',
    keyQuestions: '1. Difference between React.ReactNode, React.ReactElement, and JSX.Element?\n2. How to type a polymorphic component (e.g. Button as "a" | "button") in React with TS?\n3. How to correctly type a forwardRef component with generic props?',
    practicalTips: 'Use `React.ReactNode` for anything that can be rendered inside JSX.'
  },
  {
    category: 'TYPESCRIPT',
    name: '15. TypeScript with Node/Express',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Typing Express Request, Response, NextFunction, custom Request interface extension (req.user), environment variables typing, and Prisma generated types.',
    keyQuestions: '1. How do you extend Express.Request interface to include an authenticated user object?\n2. How to strongly type route params, query, and request body with Express Request<Params, ResBody, ReqBody, ReqQuery>?',
    practicalTips: 'Create `types/express.d.ts` declaration file to merge custom properties into Express.Request.'
  },

  // ==========================================
  // 3. React (20 Topics)
  // ==========================================
  {
    category: 'REACT',
    name: '1. React Fundamentals & JSX',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Declarative UI, JSX transpilation to React.createElement / jsx runtime, single root requirement (Fragments), and unidirectional data flow.',
    keyQuestions: '1. What does JSX compile into under the hood in modern React (React 17+ JSX transform)?\n2. Why can JSX only return a single root element (Fragment explanation)?\n3. What is unidirectional data flow and why does React enforce it?',
    practicalTips: 'Use `<>` Fragment shorthand to avoid adding unnecessary wrapper DOM nodes.'
  },
  {
    category: 'REACT',
    name: '2. Components & Props',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Function components, props immutability, default props, prop drilling, children prop, and component composition over inheritance.',
    keyQuestions: '1. Why are props immutable in React?\n2. How does component composition solve the prop drilling problem without global state?\n3. Explain the "Container / Presentational" pattern and when it is useful.',
    practicalTips: 'Pass JSX elements as props (composition) instead of drilling raw data down multiple layers.'
  },
  {
    category: 'REACT',
    name: '3. State & State Updates',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'useState, setState asynchronous nature, functional state updates `setCount(c => c + 1)`, automatic batching in React 18 (promises, setTimeout, events).',
    keyQuestions: '1. What happens when you call setState 3 times synchronously without functional updates?\n2. How does automatic batching work in React 18 compared to React 17?\n3. Why should state never be directly mutated (e.g. state.push vs [...state])?',
    practicalTips: 'Always use functional updater `setCount(prev => prev + 1)` when new state depends on previous state.'
  },
  {
    category: 'REACT',
    name: '4. Event Handling & Forms',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'SyntheticEvent system, event pooling (deprecated in 17), event bubbling in React portals, Controlled vs Uncontrolled form components, and FormData API.',
    keyQuestions: '1. What are SyntheticEvents in React and why does React use them instead of native DOM events?\n2. When should you choose Uncontrolled components (useRef / FormData) over Controlled components?\n3. How does event delegation work in React 18 (attached to root container vs document)?',
    practicalTips: 'For heavy forms, consider Uncontrolled inputs or React Hook Form to avoid full form re-renders on every keystroke.'
  },
  {
    category: 'REACT',
    name: '5. Lists, Keys & Conditional Rendering',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Reconciliation key prop, why index as key causes UI state corruption on reorders/deletions, short-circuit evaluation (`&&` gotcha with 0).',
    keyQuestions: '1. Why is using array index as `key` dangerous when list items can be reordered or filtered?\n2. What will `{count && <Component />}` render if count is 0?\n3. How does React use `key` to decide whether to reuse or recreate a component instance?',
    practicalTips: 'Never write `{items.length && <List />}` because `0` renders as text on screen; write `{items.length > 0 && ...}`.'
  },
  {
    category: 'REACT',
    name: '6. React Hooks Overview & Rules',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Rules of Hooks (only call at top level, only call from React functions), how React tracks hook state internally using a linked list on Fiber node.',
    keyQuestions: '1. Why can hooks NOT be placed inside conditionals (`if`), loops, or nested functions?\n2. How does React associate state with the correct component instance behind the scenes?\n3. What are the advantages of Hooks over Class lifecycle methods?',
    practicalTips: 'Hooks rely on fixed call order per render to match the Fiber linked list of hook records.'
  },
  {
    category: 'REACT',
    name: '7. useEffect Deep Dive',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Side effects, dependency array semantics (omitted vs empty [] vs populated), cleanup function execution timing, stale closures in useEffect.',
    keyQuestions: '1. When exactly does the cleanup function of useEffect run (unmount vs before next effect)?\n2. What is a "stale closure" in useEffect and how do you resolve it?\n3. How to properly cancel network requests / avoid race conditions with AbortController inside useEffect?',
    practicalTips: 'Always use AbortController in useEffect fetch calls to prevent race conditions and unmounted state update errors.'
  },
  {
    category: 'REACT',
    name: '8. useRef & DOM Interaction',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Mutable ref object (`{ current: initialValue }`), persistent value across renders without triggering re-render, accessing native DOM nodes, forwardRef, and useImperativeHandle.',
    keyQuestions: '1. What are the two primary use cases for useRef in React?\n2. When should you use forwardRef and useImperativeHandle?\n3. What is the difference between storing a value in useRef vs useState vs module-level variable?',
    practicalTips: 'Updating `ref.current` is synchronous and never triggers a re-render.'
  },
  {
    category: 'REACT',
    name: '9. Context API',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'createContext, Provider, useContext, Context re-rendering caveats (all consumers re-render when context value object changes), splitting contexts.',
    keyQuestions: '1. Why can Context API cause performance bottlenecks in large applications?\n2. How do you optimize Context by splitting State and Dispatch into separate contexts?\n3. Context API vs Redux / Zustand: when is Context appropriate?',
    practicalTips: 'Split State and Dispatch into two contexts (`UserContext` and `UserDispatchContext`) to prevent dispatchers from re-rendering.'
  },
  {
    category: 'REACT',
    name: '10. Custom Hooks',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Extracting and sharing stateful logic between components, composing built-in hooks, naming convention (`use...`), building hooks like useDebounce, useLocalStorage, useFetch.',
    keyQuestions: '1. Do two components using the same custom hook share state or isolated state?\n2. Implement a complete `useDebounce(value, delay)` custom hook.\n3. Implement a `useEventListener(eventName, handler, element)` custom hook with automatic cleanup.',
    practicalTips: 'Custom hooks share stateful *logic*, NOT state itself.'
  },
  {
    category: 'REACT',
    name: '11. Component Lifecycle & Rendering',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Mounting, updating, unmounting phases, Render Phase (pure, no side effects) vs Commit Phase (DOM mutations, side effects run), React 18 double rendering in StrictMode.',
    keyQuestions: '1. Why does React 18 execute effects twice in StrictMode development?\n2. What is the difference between useLayoutEffect and useEffect in the commit timeline?\n3. What causes a component to re-render in React?',
    practicalTips: 'Components re-render when: state changes, props change, parent re-renders, or consumed context changes.'
  },
  {
    category: 'REACT',
    name: '12. Reconciliation & Virtual DOM',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Virtual DOM diffing algorithm (O(N) heuristic: different element types produce different trees, keys differentiate list items), React Fiber architecture (cooperative scheduling, interruptible rendering).',
    keyQuestions: '1. How does React diffing algorithm achieve O(N) complexity instead of O(N^3)?\n2. What was the limitation of the old Stack Reconciler and why did React rewrite it as Fiber?\n3. What is a Fiber node and how does it act as a virtual stack frame?',
    practicalTips: 'Fiber allows React to pause, resume, and prioritize UI render work (e.g. user input over offscreen list rendering).'
  },
  {
    category: 'REACT',
    name: '13. React State Architecture',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'State Colocation (keep state as close as possible to where it is used), lifting state up, server cache vs client UI state, URL state management (search params).',
    keyQuestions: '1. What is "State Colocation" and why does it prevent 90% of unnecessary re-renders?\n2. How should you structure state: Normalized vs Nested data?\n3. When should application state live in URL search params instead of React state?',
    practicalTips: 'Colocate state before reaching for memoization: moving state down one level eliminates parent re-renders.'
  },
  {
    category: 'REACT',
    name: '14. Redux Toolkit',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'createSlice, configureStore, createAsyncThunk, Immer under the hood for immutable state mutations, useSelector (shallow equality / selector memoization), useDispatch.',
    keyQuestions: '1. How does Redux Toolkit eliminate traditional Redux boilerplate?\n2. How does Immer allow you to write "mutating" logic inside slice reducers safely?\n3. How does createAsyncThunk generate pending, fulfilled, and rejected action creators?',
    practicalTips: 'Use `createSlice` to encapsulate actions and reducer in one place.'
  },
  {
    category: 'REACT',
    name: '15. RTK Query / Server State',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Server state vs UI state, automatic caching, deduplication, polling, optimistic updates, cache invalidation with tags (providesTags / invalidatesTags).',
    keyQuestions: '1. Why is global client state (Redux) separate from Server Cache (RTK Query / TanStack Query)?\n2. How does tag-based cache invalidation work in RTK Query?\n3. How do you implement Optimistic UI updates with RTK Query / TanStack Query?',
    practicalTips: 'Never store API response data in global client slices when a dedicated server cache hook handles caching, refetching, and deduping.'
  },
  {
    category: 'REACT',
    name: '16. React Router',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Client-side routing, history API, createBrowserRouter, Route loaders and actions, Nested routes and <Outlet />, dynamic route params (useParams, useSearchParams, useNavigate).',
    keyQuestions: '1. How does client-side routing prevent full-page browser reloads?\n2. What is the purpose of `<Outlet />` in nested routing architectures?\n3. How do data loaders in React Router 6.4+ eliminate useEffect fetching waterfalls?',
    practicalTips: 'Use `<Outlet />` for consistent shared layout shells across nested views.'
  },
  {
    category: 'REACT',
    name: '17. React Performance Optimization',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'React.memo (higher-order component for props comparison), useMemo (memoizing expensive calculations), useCallback (memoizing function references), React DevTools Profiler.',
    keyQuestions: '1. When does using useMemo/useCallback actually HURT performance instead of helping?\n2. Why does React.memo fail if you pass an inline arrow function without useCallback?\n3. How do you identify expensive components and re-render causes using the React Profiler?',
    practicalTips: 'Only use useCallback when the function is passed to a memoized child component (React.memo) or in an effect dependency array.'
  },
  {
    category: 'REACT',
    name: '18. Code Splitting, Lazy Loading & Suspense',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Dynamic imports `import()`, React.lazy, `<Suspense fallback={<Spinner />}>`, route-based code splitting, and reducing initial bundle size.',
    keyQuestions: '1. How does `React.lazy()` enable route-based code splitting with Webpack/Vite?\n2. What happens if a lazy-loaded chunk fails to download (network error)?\n3. How does React Suspense coordinate loading states across nested components?',
    practicalTips: 'Wrap dynamic lazy routes in both `<Suspense>` and an `<ErrorBoundary>` to handle network load failures gracefully.'
  },
  {
    category: 'REACT',
    name: '19. Error Boundaries & Production Patterns',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Class components static getDerivedStateFromError and componentDidCatch, catching render errors, logging errors to Sentry, fallback UI, and react-error-boundary.',
    keyQuestions: '1. What types of errors can Error Boundaries NOT catch in React (async code, event handlers, SSR)?\n2. How do you catch errors inside event handlers and asynchronous calls?\n3. How to design a granular error boundary strategy for production applications?',
    practicalTips: 'Place granular error boundaries around independent widgets (e.g. Sidebar, Chart) so a crash doesn’t break the entire page.'
  },
  {
    category: 'REACT',
    name: '20. React Interview + Machine Coding',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Building machine coding components: Accessible Modal, Accordion, Autocomplete / Typeahead with Debounce, Star Rating, Infinite Scroll, Virtualized List.',
    keyQuestions: '1. Live code an Autocomplete search box with debounced API, keyboard navigation (Arrow Up/Down/Enter), and loading/error states.\n2. Live code an Accessible Modal with focus trap and Escape key listener.\n3. Build a custom Infinite Scroll component using IntersectionObserver.',
    practicalTips: 'Always handle loading, error, empty, and keyboard accessibility states in machine coding rounds.'
  },

  // ==========================================
  // 4. Node.js (15 Topics)
  // ==========================================
  {
    category: 'NODEJS',
    name: '1. Node.js Runtime & Architecture',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'V8 JavaScript engine (JIT compilation, call stack, heap) + Libuv C library (event loop, asynchronous I/O, thread pool). Single-threaded event-driven non-blocking runtime.',
    keyQuestions: '1. How does Node.js execute JavaScript single-threadedly while handling concurrent I/O operations?\n2. What is the role of Libuv in the Node.js architecture?\n3. What happens under the hood when a Node.js process starts up?',
    practicalTips: 'Node.js is single-threaded for JS execution, but uses a multi-threaded C++ thread pool for I/O operations.'
  },
  {
    category: 'NODEJS',
    name: '2. Node Modules & npm',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'package.json, package-lock.json (deterministic dependency tree), semantic versioning (^ vs ~ vs exact), dependencies vs devDependencies, npm scripts, npx.',
    keyQuestions: '1. What is the purpose of package-lock.json and why must it be committed to Git?\n2. What is the difference between `^1.2.3` (caret) and `~1.2.3` (tilde) in semver?\n3. What does `npm ci` do and why is it preferred over `npm install` in CI/CD pipelines?',
    practicalTips: 'Use `npm ci` in automated build pipelines for fast, clean, deterministic installs matching package-lock.json.'
  },
  {
    category: 'NODEJS',
    name: '3. CommonJS vs ES Modules',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'require() synchronous module resolution vs import statement asynchronous loading. Node.js `.cjs` and `.mjs` extensions, top-level await in ESM.',
    keyQuestions: '1. Can you use `require()` inside an ES Module file or `import` inside CommonJS?\n2. How does Top-Level Await work in ES Modules in modern Node.js?\n3. Why is `__dirname` not available in ESM and what is the standard replacement (`import.meta.url`)?',
    practicalTips: 'In ESM, replace `__dirname` with `path.dirname(fileURLToPath(import.meta.url))`.'
  },
  {
    category: 'NODEJS',
    name: '4. Event Loop',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Libuv 6 Event Loop Phases: 1. Timers (setTimeout, setInterval), 2. Pending Callbacks (I/O), 3. Idle/Prepare, 4. Poll (retrieve new I/O events), 5. Check (setImmediate), 6. Close callbacks. process.nextTick and Promise microtasks run between phases.',
    keyQuestions: '1. What is the exact execution difference between `process.nextTick()`, `setImmediate()`, and `setTimeout(fn, 0)`?\n2. Which phase of the event loop executes `setImmediate()` callbacks?\n3. What causes Event Loop Starvation and how can it be diagnosed?',
    practicalTips: '`process.nextTick()` has higher priority than Promise microtasks and executes immediately after the current operation.'
  },
  {
    category: 'NODEJS',
    name: '5. Non-Blocking I/O',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Synchronous blocking methods (fs.readFileSync) block the main thread vs Asynchronous non-blocking methods (fs.promises.readFile) delegate to Libuv thread pool.',
    keyQuestions: '1. Why should synchronous file methods (fs.*Sync) never be used inside HTTP request handlers?\n2. What operations utilize the Libuv Thread Pool (fs, crypto, zlib, dns.lookup)?\n3. How to increase the default thread pool size using `UV_THREADPOOL_SIZE`?',
    practicalTips: 'Never block the main thread: a synchronous CPU loop blocks all incoming network requests for all users.'
  },
  {
    category: 'NODEJS',
    name: '6. Callbacks, Promises & async/await',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Async control flow in Node.js, converting callback APIs using util.promisify, fs/promises module, handling async errors with try/catch.',
    keyQuestions: '1. How does Node.js handle unhandled promise rejections (`unhandledRejection` event)?\n2. Write a function that executes an array of asynchronous tasks sequentially using async/await.\n3. Write a function that limits concurrent async execution to maximum N tasks at a time.',
    practicalTips: 'Always attach an error handler or use try/catch around awaited promises in route handlers.'
  },
  {
    category: 'NODEJS',
    name: '7. EventEmitter',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Node.js events module, EventEmitter class, on, emit, once, removeListener, error event handling, memory leak warnings (setMaxListeners).',
    keyQuestions: '1. What happens if an EventEmitter emits an `error` event with no registered listeners?\n2. How do you implement a custom class that inherits from EventEmitter?\n3. Why does Node.js print a MaxListenersExceededWarning and how do you clean up listeners?',
    practicalTips: 'Always listen to the `error` event on EventEmitters (and Streams) to prevent process crashes.'
  },
  {
    category: 'NODEJS',
    name: '8. File System & Buffers',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Buffer class for raw binary data allocation (Buffer.from, Buffer.alloc), encodings (utf-8, hex, base64), fs.promises methods, file streams.',
    keyQuestions: '1. What is a Buffer in Node.js and where is buffer memory allocated (V8 heap vs raw C++ memory)?\n2. Difference between `Buffer.alloc()` (zero-filled) and `Buffer.allocUnsafe()` (fast but contains old memory)?\n3. How do you convert between a UTF-8 string, Base64 string, and a Buffer?',
    practicalTips: 'Never use `Buffer.allocUnsafe()` for sensitive data unless immediately overwritten.'
  },
  {
    category: 'NODEJS',
    name: '9. Streams',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Readable, Writable, Duplex, and Transform streams. Backpressure mechanism (highWaterMark, drain event), stream piping (readable.pipe(writable)), and `stream.pipeline` with error handling.',
    keyQuestions: '1. What is "Backpressure" in Node.js streams and how does it prevent memory overflow?\n2. Why is `stream.pipeline()` preferred over `readable.pipe()` in production code?\n3. Implement a custom Transform stream that transforms incoming text to uppercase or compresses gzip.',
    practicalTips: 'Always use `stream.pipeline(readStream, transform, writeStream, (err) => ...)` to ensure automatic stream cleanup on errors.'
  },
  {
    category: 'NODEJS',
    name: '10. Processes & Environment Variables',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'process.env configuration with dotenv, process.exit codes, process signal handling (SIGINT, SIGTERM for graceful shutdown), child_process (exec, spawn, fork).',
    keyQuestions: '1. How do you implement a Graceful Shutdown handler on `SIGTERM` in Node.js / Express?\n2. What is the difference between `child_process.spawn()` (streamed) and `child_process.exec()` (buffered)?\n3. How does `child_process.fork()` facilitate inter-process communication (IPC)?',
    practicalTips: 'Handle `SIGTERM` and `SIGINT` to close database connections and finish in-flight requests before exiting.'
  },
  {
    category: 'NODEJS',
    name: '11. CPU-Bound vs I/O-Bound Work',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Understanding why Node.js excels at I/O-bound workloads (web APIs, streaming, microservices) but struggles with CPU-bound tasks (image processing, cryptography, heavy math).',
    keyQuestions: '1. What happens to incoming HTTP requests when a single request runs a CPU-intensive loop for 5 seconds?\n2. How should you offload CPU-intensive tasks in a Node.js architecture (Worker Threads, child processes, Redis job queue)?\n3. When should you choose Node.js vs Go/Rust for a backend service?',
    practicalTips: 'Offload heavy CPU workloads to Worker Threads or background queues (BullMQ/Redis).'
  },
  {
    category: 'NODEJS',
    name: '12. Worker Threads',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'worker_threads module (Worker, parentPort, MessageChannel), shared memory with SharedArrayBuffer and Atomics, difference between Worker Threads vs Clustering.',
    keyQuestions: '1. What is the difference between Clustering (multiple processes sharing ports) and Worker Threads (shared memory inside single process)?\n2. How do Worker Threads communicate with the parent process (postMessage & MessageChannel)?\n3. When should you use a Worker Pool instead of spawning a new thread on every request?',
    practicalTips: 'Use a worker thread pool (e.g. piscina) to avoid the overhead of spawning new threads per task.'
  },
  {
    category: 'NODEJS',
    name: '13. Error Handling & Logging',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Operational errors (network failure, invalid input) vs Programmer errors (bugs, undefined access). Global handlers (uncaughtException, unhandledRejection), structured JSON logging with Winston/Pino.',
    keyQuestions: '1. Why should the Node.js process restart after catching an `uncaughtException`?\n2. What is Structured Logging (JSON) and why is it essential for log aggregators (Datadog, ELK)?\n3. How do you correlate logs across asynchronous operations using AsyncLocalStorage?',
    practicalTips: 'Always restart the process via a process manager (PM2/Kubernetes) after an `uncaughtException` to avoid running in corrupted state.'
  },
  {
    category: 'NODEJS',
    name: '14. Node Performance & Memory',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'V8 Garbage Collection (Scavenge, Mark-Sweep-Compact), memory leak types (global variables, uncleared intervals, event listener leaks, closures), heap profiling with Chrome DevTools and clinic.js.',
    keyQuestions: '1. How do you take a heap snapshot of a running Node.js production process and identify memory leaks?\n2. How does V8 generational garbage collection work (Young generation vs Old generation)?\n3. What flag increases the maximum V8 heap memory limit (`--max-old-space-size`)?',
    practicalTips: 'Use `--max-old-space-size=4096` to allocate 4GB RAM to a memory-intensive Node.js process.'
  },
  {
    category: 'NODEJS',
    name: '15. Production Node Architecture',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: '12-factor app principles, health checks (/healthz, /readyz), clustering with PM2, Docker containerization, memory limits, and zero-downtime rolling deploys.',
    keyQuestions: '1. What are Liveness and Readiness probes in Kubernetes/Docker for Node.js services?\n2. How does PM2 cluster mode leverage Node.js cluster module without code changes?\n3. How to design a multi-tier production Node.js microservice architecture?',
    practicalTips: 'Run Node.js behind a reverse proxy like Nginx or AWS ALB for SSL termination, compression, and static asset caching.'
  },

  // ==========================================
  // 5. Express.js (15 Topics)
  // ==========================================
  {
    category: 'EXPRESS',
    name: '1. Express Fundamentals',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Minimalist web framework, express() application instance, request-response cycle, setting up listeners and environments.',
    keyQuestions: '1. How does Express.js simplify building HTTP servers compared to vanilla `http.createServer`?\n2. What is the fundamental lifecycle of a request entering an Express server?',
    practicalTips: 'Keep the Express server entry point clean by modularizing routing, middleware, and database initialization.'
  },
  {
    category: 'EXPRESS',
    name: '2. Routing',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'express.Router(), modular route files, route parameters (`/users/:id`), query strings (`/users?role=admin`), route prefixing (`app.use("/api/v1", router)`).',
    keyQuestions: '1. How does `express.Router` enable modular mini-applications?\n2. How do you match optional route parameters or regex-based routes in Express?\n3. What is the difference between `router.use()` and `router.all()`?',
    practicalTips: 'Organize routes by domain module (e.g. `routes/auth.ts`, `routes/users.ts`).'
  },
  {
    category: 'EXPRESS',
    name: '3. Middleware',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Middleware signature (req, res, next), application-level vs router-level vs error-handling middleware, next() function execution flow, terminating vs continuing requests.',
    keyQuestions: '1. What happens if a middleware does not call `next()` and does not send a response?\n2. What does `next("route")` do inside an Express route handler?\n3. How do you write a custom request execution timer middleware?',
    practicalTips: 'A middleware must either call `next()` or send a response with `res.json()` / `res.send()`. Never leave requests hanging.'
  },
  {
    category: 'EXPRESS',
    name: '4. Request & Response',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'req properties (headers, ip, cookies, params, query, body), res methods (json, status, send, set, redirect, download, cookie, end).',
    keyQuestions: '1. What is the difference between `res.send()`, `res.json()`, and `res.end()`?\n2. Why will calling `res.json()` twice in the same handler throw "Cannot set headers after they are sent to the client"?\n3. How do you set custom HTTP response headers (e.g. Cache-Control, ETag)?',
    practicalTips: 'Always `return res.status(...).json(...)` to prevent code execution from continuing to a second response.'
  },
  {
    category: 'EXPRESS',
    name: '5. Params, Query & Body',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'express.json() body-parser middleware, express.urlencoded({ extended: true }), parsing path parameters (req.params), URL search query parameters (req.query).',
    keyQuestions: '1. Why is `req.body` undefined by default in Express if `express.json()` is not mounted?\n2. Difference between `extended: true` (qs library) and `extended: false` (querystring) in urlencoded parser?\n3. How to protect against payload size memory attacks using `express.json({ limit: "10kb" })`?',
    practicalTips: 'Always set payload limits like `express.json({ limit: "100kb" })` to prevent memory exhaustion attacks.'
  },
  {
    category: 'EXPRESS',
    name: '6. REST API Design',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Nouns not verbs in endpoints (`/api/projects` vs `/api/getProjects`), resource hierarchies (`/projects/:id/features`), idempotency, versioning (`/api/v1`), stateless communication.',
    keyQuestions: '1. What are the key principles of REST architectural style?\n2. Which HTTP methods are idempotent (GET, PUT, DELETE) vs non-idempotent (POST, PATCH)?\n3. How do you design consistent API response wrappers for success and error payloads?',
    practicalTips: 'Use plural nouns for resource endpoints (e.g. `GET /api/v1/users`, `POST /api/v1/users`).'
  },
  {
    category: 'EXPRESS',
    name: '7. HTTP Methods & Status Codes',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: '2xx Success (200 OK, 201 Created, 204 No Content), 3xx Redirection (301, 304 Not Modified), 4xx Client Errors (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable), 5xx Server Errors (500, 502, 503, 504).',
    keyQuestions: '1. Exact difference between 401 Unauthorized (unauthenticated) and 403 Forbidden (authenticated but lacks permission)?\n2. When should an API return 204 No Content vs 200 OK with null?\n3. When should 409 Conflict be returned (e.g. duplicate unique email registration)?',
    practicalTips: '401 = "Who are you?" (needs login). 403 = "I know who you are, but you cannot access this" (needs permission).'
  },
  {
    category: 'EXPRESS',
    name: '8. Validation',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Schema validation with Zod / Joi / express-validator, validating req.body, req.query, and req.params before route handler execution, returning structured 400 validation error responses.',
    keyQuestions: '1. How do you create a reusable Express validation middleware using a Zod schema?\n2. Why is schema-based validation superior to manual if/else checks inside route handlers?\n3. How to sanitize input (strip unknown keys, trim strings) automatically during validation?',
    practicalTips: 'Create a generic `validate(schema)` middleware that parses `req.body` with Zod and passes typed data to the controller.'
  },
  {
    category: 'EXPRESS',
    name: '9. Error Handling',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Centralized error-handling middleware with 4 arguments `(err, req, res, next)`, creating custom `AppError` subclasses with statusCode, catching async errors with express-async-errors.',
    keyQuestions: '1. Why must an Express error-handling middleware explicitly define all 4 arguments `(err, req, res, next)`?\n2. What happens if an unhandled promise rejection occurs inside an async route handler in Express 4 vs Express 5?\n3. How to hide internal stack traces from error responses in production while logging them internally?',
    practicalTips: 'Mount your 4-argument error handler as the very last middleware after all routes.'
  },
  {
    category: 'EXPRESS',
    name: '10. Authentication',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'JWT authentication flow, extracting `Authorization: Bearer <token>` header, verifying token with jwt.verify, attaching decoded user to `req.user`, handling expired tokens.',
    keyQuestions: '1. How does a JWT authenticate a user without querying the database on every request?\n2. What is the security risk of storing sensitive data inside a JWT payload?\n3. How do you implement an `authenticateToken` middleware in Express?',
    practicalTips: 'JWT payloads are only Base64-encoded, NOT encrypted: never put passwords or sensitive PII inside a JWT.'
  },
  {
    category: 'EXPRESS',
    name: '11. Authorization & RBAC',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Role-Based Access Control (RBAC), higher-order authorization middleware `requireRole("ADMIN", "MANAGER")`, checking user permissions against resource ownership.',
    keyQuestions: '1. Implement a generic `authorize(...allowedRoles)` middleware in Express.\n2. How do you handle resource-level authorization (e.g. user can only edit their own profile vs admin can edit all)?\n3. What is Attribute-Based Access Control (ABAC) and when is RBAC insufficient?',
    practicalTips: 'Verify authentication first (`authenticateToken`), then check authorization (`requireRole`).'
  },
  {
    category: 'EXPRESS',
    name: '12. CORS, Cookies & Sessions',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'cors middleware configuration (origin whitelist, credentials: true), cookie-parser middleware, setting HttpOnly, Secure, SameSite cookies with res.cookie().',
    keyQuestions: '1. What CORS headers must be sent to allow credentials (cookies/auth headers) across origins?\n2. Why can JavaScript `document.cookie` not read an `HttpOnly` cookie?\n3. What is the difference between `SameSite: "Strict"`, `SameSite: "Lax"`, and `SameSite: "None"`?',
    practicalTips: 'When setting `credentials: true` in CORS, you CANNOT use `origin: "*"` — you must specify an explicit origin.'
  },
  {
    category: 'EXPRESS',
    name: '13. File Uploads',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Handling multipart/form-data with Multer, memoryStorage (for direct S3 upload) vs diskStorage, file type validation (mimetype check), file size limits.',
    keyQuestions: '1. Why does `express.json()` fail to parse multipart file uploads?\n2. How do you stream uploaded files directly to AWS S3 without saving to local server disk?\n3. How to validate file extensions and MIME types securely to prevent malicious executable uploads?',
    practicalTips: 'Use Multer `memoryStorage()` with streaming directly to cloud storage (S3/Cloudinary) for serverless deployments.'
  },
  {
    category: 'EXPRESS',
    name: '14. Pagination, Filtering & Searching',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Offset-based pagination (`page=2&limit=20`), cursor-based pagination (`cursor=last_id`), dynamic query filters (status, category, date range), case-insensitive search queries.',
    keyQuestions: '1. Why does offset pagination (`OFFSET 100000`) become extremely slow on large database tables?\n2. How does cursor-based pagination solve the offset performance degradation and real-time pagination drift?\n3. How to structure a generic query builder for sorting, filtering, and pagination in Express?',
    practicalTips: 'Use cursor-based pagination (`WHERE id > last_seen_id LIMIT 20`) for high-volume infinite feeds.'
  },
  {
    category: 'EXPRESS',
    name: '15. Production API Security & Architecture',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Security headers with Helmet (HSTS, CSP, X-Frame-Options), rate limiting with express-rate-limit, gzip compression with compression middleware, input sanitization.',
    keyQuestions: '1. What HTTP security headers does Helmet configure automatically and why are they critical?\n2. How do you configure Redis-backed rate limiting across multiple clustered Express instances?\n3. How to prevent Parameter Pollution and SQL/NoSQL injection attacks in Express routes?',
    practicalTips: 'Always mount `app.use(helmet())` and `app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }))` in production apps.'
  },

  // ==========================================
  // 6. PostgreSQL / SQL (20 Topics)
  // ==========================================
  {
    category: 'POSTGRESQL',
    name: '1. SQL Fundamentals',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Relational database concepts, Data Definition Language (CREATE, ALTER, DROP, TRUNCATE) vs Data Manipulation Language (SELECT, INSERT, UPDATE, DELETE), PostgreSQL data types (UUID, JSONB, TIMESTAMP WITH TIME ZONE).',
    keyQuestions: '1. Difference between `DROP`, `TRUNCATE`, and `DELETE` in SQL?\n2. Why should you always use `TIMESTAMPTZ` instead of `TIMESTAMP` in PostgreSQL?\n3. When should you use `JSONB` in PostgreSQL vs normalized relational tables?',
    practicalTips: 'TRUNCATE is DDL (cannot trigger individual row delete triggers) and much faster than DELETE without WHERE.'
  },
  {
    category: 'POSTGRESQL',
    name: '2. INSERT / UPDATE / DELETE',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Batch inserts, RETURNING clause in PostgreSQL (retrieve auto-generated IDs and default values), Upsert with `INSERT INTO ... ON CONFLICT (id) DO UPDATE`.',
    keyQuestions: '1. How does PostgreSQL `RETURNING *` eliminate the need for a secondary SELECT query after INSERT/UPDATE?\n2. Write an Upsert query in PostgreSQL using `ON CONFLICT`.\n3. What happens if you run an UPDATE statement without a WHERE clause?',
    practicalTips: 'Always use `INSERT INTO ... RETURNING id` in Postgres to get the inserted record in a single round-trip.'
  },
  {
    category: 'POSTGRESQL',
    name: '3. Filtering & Sorting',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'WHERE clause predicates, logical operators (AND, OR, NOT), NULL handling (IS NULL, IS NOT NULL, COALESCE), LIKE vs ILIKE (case-insensitive), ORDER BY with NULLS FIRST/LAST, LIMIT & OFFSET.',
    keyQuestions: '1. Why does `WHERE column = NULL` always return zero rows in SQL (three-valued logic: TRUE, FALSE, UNKNOWN)?\n2. Difference between `LIKE` and `ILIKE` in PostgreSQL?\n3. What does `COALESCE(val1, val2, default_val)` do?',
    practicalTips: 'In SQL, NULL is never equal to NULL (`NULL = NULL` is UNKNOWN): always use `IS NULL`.'
  },
  {
    category: 'POSTGRESQL',
    name: '4. Aggregation & GROUP BY',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Aggregate functions (COUNT, SUM, AVG, MIN, MAX), GROUP BY grouping set, HAVING clause (filtering grouped data) vs WHERE clause (filtering raw rows).',
    keyQuestions: '1. What is the fundamental difference between `WHERE` and `HAVING` in SQL?\n2. What is the difference between `COUNT(*)` and `COUNT(column_name)` with null values?\n3. Write a query to find all departments with more than 5 employees having average salary > 50,000.',
    practicalTips: 'WHERE filters rows *before* grouping; HAVING filters aggregated groups *after* grouping.'
  },
  {
    category: 'POSTGRESQL',
    name: '5. Joins',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'INNER JOIN (matching rows in both), LEFT OUTER JOIN (all left + matching right), RIGHT OUTER JOIN, FULL OUTER JOIN, CROSS JOIN (Cartesian product), Self Joins.',
    keyQuestions: '1. Explain the output differences between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN with a Venn diagram.\n2. When would you use a Self Join (e.g. Employee table with manager_id referring to employee_id)?\n3. What is a Cartesian Product and when can a missing join condition cause database crashes?',
    practicalTips: 'Always index the Foreign Key column used in the `ON left.fk = right.id` join condition for fast Hash/Merge joins.'
  },
  {
    category: 'POSTGRESQL',
    name: '6. Subqueries',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Scalar subqueries, multi-row subqueries with IN, ANY, ALL, Correlated subqueries (references outer query row by row), EXISTS vs IN performance.',
    keyQuestions: '1. What is a Correlated Subquery and why does it have higher execution cost than independent subqueries?\n2. Why is `EXISTS` generally faster than `IN` when checking subquery existence with NULL values?\n3. Write a query to find the 2nd highest salary using a subquery.',
    practicalTips: '`SELECT * FROM t1 WHERE EXISTS (SELECT 1 FROM t2 WHERE t2.id = t1.id)` stops scanning as soon as a single match is found.'
  },
  {
    category: 'POSTGRESQL',
    name: '7. CTEs',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Common Table Expressions (`WITH cte_name AS (...)`), query readability, modular query pipelines, Recursive CTEs (`WITH RECURSIVE`) for trees/hierarchies/graphs.',
    keyQuestions: '1. How do CTEs improve query maintainability compared to nested subqueries?\n2. Write a Recursive CTE to traverse an organizational hierarchy (Manager -> Employee -> Subordinates).\n3. Are CTEs in modern PostgreSQL (Postgres 12+) automatically inlined/optimized?',
    practicalTips: 'Use `WITH RECURSIVE` to traverse nested comment trees and folder hierarchies in a single query.'
  },
  {
    category: 'POSTGRESQL',
    name: '8. Window Functions',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Calculations across set of table rows related to current row without collapsing rows: OVER(PARTITION BY ... ORDER BY ...), ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), LAG(), NTILE().',
    keyQuestions: '1. What is the difference between `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` on tied values (e.g. salaries 100, 100, 90)?\n2. Write a query using `LEAD()` or `LAG()` to calculate day-over-day revenue growth.\n3. How do you find the top 3 highest-paid employees in each department using Window Functions?',
    practicalTips: 'RANK() gives 1, 1, 3 (skips rank). DENSE_RANK() gives 1, 1, 2 (no gaps in ranks).'
  },
  {
    category: 'POSTGRESQL',
    name: '9. Primary & Foreign Keys',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Primary key constraint (UNIQUE + NOT NULL), surrogate keys (UUID, BIGSERIAL) vs natural keys, Foreign Key referential integrity, ON DELETE CASCADE, ON DELETE SET NULL, ON DELETE RESTRICT.',
    keyQuestions: '1. Why should you choose UUIDv7 or BIGSERIAL over sequential autoincrement IDs in distributed systems?\n2. Difference between `ON DELETE CASCADE` and `ON DELETE SET NULL` with real-world examples?\n3. Why does PostgreSQL NOT automatically create an index on Foreign Key columns?',
    practicalTips: 'Always manually create an index on foreign key columns in Postgres to prevent full table locks during parent row deletions.'
  },
  {
    category: 'POSTGRESQL',
    name: '10. Constraints',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Enforcing data integrity at the database engine level: NOT NULL, UNIQUE, CHECK constraints (e.g. `CHECK (price > 0)`), DEFAULT values, EXCLUDE constraints in Postgres.',
    keyQuestions: '1. Why is database-level constraint enforcement necessary even if backend validation (Zod) exists?\n2. Write a CHECK constraint ensuring `end_date >= start_date`.\n3. How do multi-column UNIQUE constraints handle NULL values in SQL?',
    practicalTips: 'Application validation protects the user experience; database constraints guarantee absolute data integrity.'
  },
  {
    category: 'POSTGRESQL',
    name: '11. Database Relationships',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'One-to-One (1:1 with unique FK), One-to-Many (1:N with standard FK), Many-to-Many (N:M with junction/bridge table), composite primary keys in junction tables.',
    keyQuestions: '1. How do you design a Many-to-Many relationship between `Users` and `Roles` with audit timestamps?\n2. How to model a Self-Referencing relationship (e.g. Category parent-child hierarchy)?\n3. What are the indexing best practices for a Many-to-Many junction table?',
    practicalTips: 'In a junction table (`user_id`, `role_id`), create composite index on `(user_id, role_id)` and an index on `(role_id)`.'
  },
  {
    category: 'POSTGRESQL',
    name: '12. Normalization',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Eliminating data redundancy and update anomalies: 1NF (atomic values, primary key), 2NF (1NF + no partial dependency on composite key), 3NF (2NF + no transitive dependencies), BCNF.',
    keyQuestions: '1. Explain 1NF, 2NF, and 3NF with a practical e-commerce order schema example.\n2. What is a "Transitive Dependency" and how does 3NF eliminate it?\n3. What are Insertion, Deletion, and Update anomalies in unnormalized schemas?',
    practicalTips: '3NF ensures every non-key attribute depends on "the key, the whole key, and nothing but the key".'
  },
  {
    category: 'POSTGRESQL',
    name: '13. Denormalization',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Trade-off: Trading storage redundancy and write complexity for read throughput and query latency. Pre-aggregating counts, materializing views, caching user names in order items.',
    keyQuestions: '1. When is intentional denormalization justified in high-scale production databases?\n2. How do you maintain consistency when denormalizing data (database triggers vs application layer sync)?\n3. What are Materialized Views in PostgreSQL and how do you refresh them concurrently (`REFRESH MATERIALIZED VIEW CONCURRENTLY`)?',
    practicalTips: 'Only denormalize after indexing and query profiling prove that relational joins are the true bottleneck.'
  },
  {
    category: 'POSTGRESQL',
    name: '14. Indexes',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'B-Tree indexes (default in PostgreSQL for equality and range queries), Hash indexes, GIN / GiST indexes (for JSONB, full-text search, arrays), index write penalty, Index Scan vs Sequential Scan.',
    keyQuestions: '1. How does a B-Tree index work internally (balanced tree, leaf nodes, O(log N) lookup)?\n2. Why do too many indexes degrade INSERT, UPDATE, and DELETE performance?\n3. What is a GIN index in PostgreSQL and why is it used for JSONB fields?',
    practicalTips: 'Indexes speed up reads (O(log N)) but add disk storage and write overhead on every INSERT/UPDATE/DELETE.'
  },
  {
    category: 'POSTGRESQL',
    name: '15. Composite Indexes',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Indexes covering multiple columns: `CREATE INDEX idx_user_status_date ON users (status, created_at)`. Leftmost Prefix Rule (order of columns matters!).',
    keyQuestions: '1. If an index is on `(A, B, C)`, will it speed up queries on `WHERE A = 1`? `WHERE B = 2`? `WHERE A = 1 AND B = 2`?\n2. Explain the "Leftmost Prefix Rule" in composite index lookups.\n3. How should column ordering in a composite index be decided (High cardinality equality first, then range)?',
    practicalTips: 'Put equality filter columns first in a composite index, followed by range filter/sort columns.'
  },
  {
    category: 'POSTGRESQL',
    name: '16. Transactions & ACID',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'ACID Properties: Atomicity (all or nothing), Consistency (preserves valid database state & constraints), Isolation (concurrent transactions do not interfere), Durability (committed changes survive crashes via Write-Ahead Log WAL). BEGIN, COMMIT, ROLLBACK.',
    keyQuestions: '1. Explain each component of ACID with a bank account transfer example (A transfers ₹500 to B).\n2. What is the Write-Ahead Log (WAL) in PostgreSQL and how does it guarantee Durability?\n3. How does savepoint (`SAVEPOINT`) allow partial rollback within a transaction?',
    practicalTips: 'Wrap multi-step financial and order workflows inside a single transaction to prevent partial state corruption.'
  },
  {
    category: 'POSTGRESQL',
    name: '17. Isolation Levels & Locks',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'SQL standard Isolation Levels: Read Uncommitted, Read Committed (Postgres default), Repeatable Read, Serializable. Concurrency anomalies: Dirty Read, Non-Repeatable Read, Phantom Read, Serialization Anomaly. MVCC (Multi-Version Concurrency Control).',
    keyQuestions: '1. What are Dirty Reads, Non-Repeatable Reads, and Phantom Reads?\n2. How does PostgreSQL MVCC allow readers not to block writers and writers not to block readers?\n3. What is the performance cost of Serializable isolation level and how to handle serialization failures (retry loop)?',
    practicalTips: 'PostgreSQL default is Read Committed: each query in a transaction sees snapshots committed before that specific query began.'
  },
  {
    category: 'POSTGRESQL',
    name: '18. Deadlocks',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Deadlock: Transaction A locks resource 1 and waits for resource 2; Transaction B locks resource 2 and waits for resource 1. PostgreSQL deadlock detection daemon (deadlock_timeout), row-level locks (`SELECT ... FOR UPDATE`).',
    keyQuestions: '1. How do you prevent deadlocks in high-concurrency database applications (consistent lock ordering)?\n2. What is the difference between Optimistic Concurrency Control (version column) and Pessimistic Locking (`SELECT FOR UPDATE`)?\n3. How does PostgreSQL automatically resolve a detected deadlock (aborts one transaction)?',
    practicalTips: 'Always acquire resource locks in a consistent, alphabetical/numerical order across all transactions to prevent deadlocks.'
  },
  {
    category: 'POSTGRESQL',
    name: '19. Query Optimization & EXPLAIN',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: '`EXPLAIN ANALYZE` output: Sequential Scan, Index Scan, Index Only Scan, Bitmap Index Scan, Nested Loop, Hash Join, Merge Join, Actual Time, Cost estimation, Buffer usage.',
    keyQuestions: '1. What is the difference between `EXPLAIN` (planner estimate) and `EXPLAIN ANALYZE` (actual execution)?\n2. When is a Sequential Scan faster than an Index Scan (small table or retrieving > 20% of rows)?\n3. What is an Index-Only Scan and how do you achieve it with `INCLUDE` clauses in Postgres indexes?',
    practicalTips: 'Look for "Seq Scan" on large tables in `EXPLAIN ANALYZE` to find missing indexes.'
  },
  {
    category: 'POSTGRESQL',
    name: '20. SQL Interview Problems',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Complex interview queries: Nth highest salary, consecutive active users / login streaks, departmental salary ranking, churn rate, retention cohorts, duplicate record deletion.',
    keyQuestions: '1. Write a query to find the Nth highest salary using DENSE_RANK() or LIMIT/OFFSET.\n2. Write a query to find all users who logged in for 3 consecutive days.\n3. Write a query to delete duplicate rows from a table while keeping the one with the lowest ID.',
    practicalTips: 'Use CTEs + DENSE_RANK() over (ORDER BY salary DESC) as the most standard, robust Nth salary solution.'
  },

  // ==========================================
  // 7. Prisma (15 Topics)
  // ==========================================
  {
    category: 'PRISMA',
    name: '1. Prisma Architecture',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Prisma Client (auto-generated, type-safe query builder), Prisma Schema (declarative data modeling), Prisma Migrate (declarative schema migration engine), Prisma Engine (Rust query engine binary under the hood).',
    keyQuestions: '1. How does Prisma generate 100% type-safe TypeScript interfaces from the schema file?\n2. What is the role of the Rust query engine inside Prisma?\n3. How does Prisma compare to traditional ORMs like TypeORM or Sequelize?',
    practicalTips: 'Run `npx prisma generate` after modifying `schema.prisma` to regenerate type definitions.'
  },
  {
    category: 'PRISMA',
    name: '2. Prisma Schema',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'datasource block (provider, url), generator client block, model definitions, scalar types (String, Int, Float, Boolean, DateTime, Json, Bytes), enums.',
    keyQuestions: '1. How do you configure environment variables (`env("DATABASE_URL")`) in `schema.prisma`?\n2. What is the difference between `@default(cuid())`, `@default(uuid())`, and `@default(autoincrement())`?\n3. How do you define custom enums in PostgreSQL using Prisma schema?',
    practicalTips: 'Use `cuid()` or `uuid()` for distributed-safe primary keys that do not expose sequential enumeration vulnerabilities.'
  },
  {
    category: 'PRISMA',
    name: '3. Models & Fields',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Field attributes: `@id`, `@unique`, `@default()`, `@updatedAt`, `@map()`, `@@map()`, `@@index()`, `@@unique()`, optional fields (`?`), and array fields.',
    keyQuestions: '1. What is the difference between single-field `@unique` and multi-field compound `@@unique([userId, date])`?\n2. How does `@updatedAt` automatically manage timestamp updates in Prisma?\n3. How do you map a camelCase Prisma model name to a snake_case database table with `@@map`?',
    practicalTips: 'Use `@@index([columnA, columnB])` to define composite indexes in Prisma schema.'
  },
  {
    category: 'PRISMA',
    name: '4. CRUD',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'prisma.model.findUnique, findFirst, findMany, create, createMany, update, updateMany, delete, deleteMany, upsert.',
    keyQuestions: '1. Difference between `findUnique` (requires unique/id field) and `findFirst` (accepts any where filter)?\n2. How does `upsert()` work and what happens if the record does vs does not exist?\n3. Why does `updateMany()` return a count `{ count: number }` instead of updated records in Prisma?',
    practicalTips: 'Use `upsert({ where: { id }, update: { ... }, create: { ... } })` for idempotent record creation/syncing.'
  },
  {
    category: 'PRISMA',
    name: '5. Filtering & Sorting',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'where clause filters: equals, in, notIn, lt, lte, gt, gte, contains, startsWith, endsWith, mode: "insensitive", AND, OR, NOT, orderBy (asc/desc).',
    keyQuestions: '1. How do you perform case-insensitive string filtering in Prisma (`mode: "insensitive"`)?\n2. How to compose dynamic multi-condition filters using `AND: [...]` and `OR: [...]`?\n3. How to sort by nested relational field properties (e.g. order users by their profile creation date)?',
    practicalTips: 'Use `mode: "insensitive"` in `contains` filters for robust user search inputs.'
  },
  {
    category: 'PRISMA',
    name: '6. Pagination',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Offset-based pagination (take, skip), cursor-based pagination (take, skip: 1, cursor: { id: last_id }), calculating total pages with count().',
    keyQuestions: '1. Implement cursor-based pagination in Prisma for an infinite scrolling feed.\n2. Why is cursor pagination faster than `skip: 50000` on large tables?\n3. How do you return nextCursor in an API response for the frontend to query the next page?',
    practicalTips: 'Cursor pagination (`cursor: { id }, skip: 1, take: 20`) uses B-tree index seeks and remains fast regardless of depth.'
  },
  {
    category: 'PRISMA',
    name: '7. Relations',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: '1:1 relations (`@relation(fields: [userId], references: [id])`), 1:N relations, Implicit Many-to-Many relations (Prisma manages junction table), Explicit Many-to-Many with custom fields on junction table, referential actions (onDelete: Cascade).',
    keyQuestions: '1. How does Prisma implement implicit Many-to-Many relations under the hood?\n2. When must you switch from an Implicit M:N relation to an Explicit M:N relation model?\n3. What does `onDelete: Cascade` do in Prisma schema?',
    practicalTips: 'Use explicit M:N models whenever you need metadata on the relationship (e.g. `assignedAt`, `role`, `status`).'
  },
  {
    category: 'PRISMA',
    name: '8. Nested Queries',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Nested writes: create, connect, disconnect, connectOrCreate, update, delete inside parent operations. Atomic single-transaction execution of nested writes.',
    keyQuestions: '1. How do you create a User and an associated Profile in a single nested `create` call?\n2. What is `connectOrCreate` and when is it useful (e.g. associating tags)?\n3. Are nested writes executed atomically within a database transaction by default in Prisma?',
    practicalTips: 'Nested writes (e.g. creating User with Posts) are automatically executed inside a database transaction.'
  },
  {
    category: 'PRISMA',
    name: '9. include vs select',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: '`include` returns all scalar fields of the model PLUS related models; `select` allows choosing exact subset of fields (and related models). include and select cannot be used simultaneously at the root level.',
    keyQuestions: '1. Why does `select` improve API performance and reduce database network payload compared to `include`?\n2. Why can you not specify both `include` and `select` on the same level in a Prisma query?\n3. How do you deeply nest a `select` inside another `select`?',
    practicalTips: 'Use `select` in production APIs to avoid fetching heavy text/blob columns and prevent accidental password hash leakage.'
  },
  {
    category: 'PRISMA',
    name: '10. Migrations',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Prisma Migrate workflow: `prisma migrate dev --name <name>` (generates SQL migration, applies to dev DB, regenerates client), `prisma migrate deploy` (production migration without dev checks), `prisma migrate reset`, shadow database.',
    keyQuestions: '1. What is the difference between `prisma migrate dev` and `prisma migrate deploy`?\n2. What is the Prisma Shadow Database and why is it used during migration generation?\n3. How do you handle a migration conflict or failed migration in production?',
    practicalTips: 'Always use `prisma migrate deploy` in production CI/CD pipelines (never `migrate dev`).'
  },
  {
    category: 'PRISMA',
    name: '11. Seed Data',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'prisma/seed.ts script configuration in package.json (`"prisma": { "seed": "tsx prisma/seed.ts" }`), running `npx prisma db seed`, idempotent seeding strategies.',
    keyQuestions: '1. How do you configure custom seed scripts in `package.json` for TypeScript/Node?\n2. How to write idempotent database seed scripts using `upsert()` or clearing records?\n3. How to seed realistic relational test datasets with Faker.js in Prisma?',
    practicalTips: 'Write seed scripts using `upsert` so running `prisma db seed` multiple times does not create duplicate records.'
  },
  {
    category: 'PRISMA',
    name: '12. Transactions',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Sequential transactions with array syntax: `prisma.$transaction([ op1, op2 ])` vs Interactive Transactions: `prisma.$transaction(async (tx) => { ... })`, transaction timeouts, isolation level configuration.',
    keyQuestions: '1. What is the difference between Sequential Array transactions and Interactive Async transactions in Prisma?\n2. What happens if an error is thrown inside an interactive transaction callback?\n3. How do you configure timeout and maxWait options on a Prisma transaction?',
    practicalTips: 'In interactive transactions `prisma.$transaction(async (tx) => ...)`, always use `tx.model` (NOT `prisma.model`) to ensure queries execute inside the transaction.'
  },
  {
    category: 'PRISMA',
    name: '13. N+1 Problem',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'How ORMs can accidentally execute 1 query for parent records + N queries for each child. How Prisma solves N+1 automatically using DataLoader batching (joins / IN clauses).',
    keyQuestions: '1. What is the N+1 query problem and how does it degrade database performance?\n2. How does Prisma query engine automatically batch related queries (e.g. `include: { posts: true }`) using `WHERE user_id IN (...)`?\n3. How can improper looping with `await prisma.child.findMany()` re-introduce the N+1 problem?',
    practicalTips: 'Never run `await prisma.model.find...()` inside a `for` loop or `items.map()`; use a single query with `include` or `where: { id: { in: ids } }`.'
  },
  {
    category: 'PRISMA',
    name: '14. Prisma vs Raw SQL',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'When ORMs hit limitations: complex analytic queries, window functions, CTEs, custom Postgres operators. `prisma.$queryRaw`, `prisma.$executeRaw`, tagged template literals preventing SQL injection.',
    keyQuestions: '1. How does `prisma.$queryRaw` prevent SQL injection using parameterized template literals?\n2. What is the difference between `$queryRaw` (returns data) and `$executeRaw` (returns affected row count)?\n3. How do you type the result of a `$queryRaw` call with TypeScript interfaces?',
    practicalTips: 'Use `prisma.$queryRaw<MyType[]>` tagged template literals for complex analytics queries.'
  },
  {
    category: 'PRISMA',
    name: '15. Production Prisma Patterns',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Prisma Client singleton pattern in Node.js / Next.js to prevent connection pool exhaustion during hot-reloading, Prisma middleware / client extensions (`$extends`), connection pooling with PgBouncer.',
    keyQuestions: '1. Why must PrismaClient be instantiated as a global singleton in development environments?\n2. How do you use Prisma Client Extensions (`$extends`) to add computed fields or automatic soft deletes?\n3. How to configure Prisma connection pooling for serverless environments (AWS Lambda / Vercel)?',
    practicalTips: 'Export a single shared `prisma = new PrismaClient()` instance across the entire application.'
  },

  // ==========================================
  // 8. MongoDB (15 Topics)
  // ==========================================
  {
    category: 'MONGODB',
    name: '1. NoSQL & MongoDB Fundamentals',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Document-oriented database, BSON (Binary JSON) storage format, flexible dynamic schemas, horizontal scaling (sharding), replica sets (high availability).',
    keyQuestions: '1. What are the core architectural differences between relational (SQL) and document (NoSQL) databases?\n2. What is BSON and how does it extend JSON (ObjectId, Date, Binary support)?\n3. What are the CAP theorem trade-offs in MongoDB (CP by default with primary-secondary replica sets)?',
    practicalTips: 'MongoDB is ideal for unstructured/semi-structured data and high write-volume hierarchical documents.'
  },
  {
    category: 'MONGODB',
    name: '2. Documents & Collections',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Collections (equivalent to SQL tables), Documents (equivalent to SQL rows), _id field (12-byte ObjectId: 4-byte timestamp + 5-byte random + 3-byte counter), 16MB document size limit.',
    keyQuestions: '1. What is the internal structure of a MongoDB ObjectId (timestamp, machine ID, process ID, counter)?\n2. What is the maximum document size in MongoDB (16MB) and how do you store files exceeding it (GridFS)?\n3. How does MongoDB schema validation (JSON Schema) work at the collection level?',
    practicalTips: 'You can extract the exact creation timestamp directly from any MongoDB `_id.getTimestamp()`.'
  },
  {
    category: 'MONGODB',
    name: '3. CRUD',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'insertOne, insertMany, findOne, find, updateOne, updateMany, replaceOne, deleteOne, deleteMany, findOneAndUpdate, Mongoose schema models.',
    keyQuestions: '1. Difference between `updateOne()` and `replaceOne()` in MongoDB?\n2. How does `findOneAndUpdate(filter, update, { new: true })` return the updated document?\n3. What is the write concern (`w: 1`, `w: "majority"`) and read concern in MongoDB?',
    practicalTips: 'Pass `{ returnDocument: "after" }` or `{ new: true }` in findOneAndUpdate to get the updated document.'
  },
  {
    category: 'MONGODB',
    name: '4. Query Operators',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Comparison ($eq, $ne, $gt, $gte, $lt, $lte, $in, $nin), Logical ($and, $or, $not, $nor), Element ($exists, $type), Array ($all, $elemMatch, $size).',
    keyQuestions: '1. When is `$elemMatch` required when querying arrays of subdocuments instead of dot notation?\n2. How do you query documents where an optional field exists and is not null (`{ field: { $exists: true, $ne: null } }`)?\n3. What is the difference between `$in` and `$all` for array fields?',
    practicalTips: 'Use `$elemMatch` when matching multiple criteria on the SAME subdocument within an array.'
  },
  {
    category: 'MONGODB',
    name: '5. Update Operators',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Field operators ($set, $unset, $inc, $rename, $min, $max), Array operators ($push, $pull, $addToSet, $pop, positional operator `$`, all positional `$[ ]`).',
    keyQuestions: '1. Difference between `$push` (allows duplicates) and `$addToSet` (sets unique values only)?\n2. How to update a specific matched element in an array using the positional `$` operator?\n3. What does atomic `$inc: { viewCount: 1 }` prevent in high-concurrency environments?',
    practicalTips: 'Use `$inc` for atomic counter updates to prevent race conditions.'
  },
  {
    category: 'MONGODB',
    name: '6. Data Modeling',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Designing schemas based on application access patterns (reads vs writes) rather than entities: Embedding (denormalized, high read performance) vs Referencing (normalized, consistency).',
    keyQuestions: '1. What are the key criteria for deciding between Embedding and Referencing in MongoDB?\n2. What are common MongoDB anti-patterns (e.g. massive unbounded arrays growing past 16MB)?\n3. Explain the "Outlier Pattern" and "Bucket Pattern" for high-volume time-series data.',
    practicalTips: 'Rule of thumb: "Embed unless there is a compelling reason not to" (unbounded growth, frequent standalone queries).'
  },
  {
    category: 'MONGODB',
    name: '7. Embedding vs Referencing',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'One-to-Few (Embed e.g. User addresses), One-to-Many (Embed/Reference e.g. Product reviews), One-to-Squillions (Reference with parent reference on child e.g. Server log entries).',
    keyQuestions: '1. Why does embedding 100,000 comments inside a single Blog Post document cause document fragmentation and performance collapse?\n2. When should you use a Two-Way Reference vs a One-Way Child Reference?\n3. How do you model Many-to-Many relationships using arrays of ObjectIds?',
    practicalTips: 'For 1-to-Squillions relationships, store the `parentId` reference on the child document.'
  },
  {
    category: 'MONGODB',
    name: '8. One-to-Many / Many-to-Many',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Modeling patterns: Subset Pattern (store top 5 recent reviews inside parent, archive rest in separate collection), Extended Reference Pattern (store necessary join fields to eliminate lookups).',
    keyQuestions: '1. How does the Subset Pattern improve mobile dashboard latency in MongoDB?\n2. How does Extended Reference pattern duplicate only frequently-read fields (e.g. customer name on invoice)?\n3. How do you keep denormalized referenced fields in sync when the source document changes?',
    practicalTips: 'The Extended Reference pattern reduces cross-collection lookups for 95% of reads.'
  },
  {
    category: 'MONGODB',
    name: '9. Indexes',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Single field indexes, Compound indexes, Multikey indexes (indexing arrays), Text indexes (search), TTL indexes (automatic document expiration after seconds), Partial and Sparse indexes.',
    keyQuestions: '1. What is a TTL (Time-To-Live) index and how does MongoDB use it to automatically clean up expired sessions/tokens?\n2. What is a Multikey index and what are its restrictions (cannot index two array fields in a single compound index)?\n3. What is a Sparse index and when is it preferred over a standard index?',
    practicalTips: 'Use TTL indexes (`expireAfterSeconds: 3600`) for automatic expiration of OTPs and session tokens.'
  },
  {
    category: 'MONGODB',
    name: '10. Compound Indexes',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Index on multiple fields `db.collection.createIndex({ status: 1, createdAt: -1 })`. The ESR (Equality, Sort, Range) Rule for ordering index keys for maximum efficiency.',
    keyQuestions: '1. Explain the "ESR (Equality, Sort, Range) Rule" for optimizing MongoDB compound indexes.\n2. Why should Equality fields precede Sort fields, and Range fields come last in a compound index?\n3. How do you analyze index usage with `explain("executionStats")` in MongoDB?',
    practicalTips: 'Always structure compound indexes following ESR: 1. Equality fields, 2. Sort fields, 3. Range filter fields.'
  },
  {
    category: 'MONGODB',
    name: '11. Aggregation Pipeline',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Multi-stage data processing pipeline: $match (filter), $group (aggregate), $project (reshape), $sort, $limit, $skip, $unwind (deconstruct arrays), $addFields, $facet (multi-faceted analytics).',
    keyQuestions: '1. How does the MongoDB Aggregation Pipeline differ from basic `find()` queries?\n2. What does `$unwind` do when applied to an array field in a document?\n3. How do you use `$facet` to calculate total document count and paginated items in a single round-trip?',
    practicalTips: 'Place `$match` and `$sort` at the very beginning of the pipeline so MongoDB can utilize indexes before transforming data.'
  },
  {
    category: 'MONGODB',
    name: '12. $lookup',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Left outer join to an unsharded collection in the same database: `$lookup: { from, localField, foreignField, as }`, correlated subqueries with pipeline in $lookup.',
    keyQuestions: '1. How does `$lookup` perform joins in MongoDB and what is its performance impact compared to SQL joins?\n2. How do you specify custom pipeline stages inside a `$lookup` join?\n3. Why should `$lookup` be used sparingly in high-frequency read paths?',
    practicalTips: 'Ensure the `foreignField` in the target collection has an index to prevent full collection scans during `$lookup`.'
  },
  {
    category: 'MONGODB',
    name: '13. Pagination',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Offset-based pagination (.skip().limit() performance degradation on large offsets), Range-based / Bucket pagination using `_id: { $gt: lastId }` and indexes.',
    keyQuestions: '1. Why does `.skip(100000).limit(20)` cause severe memory and CPU load in MongoDB?\n2. Implement range-based pagination in MongoDB using `_id` and compound indexes.\n3. How to combine search filters with cursor-based pagination in MongoDB?',
    practicalTips: 'Use `_id: { $gt: lastSeenId }` with `.limit(pageSize)` for instantaneous O(1) pagination.'
  },
  {
    category: 'MONGODB',
    name: '14. Transactions & Replication Basics',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Multi-document ACID transactions in MongoDB (requires replica set), session-based transactions (`session.startTransaction()`), Replica Sets (Primary, Secondary, Arbiter, automatic failover).',
    keyQuestions: '1. How does a MongoDB Replica Set elect a new Primary when the current Primary goes offline (Raft-like consensus)?\n2. How do you execute a multi-document transaction in Mongoose / MongoDB driver?\n3. What is Sharding and how does a Shard Key distribute data across horizontal clusters?',
    practicalTips: 'Single-document operations in MongoDB are always atomic; multi-document transactions should only be used when necessary.'
  },
  {
    category: 'MONGODB',
    name: '15. PostgreSQL vs MongoDB',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Comprehensive architectural trade-off analysis: Relational vs Document, Strict Schema vs Dynamic Schema, Complex Joins vs Embedded Documents, ACID everywhere vs Document atomicity, Postgres JSONB vs MongoDB.',
    keyQuestions: '1. Compare PostgreSQL JSONB with MongoDB: when is Postgres + JSONB sufficient vs needing dedicated MongoDB?\n2. Under what workload conditions would you choose MongoDB over PostgreSQL and vice versa?\n3. How do you design a polyglot persistence architecture (e.g. Postgres for financial transactions, MongoDB/Redis for activity feeds)?',
    practicalTips: 'Choose PostgreSQL as the default for transactional integrity and relational data; choose MongoDB when documents have highly polymorphic schemas or high write throughput requirements.'
  },

  // ==========================================
  // 9. Authentication & Security (15 Topics)
  // ==========================================
  {
    category: 'AUTH_SECURITY',
    name: '1. Authentication vs Authorization',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Authentication (AuthN: Who are you? Identity verification) vs Authorization (AuthZ: What permissions do you have? Access control). 401 Unauthorized vs 403 Forbidden.',
    keyQuestions: '1. Explain AuthN vs AuthZ with a real-world airport analogy (Passport = AuthN, Boarding Pass with Seat = AuthZ).\n2. Which HTTP status code corresponds to an Authentication failure vs Authorization failure?\n3. Why should authentication always precede authorization in the middleware chain?',
    practicalTips: 'Authentication verifies identity; Authorization verifies permission.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '2. Password Hashing',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Cryptographic hash functions vs One-way password hashing (Bcrypt, Argon2, PBKDF2), Salt (random value preventing Rainbow Table attacks), Cost/Work Factor (adaptive slow hashing preventing brute-force GPU attacks).',
    keyQuestions: '1. Why should fast hashing algorithms like MD5 or SHA-256 NEVER be used for password storage?\n2. What is a "Salt" and how does it prevent Rainbow Table attacks?\n3. What is the "Work Factor" in Bcrypt and how does it protect against future hardware speedups?',
    practicalTips: 'Always use Bcrypt (cost factor >= 10) or Argon2id for password hashing. Never roll your own crypto.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '3. JWT',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'JSON Web Token structure: Header (alg, typ) . Payload (claims: sub, exp, iat, role) . Signature (HMACSHA256(header.payload, secret)). Symmetric (HS256) vs Asymmetric (RS256 with public/private keys).',
    keyQuestions: '1. How does a server verify a JWT signature without storing the session in a database?\n2. Difference between Symmetric signing (HS256 with shared secret) and Asymmetric signing (RS256 with public/private key pair)?\n3. Can a client modify a JWT payload without invalidating the signature?',
    practicalTips: 'Anyone can decode a JWT payload (Base64Url) — the signature only verifies it hasn’t been tampered with.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '4. Access & Refresh Tokens',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Short-lived Access Tokens (15 mins, held in memory) + Long-lived Refresh Tokens (7 days, stored in HttpOnly cookie). Refresh Token Rotation & Token Family Reuse/Replay Detection (invalidates all tokens upon breach).',
    keyQuestions: '1. Why should Access Tokens be short-lived (15 minutes)?\n2. How does Refresh Token Rotation with Token Family tracking detect and neutralize stolen tokens?\n3. What is the full client-server flow when an Access Token expires during an API request (silent refresh / 401 interceptor)?',
    practicalTips: 'If an already-used refresh token is submitted again, revoke the ENTIRE token family immediately (breach detected).'
  },
  {
    category: 'AUTH_SECURITY',
    name: '5. Cookies & Sessions',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Stateful Session-based authentication (Session ID stored in server Redis + sent in cookie) vs Stateless Token-based authentication (JWT). Trade-offs in scalability, revokability, and server memory.',
    keyQuestions: '1. What are the advantages and disadvantages of Stateful Sessions vs Stateless JWTs?\n2. How do you immediately revoke access for a compromised user in a stateless JWT architecture (token blacklisting / version counter)?\n3. Why are sessions preferred for traditional monoliths and JWTs for microservices?',
    practicalTips: 'Store a `tokenVersion` or `passwordChangedAt` timestamp in the database to invalidate JWTs globally when passwords reset.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '6. HttpOnly / Secure / SameSite',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Cookie security flags: `HttpOnly` (blocks document.cookie access, prevents XSS token theft), `Secure` (only sent over encrypted HTTPS), `SameSite: "Strict" | "Lax" | "None"` (controls cross-site cookie transmission, prevents CSRF).',
    keyQuestions: '1. Why is storing JWTs in LocalStorage dangerous (XSS vulnerability) compared to HttpOnly cookies?\n2. Difference between `SameSite=Strict` (never sent on cross-site links) and `SameSite=Lax` (sent on top-level GET navigation)?\n3. When is `SameSite=None; Secure` required (cross-origin iframe / third-party API auth)?',
    practicalTips: 'Always set `httpOnly: true`, `secure: true`, and `sameSite: "lax"` on authentication cookies in production.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '7. RBAC',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Role-Based Access Control: Users -> Roles (e.g. Admin, Manager, Member) -> Permissions (e.g. read:reports, write:projects). Hierarchical roles and middleware permission guards.',
    keyQuestions: '1. How do you structure a database schema for RBAC with Users, Roles, and Permissions?\n2. How do you write an Express middleware that checks specific granular permissions (`hasPermission("write:project")`) rather than hardcoded role strings?\n3. What is the difference between RBAC and ABAC (Attribute-Based Access Control)?',
    practicalTips: 'Authorize against granular Permissions (`canEditProject`), not broad Roles (`isAdmin`), for maximum flexibility.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '8. CORS',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Cross-Origin Resource Sharing security mechanism enforced by browsers. Preflight `OPTIONS` requests, `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Credentials`.',
    keyQuestions: '1. What triggers a browser CORS Preflight (OPTIONS) request (custom headers, non-simple HTTP methods like PUT/DELETE, JSON content-type)?\n2. Is CORS a server security mechanism or a browser protection mechanism (can curl bypass CORS)?\n3. How to properly configure CORS for a frontend on `https://app.example.com` calling an API on `https://api.example.com`?',
    practicalTips: 'CORS is enforced by the BROWSER to protect users, not to protect the server from automated scripts/Postman.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '9. CSRF',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Cross-Site Request Forgery: An attacker tricks a victim’s browser into executing unwanted actions on an authenticated site using ambient credentials (cookies). Defenses: SameSite Cookies, Synchronizer Token Pattern (CSRF tokens), Custom Request Headers (`X-Requested-With`).',
    keyQuestions: '1. Explain how a classic CSRF attack works with an image tag `<img src="http://bank.com/transfer?amount=1000&to=hacker">`.\n2. How does the Synchronizer Token Pattern (Anti-CSRF token) prevent CSRF attacks?\n3. Why are APIs that authenticate via `Authorization: Bearer <token>` header immune to classic CSRF attacks?',
    practicalTips: 'Bearer tokens in headers are immune to CSRF because browsers never attach custom headers automatically.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '10. XSS',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Cross-Site Scripting: Injecting malicious client-side scripts. Stored XSS (saved in database), Reflected XSS (reflected in URL/response), DOM-based XSS (client JS modifies DOM unsafely e.g. innerHTML). Defenses: React automatic JSX escaping, Content Security Policy (CSP), DOMPurify sanitization.',
    keyQuestions: '1. Difference between Stored XSS, Reflected XSS, and DOM-based XSS?\n2. Why is `dangerouslySetInnerHTML` in React dangerous and how do you sanitize HTML with DOMPurify?\n3. What is a Content Security Policy (CSP) header and how does it block unauthorized script execution?',
    practicalTips: 'Never render raw user HTML without running it through `DOMPurify.sanitize()`. React auto-escapes standard JSX expressions.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '11. SQL Injection',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: "SQLi: Injecting malicious SQL fragments into input fields to manipulate backend queries (e.g. ' OR '1'='1). Defenses: Parameterized queries / Prepared Statements, ORMs (Prisma), input validation. NoSQL injection ($ne in JSON body).",
    keyQuestions: '1. How do Parameterized Queries / Prepared Statements completely prevent SQL Injection at the database driver level?\n2. Explain NoSQL injection in MongoDB when parsing raw JSON `{ username: "admin", password: { $ne: null } }`.\n3. Can ORMs like Prisma or Mongoose still be vulnerable to SQL injection if raw queries ($queryRawUnsafe) are used improperly?',
    practicalTips: 'Never concatenate strings into SQL queries (`"SELECT * FROM users WHERE id = " + id`): always use parameterized placeholders ($1, ?).'
  },
  {
    category: 'AUTH_SECURITY',
    name: '12. Input Validation',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Defense in depth: Validate on client for UX, enforce strictly on server for security. Strict schema validation (Zod/Joi), type coercion checks, string trimming, stripping unexpected properties (whitelist validation), sanitizing special characters.',
    keyQuestions: '1. Why should you never rely solely on frontend validation for application security?\n2. What is "Mass Assignment Vulnerability" and how does schema whitelisting prevent it (e.g. user injecting `isAdmin: true` in signup body)?\n3. How to validate and sanitize complex nested data structures with Zod in Express?',
    practicalTips: 'Use `.strip()` or explicit Zod schemas to reject or ignore unexpected fields in request payloads.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '13. Rate Limiting',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'Preventing brute-force login attacks, credential stuffing, and DoS. Algorithms: Fixed Window, Sliding Window Log, Token Bucket, Leaky Bucket. Redis-backed rate limiting (express-rate-limit + rate-limit-redis), 429 Too Many Requests status.',
    keyQuestions: '1. Explain the difference between Fixed Window and Sliding Window rate limiting algorithms.\n2. Why must rate limiting be backed by Redis rather than in-memory in a multi-instance / clustered backend?\n3. What headers are returned during rate limiting (`Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`)?',
    practicalTips: 'Apply strict rate limiting (e.g. max 5 attempts per 15 minutes) on sensitive endpoints like `/api/auth/login` and `/api/auth/forgot-password`.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '14. API Security',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'API Keys vs Bearer Tokens, HTTPS / TLS encryption in transit, Secrets management (.env outside Git, AWS Secrets Manager), Security Headers (Helmet: Strict-Transport-Security HSTS, X-Content-Type-Options: nosniff, Referrer-Policy).',
    keyQuestions: '1. What is HSTS (HTTP Strict Transport Security) and how does it protect against SSL stripping attacks?\n2. What are the best practices for storing and rotating API secrets and private keys?\n3. How do you implement IP allowlisting or Web Application Firewalls (WAF) for sensitive admin APIs?',
    practicalTips: 'Never commit `.env` files to Git. Use environment variables injected at runtime via secret managers.'
  },
  {
    category: 'AUTH_SECURITY',
    name: '15. Secure Authentication Architecture',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_1',
    notes: 'End-to-end full-stack authentication blueprint: Login -> Hash check -> Generate short-lived Access Token + set HttpOnly Refresh Token cookie -> Client stores Access Token in memory -> Axios interceptor handles 401 & calls `/api/auth/refresh` -> Silent token rotation -> Logout clears cookie & revokes token family.',
    keyQuestions: '1. Walk through the complete lifecycle of an authentication session from login to silent refresh to logout.\n2. How do you handle authentication across multiple subdomains (e.g. `app.example.com` and `api.example.com`) using cookie domain configuration?\n3. How do you design multi-factor authentication (MFA / TOTP) with Google Authenticator?',
    practicalTips: 'Never store JWTs in LocalStorage or SessionStorage — keep Access Tokens in JS memory and Refresh Tokens in secure HttpOnly cookies.'
  },

  // ==========================================
  // 10. Web / CS Fundamentals (20 Topics)
  // ==========================================
  {
    category: 'CS_FUNDAMENTALS',
    name: '1. How the Web Works (DNS, HTTP/HTTPS, TCP/IP, Browser Engine)',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'Complete lifecycle when typing URL: 1. Browser cache/OS DNS lookup -> 2. Recursive DNS resolver -> 3. TCP 3-Way Handshake -> 4. TLS Handshake -> 5. HTTP GET request -> 6. Server processes & returns HTML -> 7. Browser parses DOM, CSSOM -> 8. Render Tree -> 9. Layout & Paint.',
    keyQuestions: '1. Explain the step-by-step journey of what happens when you type https://google.com into your browser and press Enter.\n2. What is the role of the Recursive DNS Resolver, Root Server, TLD Server, and Authoritative Name Server?\n3. How do browser caching, OS caching, and router caching speed up DNS resolution?',
    practicalTips: 'Structure your answer in 4 clear phases: 1. DNS Resolution, 2. TCP/TLS Connection, 3. HTTP Request/Response, 4. Browser Critical Rendering Path.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '2. HTTP/1.1 vs HTTP/2 vs HTTP/3',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'HTTP/1.1 (plain text, Head-of-Line blocking at application layer, persistent connections) vs HTTP/2 (binary framing, multiplexing over single TCP connection, header compression HPACK, server push) vs HTTP/3 (runs over QUIC / UDP, eliminates TCP head-of-line blocking on packet loss, zero-RTT connection resumption).',
    keyQuestions: '1. What is "Head-of-Line (HoL) Blocking" and how did HTTP/2 solve it at the application layer while remaining vulnerable at the TCP transport layer?\n2. How does HTTP/2 Multiplexing allow hundreds of concurrent requests over a single TCP connection?\n3. Why does HTTP/3 switch from TCP to QUIC over UDP?',
    practicalTips: 'HTTP/2 multiplexes multiple streams over 1 TCP connection; HTTP/3 uses QUIC/UDP so one dropped packet doesn’t stall other streams.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '3. TCP 3-Way Handshake, Flow Control & UDP',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK. TCP connection teardown (4-Way FIN). TCP properties: reliable, ordered, connection-oriented, flow control (sliding window), congestion control (slow start, AIMD). UDP: connectionless, lightweight, unreliable, zero handshake overhead (used in DNS, gaming, video streaming, HTTP/3).',
    keyQuestions: '1. Explain the TCP 3-Way Handshake sequence numbers (ISN) and acknowledgment numbers.\n2. What is TCP Flow Control (Sliding Window) vs TCP Congestion Control?\n3. When would you choose UDP over TCP?',
    practicalTips: 'TCP guarantees reliability and packet ordering; UDP guarantees speed and low latency.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '4. SSL/TLS Handshake & Encryption',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'Symmetric encryption (same shared key for encrypt/decrypt e.g. AES - fast) vs Asymmetric encryption (public key encrypts, private key decrypts e.g. RSA, ECC - slow). TLS 1.2 vs TLS 1.3 Handshake (1-RTT, Diffie-Hellman key exchange). Digital Certificates & Certificate Authorities (CA).',
    keyQuestions: '1. Why does HTTPS use Asymmetric encryption during the handshake and Symmetric encryption for data transfer?\n2. What is the role of a Certificate Authority (CA) and how does the browser verify trust in a website SSL certificate?\n3. How does TLS 1.3 reduce handshake latency to a single round-trip (1-RTT)?',
    practicalTips: 'Asymmetric encryption is used solely to exchange a temporary Symmetric Session Key, which encrypts the actual HTTP payload.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '5. Critical Rendering Path (DOM, CSSOM, Reflow & Repaint)',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'HTML parser -> DOM tree. CSS parser -> CSSOM tree (render-blocking). Combined -> Render Tree. Layout / Reflow (computing exact geometry & coordinates). Paint (rasterizing pixels). Composite (layering on GPU). Script tag execution (parser-blocking, async vs defer).',
    keyQuestions: '1. What is the difference between `async` and `defer` attributes on script tags?\n2. What triggers a browser Reflow (Layout) vs Repaint, and which is more computationally expensive?\n3. How to optimize animations using GPU-composited properties (`transform` and `opacity`)?',
    practicalTips: 'Use `transform` and `opacity` for 60fps animations because they bypass Layout and Paint, running directly on the GPU Compositor.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '6. Browser Storage (LocalStorage, SessionStorage, IndexedDB, Cookies)',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'LocalStorage (~5MB, synchronous, persists across tabs/restarts), SessionStorage (~5MB, tab-scoped), IndexedDB (hundreds of MB/GBs, asynchronous, object store for large offline data), Cookies (~4KB, sent with HTTP requests).',
    keyQuestions: '1. Compare storage limits, persistence lifespan, and performance characteristics of LocalStorage vs IndexedDB vs Cookies.\n2. Why can large operations on LocalStorage freeze the main UI thread (synchronous I/O)?\n3. How does the Cache API work in Service Workers for offline PWA caching?',
    practicalTips: 'Never store large objects in LocalStorage because reads and writes are synchronous and block the main thread; use IndexedDB for large data.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '7. Same-Origin Policy (SOP) & CORS Deep Dive',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'Same-Origin Policy definition: Origin = Scheme (http/https) + Hostname (example.com) + Port (:8080). What SOP restricts: AJAX/Fetch, iframe DOM access, Canvas read. What SOP permits: embedding images, stylesheets, scripts.',
    keyQuestions: '1. If site A is `https://example.com:443`, are `http://example.com`, `https://api.example.com`, and `https://example.com:8080` same-origin?\n2. Why does the Same-Origin Policy exist and what attacks would be trivial without it?\n3. How does CORS provide a safe exception mechanism to the Same-Origin Policy?',
    practicalTips: 'Origin requires matching protocol, domain, AND port.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '8. Core Web Vitals & Web Performance Optimization',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'LCP (Largest Contentful Paint: loading speed, < 2.5s), INP (Interaction to Next Paint: responsiveness, < 200ms, replaced FID), CLS (Cumulative Layout Shift: visual stability, < 0.1). TTFB (Time to First Byte). Image optimization (WebP/AVIF, responsive srcset, lazy loading).',
    keyQuestions: '1. What are the 3 Core Web Vitals metrics and what thresholds determine a "Good" user experience?\n2. What causes Cumulative Layout Shift (CLS) and how do you prevent it (explicit width/height on images & ad containers)?\n3. How do you reduce Time to First Byte (TTFB)?',
    practicalTips: 'Always specify `width` and `height` attributes on `<img>` tags to reserve aspect ratio space and achieve 0 CLS.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '9. Real-time Communication (WebSockets vs SSE vs Long Polling)',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'WebSockets (full-duplex bidirectional TCP connection initiated via HTTP Upgrade, low overhead for chat/gaming), Server-Sent Events (unidirectional server-to-client stream over HTTP, built-in reconnection, ideal for notifications/LLM streaming), Short Polling vs Long Polling (holding request until data arrives).',
    keyQuestions: '1. Compare WebSockets vs Server-Sent Events (SSE): when is SSE simpler and better than WebSockets?\n2. How does the WebSocket HTTP Upgrade handshake work (`101 Switching Protocols`)?\n3. Why is SSE ideal for AI Chat (ChatGPT streaming) and live stock price updates?',
    practicalTips: 'If you only need server-to-client streaming (e.g. LLM streaming, live notifications), use SSE (`text/event-stream`) over standard HTTP/2.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '10. Caching Strategies (HTTP Headers, Browser Cache, CDN & Redis)',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'HTTP Cache-Control (max-age, no-cache, no-store, immutable, stale-while-revalidate), Validation with ETag / If-None-Match (304 Not Modified), CDN Edge Caching, Server In-Memory Cache (Redis). Caching patterns: Cache-Aside, Read-Through, Write-Through, Write-Behind.',
    keyQuestions: '1. What is the exact difference between `Cache-Control: no-cache` (must revalidate with server before using) and `no-store` (never write to disk)?\n2. How does `ETag` validation return `304 Not Modified` and save bandwidth?\n3. Explain the Cache-Aside pattern with Redis and how to handle cache invalidation on updates.',
    practicalTips: 'Use `Cache-Control: public, max-age=31536000, immutable` for hashed static assets (e.g. `main.a8b3c.js`).'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '11. API Architectural Styles (REST vs GraphQL vs gRPC vs tRPC)',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'REST (resource-oriented, standard HTTP methods, caching friendly), GraphQL (single endpoint, flexible client-specified queries, solves over-fetching and under-fetching), gRPC (Protocol Buffers binary serialization, HTTP/2 multiplexing, ultra-fast microservice RPC), tRPC (end-to-end type-safety in TypeScript monorepos without schema compilation).',
    keyQuestions: '1. What problems does GraphQL solve (over-fetching, under-fetching) and what are its trade-offs (caching difficulty, complex query cost attacks)?\n2. Why is gRPC faster than REST for internal microservice communication (binary Protobuf vs JSON)?\n3. When would you choose tRPC in a full-stack Next.js / TypeScript project?',
    practicalTips: 'Use REST for public APIs and standard CRUD; use gRPC for high-performance internal microservices; use GraphQL for complex client-driven data graphs.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '12. Monolithic vs Microservices Architecture',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'Monolith (single codebase, simple deployment, easy transactions, unified monitoring) vs Microservices (independent deployments, polyglot tech stack, isolated scaling, distributed complexity). Fallacies of distributed computing, Database-per-service pattern, Saga pattern for distributed transactions.',
    keyQuestions: '1. What are the operational overheads and complexities of moving from a Monolith to Microservices?\n2. What is the Database-Per-Service pattern and how do you handle cross-service queries without distributed joins?\n3. How does the Saga Pattern (Choreography vs Orchestration) handle distributed transactions across microservices?',
    practicalTips: 'Start with a clean Modular Monolith; only split into Microservices when team organizational boundaries and independent scaling demands require it.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '13. Load Balancing & Reverse Proxies',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'Reverse Proxy (Nginx, Envoy: SSL termination, compression, routing, security) vs Forward Proxy (client proxy). Load Balancing Algorithms: Round Robin, Weighted Round Robin, Least Connections, IP Hash (sticky sessions). Layer 4 (TCP) vs Layer 7 (HTTP application routing) load balancers.',
    keyQuestions: '1. Difference between a Forward Proxy (protects clients) and a Reverse Proxy (protects backend servers)?\n2. Explain Layer 4 vs Layer 7 load balancing with real-world examples.\n3. How do Load Balancers perform health checks to automatically remove failed server instances?',
    practicalTips: 'Layer 7 load balancers can inspect HTTP headers, cookies, and URL paths to route traffic intelligently.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '14. OS Fundamentals: Processes vs Threads',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'Process (independent execution unit with its own isolated virtual memory space: Text/Code, Data, Heap, Stack) vs Thread (lightweight unit of execution within a process sharing the same Heap, Code, and Open Files, with private Stack and Registers). Context Switching overhead.',
    keyQuestions: '1. Compare Process vs Thread memory layout (what is shared and what is private)?\n2. Why is a Process Context Switch much more expensive than a Thread Context Switch (flushing TLB cache)?\n3. What is a Race Condition and how does thread synchronization prevent it?',
    practicalTips: 'Threads within the same process share the Heap and Data segments, making inter-thread communication fast but vulnerable to race conditions without locks.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '15. CPU Scheduling & Concurrency',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'Preemptive vs Non-preemptive scheduling. Scheduling algorithms: First-Come First-Served (FCFS), Shortest Job First (SJF), Round Robin (time quantum), Multi-Level Feedback Queue. Concurrency Synchronization: Mutex (binary lock), Semaphores (counting lock), Condition Variables, Critical Section problem.',
    keyQuestions: '1. Difference between a Mutex (only locking thread can unlock) and a Semaphore (any thread can signal/release)?\n2. What is the effect of choosing a time quantum that is too small vs too large in Round Robin scheduling?\n3. What is Priority Inversion and how does Priority Inheritance solve it?',
    practicalTips: 'A Mutex provides Mutual Exclusion (ownership); a Counting Semaphore manages access to a finite pool of shared resources.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '16. Virtual Memory & Paging',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'Virtual Memory abstraction (gives each process illusion of large contiguous memory), MMU (Memory Management Unit), Paging (fixed-size memory blocks: Virtual Pages -> Physical Page Frames), Page Tables, TLB (Translation Lookaside Buffer), Page Faults (loading missing page from disk swap space), Thrashing.',
    keyQuestions: '1. What happens during a Page Fault step-by-step?\n2. What is the Translation Lookaside Buffer (TLB) and why is it essential for fast memory access?\n3. What is "Thrashing" in Operating Systems and how does the Working Set Model prevent it?',
    practicalTips: 'Virtual memory isolates processes from each other, preventing one buggy process from corrupting another process’s physical memory.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '17. Deadlocks: 4 Coffman Conditions',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'The 4 Necessary Coffman Conditions for a Deadlock: 1. Mutual Exclusion (non-shareable resources), 2. Hold and Wait (process holding resource requests another), 3. No Preemption (resources cannot be forcibly confiscated), 4. Circular Wait (circular chain of processes waiting for each other). Deadlock prevention, avoidance (Banker’s Algorithm), detection & recovery.',
    keyQuestions: '1. State and explain the 4 Coffman conditions required for a deadlock to occur.\n2. How does enforcing a strict global Resource Ordering eliminate the Circular Wait condition?\n3. How does Banker’s Algorithm determine if resource allocation will leave the system in a "Safe State"?',
    practicalTips: 'To prevent deadlocks, eliminate any ONE of the 4 Coffman conditions (most commonly eliminating Circular Wait via strict resource ordering).'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '18. File Systems, Inodes & Async I/O',
    priority: 'HIGH',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'Unix File System architecture: Inode (data structure storing file metadata: permissions, owner, size, direct/indirect block pointers; does NOT store filename), Directory (maps filenames to Inode numbers), Hard links vs Soft/Symbolic links, File Descriptors, Non-blocking I/O (epoll, kqueue, io_uring).',
    keyQuestions: '1. What information is stored in an Inode and why is the filename stored in the directory table instead of the Inode?\n2. What is the difference between a Hard Link (shares same Inode) and a Soft/Symbolic Link (pointer to path)?\n3. How does `epoll` in Linux enable handling 100,000 concurrent network sockets efficiently compared to `select`/`poll`?',
    practicalTips: 'Deleting a file merely unlinks its name from the directory; the Inode and disk blocks are only freed when hard link count reaches 0.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '19. DBMS Internals: ACID vs BASE & CAP Theorem',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'CAP Theorem: In a distributed data store, during a Network Partition (P), you MUST choose between Consistency (C: every read receives most recent write) or Availability (A: every request receives non-error response). PACELC Theorem. ACID (SQL) vs BASE (Basically Available, Soft state, Eventual consistency in NoSQL).',
    keyQuestions: '1. Explain the CAP Theorem and why "CA" is impossible in distributed networks subject to network partitions.\n2. What is Eventual Consistency and how do distributed databases achieve it using Vector Clocks and Read Repair?\n3. Compare CP systems (e.g. MongoDB, HBase, ZooKeeper) vs AP systems (e.g. Cassandra, DynamoDB, CouchDB).',
    practicalTips: 'Network partitions are inevitable in real-world distributed networks; therefore, the true choice is always CP vs AP during a partition.'
  },
  {
    category: 'CS_FUNDAMENTALS',
    name: '20. Scalability & System Design Fundamentals',
    priority: 'CRITICAL',
    confidence: 1,
    status: 'NOT_STARTED',
    phase: 'PHASE_2',
    notes: 'Vertical scaling (Scale Up) vs Horizontal scaling (Scale Out), Stateless application tiers, Database Read Replicas, Database Sharding (Horizontal Partitioning: Hash-based, Range-based), Consistent Hashing, Message Queues (Kafka, RabbitMQ for asynchronous decoupling & backpressure), Asynchronous worker processing.',
    keyQuestions: '1. How does Consistent Hashing minimize data redistribution when adding or removing database nodes in a cluster?\n2. What are the trade-offs between Message Queues (RabbitMQ - push/smart broker) and Event Streaming Platforms (Kafka - pull/dumb broker/smart consumer)?\n3. How do you design a URL Shortener (TinyURL) or Rate Limiter in a System Design interview?',
    practicalTips: 'Follow the 5-step System Design framework: 1. Scope requirements & scale estimations, 2. Define API contracts, 3. High-level diagram, 4. Deep-dive component bottlenecks, 5. Scalability, caching & failure handling.'
  }
];
