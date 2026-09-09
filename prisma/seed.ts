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

  // 4. Seed Project A: Employee Grievance Management System
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Employee Grievance Management System',
      description: 'Production-grade enterprise grievance lifecycle platform with role-based document routing, GIS geolocation tracking, audio records, and automated deadline tracking.',
      status: 'IN_PROGRESS',
      isFlagship: true,
      githubUrl: 'https://github.com/abhay/grievance-management-system',
    },
  });

  const grievanceFeatures = [
    // Core Workflow (MVP Priority)
    { category: 'CORE', name: 'Grievance Creation & Dynamic Form', description: 'End-to-end creation flow with categorized grievance types, complainant details, and attachment uploads.', status: 'COMPLETE', priority: 'HIGH', progress: 100, nextAction: 'Add client validation tests', technicalNotes: 'Form validation with Zod and multipart file storage.', isMvp: true },
    { category: 'CORE', name: 'Origin & Inward Registration Tracking', description: 'Origin tracking (portal, phone, letter DAK) with auto-generated registration serial numbering.', status: 'COMPLETE', priority: 'HIGH', progress: 100, nextAction: 'None (completed)', technicalNotes: 'Prisma autoincrement sequence with fiscal year prefix.', isMvp: true },
    { category: 'CORE', name: 'Forwarding Workflow & Role-Based Ownership', description: 'Forwarding engine to assign grievance between sections, transfer ownership, and preserve forwarding audit history.', status: 'DEVELOPMENT', priority: 'HIGH', progress: 65, nextAction: 'Implement grievance forwarding API endpoint with audit history logging', technicalNotes: 'Requires Prisma transaction for ownership transfer + AuditLog insert.', isMvp: true },
    { category: 'CORE', name: 'Pending With & Current Owner Resolution', description: 'Real-time dashboard filter showing pending items per officer and pending duration.', status: 'DEVELOPMENT', priority: 'HIGH', progress: 50, nextAction: 'Build pending duration counter in React UI', technicalNotes: 'Computed index on pendingSince timestamp.', isMvp: true },
    { category: 'CORE', name: 'DAK & Official Document Handling', description: 'Physical letter upload, scan PDF viewer, and note-sheet attachment timeline.', status: 'PLANNED', priority: 'HIGH', progress: 20, nextAction: 'Design PDF attachment preview component', technicalNotes: 'S3-compatible bucket or local blob store.', isMvp: true },
    { category: 'CORE', name: 'Status & Statutory Deadline Tracking', description: 'SLA countdown timer (e.g., 15-day resolution statutory limit) with color-coded warning chips.', status: 'PLANNED', priority: 'HIGH', progress: 30, nextAction: 'Create SLA breach calculation utility in server', technicalNotes: 'Date-fns differenceInBusinessDays helper.', isMvp: true },
    { category: 'CORE', name: 'Delayed Work & Attention Flagging', description: 'Automated flagging of overdue grievances with priority escalation indicators.', status: 'PLANNED', priority: 'HIGH', progress: 10, nextAction: 'Draft delayed grievance query cron/endpoint', technicalNotes: 'Indexed query where status != RESOLVED and deadline < NOW.', isMvp: true },

    // GIS Module
    { category: 'GIS', name: 'GIS Survey & Distance Measurement', description: 'Map interface to pinpoint pole/substation geolocation and compute real-world route distances.', status: 'PLANNED', priority: 'MEDIUM', progress: 15, nextAction: 'Integrate Leaflet / Mapbox GL React wrapper', technicalNotes: 'Haversine formula for distance calculation.', isMvp: true },
    { category: 'GIS', name: 'Geolocation Mockup Drawing', description: 'Draw lines and polygons on live map overlay for site verification mockups.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Review Leaflet Draw plugin', technicalNotes: 'GeoJSON polygon storage in Postgres.', isMvp: true },

    // Reports Module
    { category: 'REPORTS', name: 'Labour Audio Recording & Upload', description: 'Direct audio voice memo recorder in browser for field worker statements.', status: 'PLANNED', priority: 'MEDIUM', progress: 10, nextAction: 'Build MediaRecorder audio capture React hook', technicalNotes: 'Web Audio API with WAV/MP3 conversion.', isMvp: true },
    { category: 'REPORTS', name: 'Speech-to-Text & Local Language Translation', description: 'Transcribe audio memos into text and translate Bengali/Hindi to English summary.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Test Whisper API / Gemini audio transcription', technicalNotes: 'Async worker queue for audio transcription.', isMvp: true },

    // Meter Module
    { category: 'METER', name: 'Upcoming Bill Cycle Tracking', description: 'Track consumer billing cycle anomalies related to meter tampering or faulty readings.', status: 'PLANNED', priority: 'MEDIUM', progress: 25, nextAction: 'Model MeterReading schema in Prisma', technicalNotes: 'Consumer ID foreign key relation.', isMvp: true },
    { category: 'METER', name: 'Meter Replacement Reminder Engine', description: 'Notification trigger when defective meter replacement SLA exceeds 7 business days.', status: 'PLANNED', priority: 'MEDIUM', progress: 0, nextAction: 'Link meter replacement status to grievance ID', technicalNotes: 'Event hook on grievance creation.', isMvp: true },

    // Future Ideas (Post-MVP)
    { category: 'FUTURE', name: 'AI Assistance & Auto-Categorization', description: 'LLM agent to automatically suggest grievance category and forward target based on text description.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Keep in future phase (post-MVP)', technicalNotes: 'Gemini tool calling integration.', isMvp: false },
    { category: 'FUTURE', name: 'Automated SMS / WhatsApp Notification Webhooks', description: 'Send automated status updates to complainant on grievance status changes.', status: 'IDEA', priority: 'LOW', progress: 0, nextAction: 'Keep in future phase (post-MVP)', technicalNotes: 'Twilio / WhatsApp Business API.', isMvp: false },
  ];

  for (const f of grievanceFeatures) {
    await prisma.projectFeature.create({
      data: {
        projectId: project.id,
        ...f,
      },
    });
  }

  console.log(`✅ Seeded project: ${project.name} with ${grievanceFeatures.length} features.`);

  // 5. Seed Full Stack Interview Preparation Topics
  const interviewTopicsData = [
    // Frontend
    { category: 'FRONTEND', name: 'JavaScript (Event Loop, Closures, Prototypes, Async)', status: 'PRACTICED', confidence: 4, priority: 'CRITICAL', phase: 'PHASE_1', notes: 'Event loop phases (microtask Promise vs macrotask timers). Lexical scope closures and memory leak prevention.', keyQuestions: '1. What is the output of Promise.resolve().then(() => console.log(1)); setTimeout(() => console.log(2), 0)?\n2. How does JS prototype inheritance work under the hood?\n3. Explain debounce vs throttle with implementation.', practicalTips: 'Always remember Array.sort((a,b)=>a-b) numeric sort rule!' },
    { category: 'FRONTEND', name: 'TypeScript (Generics, Type Narrowing, Utility Types)', status: 'LEARNING', confidence: 3, priority: 'HIGH', phase: 'PHASE_1', notes: 'Master keyof, typeof, Record, Partial, Omit, and discriminated unions.', keyQuestions: '1. Difference between type and interface in TS?\n2. How do you implement a strictly typed API response wrapper with Generics?', practicalTips: 'Use discriminated unions for state management.' },
    { category: 'FRONTEND', name: 'React (Hooks, Fiber, State Colocation, Optimization)', status: 'PRACTICED', confidence: 4, priority: 'CRITICAL', phase: 'PHASE_1', notes: 'React 18 automatic batching, Fiber reconciliation tree, state colocation to prevent unnecessary re-renders before useMemo.', keyQuestions: '1. How does React determine when to re-render a component?\n2. When should you NOT use useMemo/useCallback?\n3. How do you build a custom hook for window resize/debounce?', practicalTips: 'Colocate state to eliminate 90% of re-renders!' },
    { category: 'FRONTEND', name: 'Redux Toolkit & Global State Management', status: 'LEARNING', confidence: 3, priority: 'MEDIUM', phase: 'PHASE_1', notes: 'createSlice, createAsyncThunk, Immer immutability under the hood.', keyQuestions: '1. How does RTK simplify traditional Redux boilerplate?\n2. Context API vs Redux: when to choose which?', practicalTips: 'Keep server cache in React Query / RTK Query, UI state local.' },
    { category: 'FRONTEND', name: 'Tailwind CSS & Responsive Layout Architecture', status: 'INTERVIEW_READY', confidence: 5, priority: 'MEDIUM', phase: 'PHASE_1', notes: 'Utility-first CSS, mobile-first breakpoints, dark mode class strategy.', keyQuestions: '1. How does Tailwind JIT compiler work?\n2. Best practices for avoiding bloated JSX class strings (clsx / tailwind-merge).', practicalTips: 'Use cn() utility for conditional classes.' },

    // Backend
    { category: 'BACKEND', name: 'Node.js (Streams, Clusters, Event Emitters, Concurrency)', status: 'LEARNING', confidence: 3, priority: 'CRITICAL', phase: 'PHASE_1', notes: 'Single-threaded event loop with libuv thread pool for async I/O. Buffer and Stream piping.', keyQuestions: '1. How does Node.js handle thousands of concurrent connections on a single thread?\n2. What causes event loop starvation and how do you prevent it?\n3. Difference between process.nextTick and setImmediate?', practicalTips: 'Never run heavy CPU sync loops in request handlers.' },
    { category: 'BACKEND', name: 'Express.js (Middleware Pipeline, Error Boundaries)', status: 'PRACTICED', confidence: 4, priority: 'HIGH', phase: 'PHASE_1', notes: 'Middleware chaining (req, res, next), global centralized error middleware.', keyQuestions: '1. How does Express middleware chaining work internally?\n2. How do you structure async route handlers to avoid unhandled promise rejections?', practicalTips: 'Always provide next(err) or use express-async-errors.' },
    { category: 'BACKEND', name: 'PostgreSQL & Relational Database Design', status: 'LEARNING', confidence: 3, priority: 'CRITICAL', phase: 'PHASE_1', notes: 'B-Tree indexing, composite indexes, foreign key cascades, ACID transaction isolation levels.', keyQuestions: '1. Explain Index Scan vs Sequential Scan in EXPLAIN ANALYZE.\n2. How do you prevent SQL injection and connection pool exhaustion?\n3. Normalization (1NF, 2NF, 3NF) with real-world schema design.', practicalTips: 'Always index foreign keys and query search columns!' },
    { category: 'BACKEND', name: 'Prisma ORM & Transaction Boundaries', status: 'PRACTICED', confidence: 4, priority: 'HIGH', phase: 'PHASE_1', notes: 'Schema modeling, relational relations, interactive transactions ($transaction), and generated type-safety.', keyQuestions: '1. How does Prisma prevent N+1 query problems?\n2. How do you perform atomic multi-record updates in Prisma?', practicalTips: 'Use prisma.$transaction([ ... ]) for atomic consistency.' },
    { category: 'BACKEND', name: 'Authentication, JWT Refresh-Token Rotation & RBAC', status: 'LEARNING', confidence: 3, priority: 'CRITICAL', phase: 'PHASE_1', notes: 'Access tokens in memory, refresh tokens in HTTP-only cookies, token family revocation upon token replay attacks.', keyQuestions: '1. How do you implement secure refresh-token rotation with replay detection?\n2. Where should JWTs be stored in client applications and why?\n3. How to design Role-Based Access Control (RBAC) middleware?', practicalTips: 'Token family replay detection invalidates all tokens immediately.' },

    // Phase 2 (Next Month - CS Fundamentals)
    { category: 'CS_FUNDAMENTALS', name: 'Operating Systems (Processes, Threads, Concurrency, Virtual Memory)', status: 'NOT_STARTED', confidence: 2, priority: 'HIGH', phase: 'PHASE_2', notes: 'Scheduled for Phase 2 (Next Month). Focus on processes vs threads, mutex/semaphores, virtual memory paging, and deadlock conditions.', keyQuestions: '1. Process vs Thread memory layout.\n2. What is a Deadlock and what are the 4 Coffman conditions?', practicalTips: 'Phase 2 priority (next month).' },
    { category: 'CS_FUNDAMENTALS', name: 'Computer Networks (TCP/IP, HTTP 1.1/2/3, DNS, SSL/TLS Handshake)', status: 'NOT_STARTED', confidence: 2, priority: 'HIGH', phase: 'PHASE_2', notes: 'Scheduled for Phase 2 (Next Month). 3-way TCP handshake, TLS 1.3 handshake, HTTP/2 multiplexing, DNS resolution chain.', keyQuestions: '1. What happens when you type google.com in your browser?\n2. TCP vs UDP difference and trade-offs.\n3. How does HTTPS symmetric vs asymmetric encryption work?', practicalTips: 'Phase 2 priority (next month).' },
  ];

  for (const t of interviewTopicsData) {
    await prisma.interviewTopic.create({
      data: {
        userId: user.id,
        ...t,
      },
    });
  }

  console.log(`✅ Seeded ${interviewTopicsData.length} Interview Topics.`);

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
