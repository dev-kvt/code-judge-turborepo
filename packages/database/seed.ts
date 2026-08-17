import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const problem = await prisma.problem.create({
    data: {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
      difficulty: 'EASY',
      boilerplate: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};',
    },
  });
  console.log('Created problem:', problem);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
