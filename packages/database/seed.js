const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      name: 'Teacher',
      username: 'teacher',
      password: 'password',
    },
  });

  const problems = [
    {
      title: '1. Two Sum',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n**Example:**\nInput: `nums = [2,7,11,15], target = 9`\nOutput: `[0,1]`',
      difficulty: 'EASY',
      boilerplate: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};',
    },
    {
      title: '2. Valid Palindrome',
      description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\n**Example:**\nInput: `s = "A man, a plan, a canal: Panama"`\nOutput: `true`',
      difficulty: 'EASY',
      boilerplate: 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        \n    }\n};',
    },
    {
      title: '3. Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with `O(1)` extra memory.\n\n**Example:**\nInput: `s = ["h","e","l","l","o"]`\nOutput: `["o","l","l","e","h"]`',
      difficulty: 'EASY',
      boilerplate: 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        \n    }\n};',
    },
    {
      title: '4. Fizz Buzz',
      description: 'Given an integer `n`, return a string array `answer` (1-indexed) where:\n\n* `answer[i] == "FizzBuzz"` if `i` is divisible by 3 and 5.\n* `answer[i] == "Fizz"` if `i` is divisible by 3.\n* `answer[i] == "Buzz"` if `i` is divisible by 5.\n* `answer[i] == i` (as a string) if none of the above conditions are true.\n\n**Example:**\nInput: `n = 3`\nOutput: `["1","2","Fizz"]`',
      difficulty: 'EASY',
      boilerplate: 'class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        \n    }\n};',
    },
    {
      title: '5. Valid Anagram',
      description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.\n\n**Example:**\nInput: `s = "anagram", t = "nagaram"`\nOutput: `true`',
      difficulty: 'EASY',
      boilerplate: 'class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};',
    },
    {
      title: '6. Maximum Subarray',
      description: 'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\n**Example:**\nInput: `nums = [-2,1,-3,4,-1,2,1,-5,4]`\nOutput: `6`\nExplanation: `[4,-1,2,1]` has the largest sum = 6.',
      difficulty: 'MEDIUM',
      boilerplate: 'class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};',
    },
    {
      title: '7. Climbing Stairs',
      description: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\n**Example:**\nInput: `n = 3`\nOutput: `3`\nExplanation: There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step',
      difficulty: 'EASY',
      boilerplate: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};',
    },
    {
      title: '8. Contains Duplicate',
      description: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.\n\n**Example:**\nInput: `nums = [1,2,3,1]`\nOutput: `true`',
      difficulty: 'EASY',
      boilerplate: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        \n    }\n};',
    },
    {
      title: '9. Missing Number',
      description: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.\n\n**Example:**\nInput: `nums = [3,0,1]`\nOutput: `2`',
      difficulty: 'EASY',
      boilerplate: 'class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        \n    }\n};',
    },
    {
      title: '10. Move Zeroes',
      description: 'Given an integer array `nums`, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements.\n\nNote that you must do this in-place without making a copy of the array.\n\n**Example:**\nInput: `nums = [0,1,0,3,12]`\nOutput: `[1,3,12,0,0]`',
      difficulty: 'EASY',
      boilerplate: 'class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        \n    }\n};',
    }
  ];

  for (const p of problems) {
    await prisma.problem.create({
      data: {
        ...p,
        authorId: teacher.id,
      }
    });
  }
  console.log('Seeded 10 problems successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
