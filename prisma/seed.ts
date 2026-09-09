import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CareerOS database...');

  // 1. Clean existing records
  await prisma.workSession.deleteMany();
  await prisma.dailyReview.deleteMany();
  await prisma.dSAQuestion.deleteMany();
  await prisma.projectFeature.deleteMany();
  await prisma.project.deleteMany();
  await prisma.interviewTopic.deleteMany();
  await prisma.parkedIdea.deleteMany();
  await prisma.roadmapItem.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create primary user
  const user = await prisma.user.create({
    data: {
      id: 'usr_main_01',
      name: 'Abhay',
    },
  });

  console.log(`👤 Created user: ${user.name}`);

  // 3. Seed 80 Curated DSA Questions across the locked 9-Topic Sequence
  const dsaQuestionsData = [
    // --- 1. ARRAY (10 Questions) ---
    { number: 1, topic: 'Array', title: 'Two Sum', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/two-sum/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'HashMap complement lookup in single pass.', mistake: 'Checked for map.has before setting value.', dateSolved: new Date(Date.now() - 12 * 86400000) },
    { number: 2, topic: 'Array', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Track minimum price so far and compute profit at each element.', mistake: 'None.', dateSolved: new Date(Date.now() - 11 * 86400000) },
    { number: 3, topic: 'Array', title: 'Contains Duplicate', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/contains-duplicate/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Set length vs array length comparison.', mistake: 'None.', dateSolved: new Date(Date.now() - 10 * 86400000) },
    { number: 4, topic: 'Array', title: 'Product of Array Except Self', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/product-of-array-except-self/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Prefix products pass from left, postfix products pass from right.', mistake: 'Initial attempt used division which fails on multiple zeros.', dateSolved: new Date(Date.now() - 9 * 86400000) },
    { number: 5, topic: 'Array', title: 'Maximum Subarray (Kadane’s)', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/maximum-subarray/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Kadane algorithm: currentMax = Math.max(num, currentMax + num).', mistake: 'Resetting to 0 instead of considering negative single elements.', dateSolved: new Date(Date.now() - 8 * 86400000) },
    { number: 6, topic: 'Array', title: 'Maximum Product Subarray', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/maximum-product-subarray/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Maintain both max and min product because negative times negative is positive.', mistake: 'Forgot to swap max and min when encountering a negative number.', dateSolved: new Date(Date.now() - 7 * 86400000) },
    { number: 7, topic: 'Array', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Binary search comparing mid to right pointer.', mistake: 'Used right = mid - 1 which skipped the minimum element.', dateSolved: new Date(Date.now() - 6 * 86400000) },
    { number: 8, topic: 'Array', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Identify which half is strictly sorted, then check if target lies within bounds.', mistake: 'Forgot <= edge case when target matches boundary.', dateSolved: new Date(Date.now() - 5 * 86400000) },
    { number: 9, topic: 'Array', title: 'Merge Intervals', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/merge-intervals/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', approach: 'Sort by start time using nums.sort((a,b)=>a[0]-b[0]) then merge overlapping.', mistake: 'Forgot JS sort is alphabetical by default without comparator.', dateSolved: new Date(Date.now() - 4 * 86400000) },
    { number: 10, topic: 'Array', title: 'Non-overlapping Intervals', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/non-overlapping-intervals/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', approach: 'Greedy sort by end time; count removals when next interval start < prev end.', mistake: 'Sorted by start time instead of end time.', dateSolved: new Date(Date.now() - 3 * 86400000) },

    // --- 2. HASHMAP / HASHSET (9 Questions) ---
    { number: 11, topic: 'HashMap / HashSet', title: 'Valid Anagram', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/valid-anagram/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Frequency array of size 26 or Map.', mistake: 'None.', dateSolved: new Date(Date.now() - 3 * 86400000) },
    { number: 12, topic: 'HashMap / HashSet', title: 'Group Anagrams', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/group-anagrams/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N * K log K)', spaceComplexity: 'O(N * K)', approach: 'Sort string characters as map key or use frequency count tuple.', mistake: 'Mutated original array while grouping.', dateSolved: new Date(Date.now() - 3 * 86400000) },
    { number: 13, topic: 'HashMap / HashSet', title: 'Top K Frequent Elements', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/top-k-frequent-elements/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Bucket sort using array of frequencies.', mistake: 'Tried sorting keys in O(N log N) initially.', dateSolved: new Date(Date.now() - 2 * 86400000) },
    { number: 14, topic: 'HashMap / HashSet', title: 'Longest Consecutive Sequence', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Set lookup. Only start counting sequence if (num - 1) is NOT in set.', mistake: 'Checked every number without starting condition causing O(N^2) TLE.', dateSolved: new Date(Date.now() - 2 * 86400000) },
    { number: 15, topic: 'HashMap / HashSet', title: 'Encode and Decode Strings', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/encode-and-decode-strings/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Length-delimited prefix: len + "#" + word.', mistake: 'Used special character delimiter without escaping.', dateSolved: new Date(Date.now() - 2 * 86400000) },
    { number: 16, topic: 'HashMap / HashSet', title: 'First Unique Character in a String', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/first-unique-character-in-a-string/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: '2 passes: frequency count map, then find first char with count 1.', mistake: 'None.', dateSolved: new Date(Date.now() - 1 * 86400000) },
    { number: 17, topic: 'HashMap / HashSet', title: 'Subarray Sum Equals K', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Prefix sum hashmap tracking frequency of (sum - k).', mistake: 'Forgot map.set(0, 1) base case.', dateSolved: new Date(Date.now() - 1 * 86400000) },
    { number: 18, topic: 'HashMap / HashSet', title: 'Insert Delete GetRandom O(1)', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/insert-delete-getrandom-o1/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(1)', spaceComplexity: 'O(N)', approach: 'Combine Array for random index lookup with Map for value-to-index mapping. Swap with last element to delete in O(1).', mistake: 'Array.splice is O(N). Must swap with tail.', dateSolved: new Date(Date.now() - 1 * 86400000) },
    { number: 19, topic: 'HashMap / HashSet', title: 'Isomorphic Strings', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/isomorphic-strings/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Two directional mappings mapS->T and mapT->S.', mistake: 'Only mapped one direction which allowed duplicate targets.', dateSolved: new Date(Date.now() - 1 * 86400000) },

    // --- 3. TWO POINTER (8 Questions) ---
    { number: 20, topic: 'Two Pointer', title: 'Valid Palindrome', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/valid-palindrome/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Left and right pointers skipping non-alphanumeric chars.', mistake: 'Regex matching regex was slightly slow; pointer is cleaner.', dateSolved: new Date(Date.now() - 1 * 86400000) },
    { number: 21, topic: 'Two Pointer', title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Left at 0, Right at len-1. If sum > target, right--; else left++.', mistake: '1-indexed output requirement.', dateSolved: new Date(Date.now() - 1 * 86400000) },
    { number: 22, topic: 'Two Pointer', title: '3Sum', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/3sum/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N^2)', spaceComplexity: 'O(1)', approach: 'Sort array. Fix first element, then two-pointer for remaining two. Skip duplicates carefully.', mistake: 'Duplicate skipping logic missed right pointer advancement.', dateSolved: new Date(Date.now() - 1 * 86400000) },
    { number: 23, topic: 'Two Pointer', title: 'Container With Most Water', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/container-with-most-water/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Pointers at both ends. Always advance the shorter wall.', mistake: 'None.', dateSolved: new Date(Date.now() - 1 * 86400000) },
    { number: 24, topic: 'Two Pointer', title: 'Trapping Rain Water', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/trapping-rain-water/', status: 'SOLVED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Left and right pointers with maxLeft and maxRight boundaries.', mistake: 'Needed help understanding why min(maxL, maxR) guarantees correct water level.', dateSolved: new Date(Date.now() - 1 * 86400000) },
    { number: 25, topic: 'Two Pointer', title: '3Sum Closest', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/3sum-closest/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N^2)', spaceComplexity: 'O(1)', approach: 'Similar to 3Sum; track minimum absolute difference to target.', mistake: 'Initialized closest with 0 instead of Infinity/first sum.', dateSolved: new Date() },
    { number: 26, topic: 'Two Pointer', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Slow pointer tracks write index, fast pointer reads unique values.', mistake: 'None.', dateSolved: new Date() },
    { number: 27, topic: 'Two Pointer', title: 'Sort Colors (Dutch National Flag)', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/sort-colors/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Three pointers: low, mid, high. Swap 0s to low, 2s to high.', mistake: 'Did not advance mid pointer when swapping 0.', dateSolved: new Date() },

    // --- 4. SLIDING WINDOW (9 Questions - PRIORITY WEAKNESS) ---
    { number: 28, topic: 'Sliding Window', title: 'Maximum Average Subarray I', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/maximum-average-subarray-i/', status: 'SOLVED', solvedMyself: true, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Fixed window of size k. Subtract outgoing element, add incoming.', mistake: 'None.', dateSolved: new Date() },
    { number: 29, topic: 'Sliding Window', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', status: 'IN_PROGRESS', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(min(N, M))', approach: 'Dynamic window with Map tracking char last seen index. left = Math.max(left, map.get(char) + 1).', mistake: 'Forgot Math.max check which causes left pointer to jump backwards on duplicate outside window.', needsRevision: true, revisionNotes: 'Practice dynamic window shrinkage invariant.' },
    { number: 30, topic: 'Sliding Window', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Window valid if (windowLen - maxFreq) <= k. Shrink left when invalid.' },
    { number: 31, topic: 'Sliding Window', title: 'Permutation in String', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/permutation-in-string/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Fixed window of size s1.length with 26-char frequency match count.' },
    { number: 32, topic: 'Sliding Window', title: 'Minimum Size Subarray Sum', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/minimum-size-subarray-sum/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Expand right until sum >= target, then shrink left while valid to find min length.' },
    { number: 33, topic: 'Sliding Window', title: 'Minimum Window Substring', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/minimum-window-substring/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(M)', approach: 'Two maps (need and window). Expand right until have == needCount, shrink left to optimize.' },
    { number: 34, topic: 'Sliding Window', title: 'Sliding Window Maximum', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/sliding-window-maximum/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(K)', approach: 'Monotonic decreasing Deque storing indices.' },
    { number: 35, topic: 'Sliding Window', title: 'Find All Anagrams in a String', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Fixed window with match counter.' },
    { number: 36, topic: 'Sliding Window', title: 'Fruit Into Baskets', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/fruit-into-baskets/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Dynamic window maintaining at most 2 distinct elements in frequency map.' },

    // --- 5. BINARY SEARCH (8 Questions) ---
    { number: 37, topic: 'Binary Search', title: 'Binary Search', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/binary-search/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Standard mid = left + Math.floor((right - left) / 2).' },
    { number: 38, topic: 'Binary Search', title: 'Search Insert Position', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/search-insert-position/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Return left index when loop terminates.' },
    { number: 39, topic: 'Binary Search', title: 'Search a 2D Matrix', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/search-a-2d-matrix/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log(M*N))', spaceComplexity: 'O(1)', approach: 'Flatten 2D matrix into virtual 1D array: row = Math.floor(mid / cols), col = mid % cols.' },
    { number: 40, topic: 'Binary Search', title: 'Koko Eating Bananas', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/koko-eating-bananas/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N log(max(piles)))', spaceComplexity: 'O(1)', approach: 'Binary search on answer speed k from 1 to max(piles).' },
    { number: 41, topic: 'Binary Search', title: 'Find First and Last Position of Element in Sorted Array', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Two binary searches: one biasing left, one biasing right.' },
    { number: 42, topic: 'Binary Search', title: 'Find Peak Element', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/find-peak-element/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', approach: 'Compare mid with mid + 1 to navigate ascending slope.' },
    { number: 43, topic: 'Binary Search', title: 'Time Based Key-Value Store', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/time-based-key-value-store/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', approach: 'Map of key to array of { timestamp, val }; binary search on timestamp.' },
    { number: 44, topic: 'Binary Search', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(log(min(N, M)))', spaceComplexity: 'O(1)', approach: 'Binary search on partition point of smaller array.' },

    // --- 6. STACK (8 Questions) ---
    { number: 45, topic: 'Stack', title: 'Valid Parentheses', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/valid-parentheses/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Stack with hashmap of matching pairs.' },
    { number: 46, topic: 'Stack', title: 'Min Stack', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/min-stack/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(1)', spaceComplexity: 'O(N)', approach: 'Dual stack or stack of pairs [val, currentMin].' },
    { number: 47, topic: 'Stack', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Push numbers; on operator pop top 2 and apply operation (Math.trunc for division).' },
    { number: 48, topic: 'Stack', title: 'Daily Temperatures', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/daily-temperatures/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Monotonic decreasing stack storing indices.' },
    { number: 49, topic: 'Stack', title: 'Car Fleet', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/car-fleet/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', approach: 'Sort by starting position descending; compute arrival times; stack fleet reduction.' },
    { number: 50, topic: 'Stack', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Monotonic increasing stack of [index, height]; extend index backwards when popped.' },
    { number: 51, topic: 'Stack', title: 'Decode String', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/decode-string/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Dual stack for counts and string buffers.' },
    { number: 52, topic: 'Stack', title: 'Asteroid Collision', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/asteroid-collision/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Stack simulation; resolve collisions when top > 0 and incoming < 0.' },

    // --- 7. QUEUE (6 Questions) ---
    { number: 53, topic: 'Queue', title: 'Implement Stack using Queues', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/implement-stack-using-queues/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Rotate queue on push: queue.push(x) then rotate n-1 elements.' },
    { number: 54, topic: 'Queue', title: 'Number of Recent Calls', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/number-of-recent-calls/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(1)', spaceComplexity: 'O(W)', approach: 'Queue tracking timestamps; pop while front < t - 3000.' },
    { number: 55, topic: 'Queue', title: 'Design Circular Queue', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/design-circular-queue/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(1)', spaceComplexity: 'O(K)', approach: 'Fixed array with head, tail, and size pointers.' },
    { number: 56, topic: 'Queue', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'BFS queue. For each level, loop over current queue.length.' },
    { number: 57, topic: 'Queue', title: 'Rotting Oranges', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/rotting-oranges/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(M*N)', spaceComplexity: 'O(M*N)', approach: 'Multi-source BFS queue seeded with all initial rotten oranges.' },
    { number: 58, topic: 'Queue', title: '01 Matrix', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/01-matrix/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(M*N)', spaceComplexity: 'O(M*N)', approach: 'Multi-source BFS starting from all 0s outward to 1s.' },

    // --- 8. LINKED LIST (11 Questions) ---
    { number: 59, topic: 'Linked List', title: 'Reverse Linked List', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/reverse-linked-list/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Iterative 3-pointer: prev = null, curr = head, next.' },
    { number: 60, topic: 'Linked List', title: 'Merge Two Sorted Lists', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N+M)', spaceComplexity: 'O(1)', approach: 'Dummy head node. Compare l1.val and l2.val.' },
    { number: 61, topic: 'Linked List', title: 'Linked List Cycle', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/linked-list-cycle/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Floyd cycle detection: slow (1 step), fast (2 steps).' },
    { number: 62, topic: 'Linked List', title: 'Linked List Cycle II', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/linked-list-cycle-ii/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'After collision, reset slow to head. Advance both 1 step to meet at cycle entry.' },
    { number: 63, topic: 'Linked List', title: 'Reorder List', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/reorder-list/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: '1: Find middle, 2: Reverse second half, 3: Merge two halves.' },
    { number: 64, topic: 'Linked List', title: 'Remove Nth Node From End of List', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Dummy node. Advance fast pointer n steps ahead, then move both.' },
    { number: 65, topic: 'Linked List', title: 'Copy List with Random Pointer', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(N)', approach: 'Map of oldNode -> newNode or interweaving node clones.' },
    { number: 66, topic: 'Linked List', title: 'Add Two Numbers', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/add-two-numbers/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(max(N,M))', spaceComplexity: 'O(1)', approach: 'Dummy node, carry tracking loop while l1 || l2 || carry.' },
    { number: 67, topic: 'Linked List', title: 'Merge k Sorted Lists', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N log K)', spaceComplexity: 'O(1)', approach: 'Divide and conquer pairwise list merging.' },
    { number: 68, topic: 'Linked List', title: 'Reverse Nodes in k-Group', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Check if k nodes remain, reverse k nodes, splice back into list.' },
    { number: 69, topic: 'Linked List', title: 'Intersection of Two Linked Lists', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N+M)', spaceComplexity: 'O(1)', approach: 'Two pointers pA and pB. When reaching null, redirect to opposite list head.' },

    // --- 9. RECURSION & BACKTRACKING (11 Questions) ---
    { number: 70, topic: 'Recursion', title: 'Fibonacci Number', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/fibonacci-number/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Memoized recursion or bottom-up constant space DP.' },
    { number: 71, topic: 'Recursion', title: 'Climbing Stairs', difficulty: 'Easy', problemUrl: 'https://leetcode.com/problems/climbing-stairs/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N)', spaceComplexity: 'O(1)', approach: 'Base cases n=1 (1), n=2 (2). dp[i] = dp[i-1] + dp[i-2].' },
    { number: 72, topic: 'Recursion', title: 'Subsets', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/subsets/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N * 2^N)', spaceComplexity: 'O(N)', approach: 'Backtracking: include or exclude current element at index i.' },
    { number: 73, topic: 'Recursion', title: 'Combination Sum', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/combination-sum/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(2^T)', spaceComplexity: 'O(T)', approach: 'Backtracking allowing reuse of current candidate element.' },
    { number: 74, topic: 'Recursion', title: 'Permutations', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/permutations/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N! * N)', spaceComplexity: 'O(N)', approach: 'Backtracking with used array or element swapping.' },
    { number: 75, topic: 'Recursion', title: 'Subsets II', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/subsets-ii/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N * 2^N)', spaceComplexity: 'O(N)', approach: 'Sort array first. Skip duplicate candidate if nums[i] === nums[i-1] when i > startIndex.' },
    { number: 76, topic: 'Recursion', title: 'Word Search', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/word-search/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N * M * 4^L)', spaceComplexity: 'O(L)', approach: 'DFS grid traversal; mark visited cells in-place with temp char "#".' },
    { number: 77, topic: 'Recursion', title: 'Palindrome Partitioning', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/palindrome-partitioning/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N * 2^N)', spaceComplexity: 'O(N)', approach: 'Backtracking: if substring(start, i) is palindrome, recurse on remainder.' },
    { number: 78, topic: 'Recursion', title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(4^N)', spaceComplexity: 'O(N)', approach: 'Digit-to-char mapping backtrack recursion.' },
    { number: 79, topic: 'Recursion', title: 'Generate Parentheses', difficulty: 'Medium', problemUrl: 'https://leetcode.com/problems/generate-parentheses/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(4^N / sqrt(N))', spaceComplexity: 'O(N)', approach: 'Add open if open < n; add close if close < open.' },
    { number: 80, topic: 'Recursion', title: 'N-Queens', difficulty: 'Hard', problemUrl: 'https://leetcode.com/problems/n-queens/', status: 'NOT_STARTED', solvedMyself: false, timeComplexity: 'O(N!)', spaceComplexity: 'O(N)', approach: 'Row by row backtracking with sets for cols, positive diagonals (r+c), and negative diagonals (r-c).' },
  ];

  for (const q of dsaQuestionsData) {
    await prisma.dSAQuestion.create({
      data: {
        userId: user.id,
        ...q,
      },
    });
  }

  console.log(`✅ Seeded ${dsaQuestionsData.length} DSA questions across 9 locked topics.`);

  // 4. Seed Project A: GridOps — 25-Step MVP Completion Tracker
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'GridOps: Utility Operations & Grievance Platform',
      description: 'Production-grade utility operations platform with employee grievance lifecycle, SLA deadline tracking, role-based forwarding, and accountability analytics.',
      status: 'IN_PROGRESS',
      isFlagship: true,
      githubUrl: 'https://github.com/abhay/grievance-management-system',
    },
  });

  const gridOpsMvpSteps = [
    // Phase 1 — Product & UI Foundation
    { category: 'PHASE_1', name: '1. Write the MVP scope: Login + Dashboard + Grievance Management + Analytics', description: 'Define minimal viable product boundaries: core authentication, high-level operational dashboard, grievance lifecycle, and summary statistics.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Draft MVP scope specification and module boundary constraints.', technicalNotes: 'The grievance data model and simple status workflow come directly from your original concept.', isMvp: true },
    { category: 'PHASE_1', name: '2. Define user roles: Admin / Supervisor / Officer', description: 'Define role-based permission matrix across Admin (system/users), Supervisor (assign/escalations), and Officer (field investigation/resolution).', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Model RBAC enum and middleware route guards.', technicalNotes: 'Role enum: ADMIN, SUPERVISOR, OFFICER with granular permissions.', isMvp: true },
    { category: 'PHASE_1', name: '3. Define grievance fields: ID, subject, category, consumer, location, dates, deadline, status, owner, priority, description', description: 'Model full schema attributes: Grievance ID, subject, category, consumer name/phone, location, dates, statutory SLA deadline, status, owner, priority, description.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Draft PostgreSQL schema fields and Zod validation rules.', technicalNotes: 'PostgreSQL indexed columns on status, ownerId, and deadline.', isMvp: true },
    { category: 'PHASE_1', name: '4. Define status workflow: Received → Assigned → In Progress → Forwarded → Resolved → Closed', description: 'Define linear status state machine and valid transition rules from Received to Closed.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Map allowed status transitions in state machine validator.', technicalNotes: 'Status workflow: Received → Assigned → In Progress → Forwarded → Resolved → Closed.', isMvp: true },
    { category: 'PHASE_1', name: '5. Design the main screens: Login, Dashboard, Grievance List, Create Grievance, Grievance Details', description: 'Wireframe and design the 5 core user screens: Login, Executive Dashboard, Grievance Table List, Create Grievance Form, and Grievance Details view.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Create UI component wireframes and responsive layouts.', technicalNotes: 'Tailwind CSS + Lucide icons + responsive layouts.', isMvp: true },

    // Phase 2 — Backend & Database
    { category: 'PHASE_2', name: '6. Create backend project using Node.js + Express + TypeScript', description: 'Initialize Node.js + Express + TypeScript project structure with modular architecture and error handling middleware.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Set up Express app, tsconfig.json, and module directory structure.', technicalNotes: 'Your proposed architecture specifically recommends a modular monolith using React/TypeScript → Express → Prisma → PostgreSQL, rather than microservices.', isMvp: true },
    { category: 'PHASE_2', name: '7. Configure PostgreSQL + Prisma', description: 'Set up PostgreSQL connection string in .env and initialize Prisma client ORM configuration.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Configure DATABASE_URL and initialize prisma/schema.prisma.', technicalNotes: 'Prisma client singleton with connection pooling.', isMvp: true },
    { category: 'PHASE_2', name: '8. Design core database tables: User, Role, Office, Grievance, GrievanceHistory, Attachment, Category, Status', description: 'Design relational tables with foreign keys: User, Role, Office, Grievance, GrievanceHistory, Attachment, Category, Status.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Write Prisma schema models with relational constraints and cascade rules.', technicalNotes: 'Include GrievanceHistory model for audit trail timestamps and actor tracking.', isMvp: true },
    { category: 'PHASE_2', name: '9. Create Prisma schema and run first migration', description: 'Execute prisma migrate dev --name init to generate PostgreSQL migration and compile Prisma Client.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Run initial Prisma migration and verify table generation.', technicalNotes: 'Ensure foreign key relations and indexes are applied in PostgreSQL.', isMvp: true },
    { category: 'PHASE_2', name: '10. Create seed data: users, roles, categories, statuses and 10–20 sample grievances', description: 'Seed script generating Admin, Supervisor, Officer users, office hierarchies, category types, and 10–20 realistic sample grievances.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Write prisma/seed.ts with sample utility grievance records.', technicalNotes: 'Include overdue, due today, and pending records to test dashboard metrics.', isMvp: true },

    // Phase 3 — Authentication
    { category: 'PHASE_3', name: '11. Create login API', description: 'Build POST /api/auth/login endpoint accepting email/username and password credentials with validation.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement login route handler and credential verification.', technicalNotes: 'Express handler with Zod request body validation.', isMvp: true },
    { category: 'PHASE_3', name: '12. Implement password hashing + JWT authentication', description: 'Secure password verification with bcrypt and issue signed JWT access tokens with user payload.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement bcrypt.compare and JWT token sign / verify utilities.', technicalNotes: 'Store JWT secret in environment variable with expiration time.', isMvp: true },
    { category: 'PHASE_3', name: '13. Create frontend login page and connect it to API', description: 'Build responsive React login form with loading spinners, error banners, and authentication context.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build LoginForm component and link to api.login().', technicalNotes: 'React state for email/password and redirect upon successful auth.', isMvp: true },
    { category: 'PHASE_3', name: '14. Protect dashboard/grievance routes and implement logout', description: 'Implement ProtectedRoute wrapper, auth token persistence in localStorage/cookies, and logout session clearing.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement React Router ProtectedRoute guard and logout button.', technicalNotes: 'Milestone: You can log in → reach dashboard → refresh page → remain authenticated.', isMvp: true },

    // Phase 4 — Grievance Core
    { category: 'PHASE_4', name: '15. Build Create Grievance API + form', description: 'Build POST /api/grievances endpoint with auto-generated registration ID (e.g., GR-1001) and dynamic React form UI.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement Grievance creation controller and multipart file attachment upload.', technicalNotes: 'This is the heart of the product: create, view, assign, forward and update grievances.', isMvp: true },
    { category: 'PHASE_4', name: '16. Build Grievance List API + table UI', description: 'Build GET /api/grievances with search, category filtering, status tabs, and responsive data table UI.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build GrievanceTable component with search filter and pagination.', technicalNotes: 'Prisma query with where filters for category, status, and owner.', isMvp: true },
    { category: 'PHASE_4', name: '17. Build Grievance Details page', description: 'Build full grievance detail view showing metadata, timeline, complainant details, attachments, and current owner.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Design GrievanceDetail view with action toolbar and history sidebar.', technicalNotes: 'Fetch grievance by ID with include: { history: true, attachments: true }.', isMvp: true },
    { category: 'PHASE_4', name: '18. Implement Assign / Change Owner', description: 'Enable supervisors to assign or transfer grievance ownership to specific junior engineers / officers.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement PUT /api/grievances/:id/assign endpoint and owner selector dropdown.', technicalNotes: 'Prisma transaction: update currentOwnerId + insert GrievanceHistory log.', isMvp: true },
    { category: 'PHASE_4', name: '19. Implement Update Status', description: 'Allow assigned officers to transition grievance status (e.g., Assigned -> In Progress -> Resolved).', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement PUT /api/grievances/:id/status endpoint with status selection modal.', technicalNotes: 'Validate allowed status transition in state machine before persisting.', isMvp: true },
    { category: 'PHASE_4', name: '20. Implement Forward Grievance with receiving officer + note', description: 'Forwarding engine enabling officers to route grievance to another office/officer with mandatory note.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build Forward Grievance modal dialog with receiving officer picker and forwarding remarks.', technicalNotes: 'Atomic transaction recording forwarding reason in GrievanceHistory.', isMvp: true },

    // Phase 5 — Accountability & Dashboard
    { category: 'PHASE_5', name: '21. Implement Grievance History — record every important action', description: 'Immutable timeline auditing every creation, assignment, forwarding, note, and status update with actor and timestamp.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build GrievanceTimeline component rendering chronological history events.', technicalNotes: 'GrievanceHistory query ordered by timestamp ascending.', isMvp: true },
    { category: 'PHASE_5', name: '22. Add deadline calculation and Pending / Due Today / Overdue logic', description: 'Backend logic computing statutory SLA countdown: > 3 days (Normal), 1-3 days (Due Soon), 0 days (Due Today), < 0 days (Overdue).', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Implement date calculation utility for SLA breach detection and badge color coding.', technicalNotes: 'Compare deadline with new Date() and assign urgency level.', isMvp: true },
    { category: 'PHASE_5', name: '23. Build Dashboard cards: Total / Pending / Due Today / Overdue / Resolved', description: 'High-impact KPI summary cards displaying live counts for Total, Pending, Due Today, Overdue, and Resolved grievances.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build DashboardMetricCards component connected to /api/dashboard/stats.', technicalNotes: 'Single Prisma aggregation query for rapid dashboard load.', isMvp: true },
    { category: 'PHASE_5', name: '24. Build Attention Required table: grievance + owner + deadline + status', description: 'Prominent dashboard table highlighting high-priority overdue and due-today items requiring immediate supervisor escalation.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Build AttentionRequiredTable component with direct 1-click action buttons.', technicalNotes: 'Prisma query where status != "RESOLVED" and deadline <= today + 2 days.', isMvp: true },
    { category: 'PHASE_5', name: '25. End-to-end test + responsive UI + error/loading states + deploy MVP', description: 'Comprehensive end-to-end testing, mobile responsiveness polish, empty/error state handling, and production MVP deployment.', status: 'PLANNED', priority: 'HIGH', progress: 0, nextAction: 'Run complete regression tests and deploy production build.', technicalNotes: 'Build verification with npm run build and cross-device testing.', isMvp: true },

    // Future Ideas (Post-MVP)
    { category: 'FUTURE', name: 'GIS Survey & Field Mapping (Post-MVP)', description: 'MapLibre/Turf.js map interface to pinpoint poles, measure distance, and generate route surveys.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'MapLibre + OpenStreetMap + Turf.js integration.', isMvp: false },
    { category: 'FUTURE', name: 'Meter Challenge Management (Post-MVP)', description: 'Meter dispute workflow tracking testing dates, laboratory reports, and statutory SLA limits.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'Follows same core workflow architecture.', isMvp: false },
    { category: 'FUTURE', name: 'Work Orders & Field Maintenance (Post-MVP)', description: 'Work orders for transformer maintenance, pole replacement, and line repairs.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'Operational task management engine.', isMvp: false },
    { category: 'FUTURE', name: 'AI Operations Assistant & Summarizer (Post-MVP)', description: 'LLM-powered daily operations attention summaries and grievance history brief generator.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Post-MVP roadmap feature', technicalNotes: 'LLM synthesis layer over structured grievance events.', isMvp: false },
  ];

  for (const step of gridOpsMvpSteps) {
    await prisma.projectFeature.create({
      data: {
        projectId: project.id,
        ...step,
      },
    });
  }

  console.log(`✅ Seeded flagship project: ${project.name} with ${gridOpsMvpSteps.length} items (25 MVP Steps + Post-MVP modules).`);

  // 5. Seed Full Stack Interview Preparation Topics (170 Curated Topics across 10 Categories)
  const { INTERVIEW_TOPICS_CATALOG } = await import('../server/seedInterviewData.js');
  for (const t of INTERVIEW_TOPICS_CATALOG) {
    await prisma.interviewTopic.create({
      data: {
        userId: user.id,
        category: t.category,
        name: t.name,
        status: t.status,
        confidence: t.confidence,
        priority: t.priority,
        phase: t.phase,
        notes: t.notes || '',
        keyQuestions: t.keyQuestions || '',
        practicalTips: t.practicalTips || '',
      },
    });
  }

  console.log(`✅ Seeded all ${INTERVIEW_TOPICS_CATALOG.length} Interview Topics across 10 categories.`);

  // 6. Seed Parked Ideas (Parking Lot Garage)
  const parkedIdeasData = [
    { title: 'Explore Hono framework on Cloudflare Workers for ultra-low latency Grievance API', category: 'TECH_STACK', notes: 'Check edge computing benefits during free time; keep current Node/Express focus active.', status: 'PARKED' },
    { title: 'Learn Rust for high-throughput meter data processing', category: 'COURSE', notes: 'Parked! Do not switch stacks mid-sprint. Master TypeScript/Node first.', status: 'PARKED' },
    { title: 'Build automated PDF export template with React-PDF for Grievance audit', category: 'PROJECT_IDEA', notes: 'Valid post-MVP feature. Review during Sunday triage.', status: 'PARKED' },
  ];

  for (const pi of parkedIdeasData) {
    await prisma.parkedIdea.create({
      data: {
        userId: user.id,
        ...pi,
      },
    });
  }

  console.log(`✅ Seeded ${parkedIdeasData.length} Parked Ideas in Parking Lot.`);

  // 7. Initial Work Sessions & Daily Reviews: Clean Day 1 Start (0 streak, 0 sessions)
  console.log(`✅ Initialized clean Day 1 state (0 logged sessions, 0 streak).`);

  // 8. Seed Roadmap Items
  const roadmapItems = [
    { phase: 'PHASE_1', name: 'Master 80 DSA Questions across 9 Locked Topics', category: 'DSA', priority: 'PRIMARY', status: 'ACTIVE', notes: 'Currently on Topic 4: Sliding Window.' },
    { phase: 'PHASE_1', name: 'Ship Core Workflows of Employee Grievance Management System', category: 'PROJECT', priority: 'PRIMARY', status: 'ACTIVE', notes: 'Core forward flow, pending duration index, SLA countdown.' },
    { phase: 'PHASE_1', name: 'Full Stack Tech Readiness (JS, TS, React, Node, Postgres, Prisma)', category: 'INTERVIEW', priority: 'PRIMARY', status: 'ACTIVE', notes: 'Daily revision of critical concepts.' },
    { phase: 'PHASE_2', name: 'Computer Science Fundamentals (OS, DBMS, Networks)', category: 'CS_CORE', priority: 'UPCOMING', status: 'QUEUED', notes: 'Scheduled for next month. Do not disrupt Phase 1.' },
    { phase: 'PHASE_2', name: 'High-Level System Design & Mock Interviews', category: 'INTERVIEW', priority: 'UPCOMING', status: 'QUEUED', notes: 'Scheduled for next month.' },
  ];

  for (const ri of roadmapItems) {
    await prisma.roadmapItem.create({
      data: {
        userId: user.id,
        ...ri,
      },
    });
  }

  console.log(`✅ Seeded ${roadmapItems.length} Roadmap items.`);
  console.log('🎉 CareerOS Seed Complete! Database is fully initialized.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
