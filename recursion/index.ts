// Factorial of n, n = 5, 5*4*3*2*1

const factorial = (n: number): number => {
  if (n === 0) return 1;
  return n * factorial(n - 1);
};
// console.log("factorial(5)", factorial(5));

// Create an array with start=1, end=5 => [1,2,3,4,5]

const rangeOfNumber = (start: number, end: number): number[] => {
  if (start > end) {
    return [];
  } else {
    const numbers = rangeOfNumber(start, end - 1);
    numbers.push(end);
    return numbers;
  }
};
// console.log(rangeOfNumber(1, 5));

// Fibonacci number
// Fibonacci Series => 0, 1, 1, 2, 3, 5, 8, 13...
// F(0) = 0. F(1) = 1
// F(n) = F(n-1) + F(n-2), for n > 1

const fibonacciFor = (n: number) => {
  const arr = [0, 1];

  for (let i = 2; i <= n; i++) {
    arr.push(arr[i - 2] + arr[i - 1]);
  }

  return arr[n];
};
// console.log(fibonacciFor(7));

const fibonacciRecursion = (n: number): number => {
  if (n <= 1) return n;
  return fibonacciRecursion(n - 1) + fibonacciRecursion(n - 2);
};
// console.log(fibonacciRecursion(15));

// Reverse a string
// Input: hello => olleh

const reverseAString = (str: string): string => {
  if (str.length === 0) return "";
  const lastChar = str.slice(str.length - 1);
  return lastChar + reverseAString(str.slice(0, str.length - 1));
};
// console.log(reverseAString("hello"));

// Subsets (Backtracking algorithm using recursion)
// [1, 2, 3] => [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
// [0]       => [[], [0]]

const subsets = (nums: number[]): Array<Array<number>> => {
  const res: Array<Array<number>> = [];
  const temp: number[] = [];

  const recursive = (nums: number[], i: number) => {
    if (i === nums.length) {
      return res.push([...temp]);
    }
    temp.push(nums[i]);
    recursive(nums, i + 1);
    temp.pop();
    recursive(nums, i + 1);
  };

  recursive(nums, 0);

  return res;
};

console.log(subsets([1, 2]));
