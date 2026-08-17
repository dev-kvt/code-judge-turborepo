import { getDifficultyColor } from "@/constants";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import Link from "next/link";
const columns = [
  { id: "status", label: "Status" },
  { id: "acceptance", label: "Acceptance" },
  { id: "title", label: "Title" },
  { id: "difficulty", label: "Difficulty" },
  { id: "action", label: "" },
];

type ProblemListItem = {
  id: string;
  status: string;
  title: string;
  acceptance: string;
  difficulty: string;
};

import { prisma } from "@kpmg/database";

const fetchProblemList = async () => {
  try {
    const problemsData = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        acceptanceRate: true,
        totalSubmissions: true,
      },
      take: 20,
      skip: 0,
    });

    const problems: ProblemListItem[] = [];

    const promises = problemsData.map(async (problem) => {
      const submissions = await prisma.submission.findMany({
        where: { problemId: problem.id },
      });
      const totalSubmissions = submissions.length;
      const acceptedSubmissions = submissions.filter(
        (submission) => submission.status === "AC"
      ).length;
      const acceptanceRate = totalSubmissions === 0 ? 0 : (acceptedSubmissions / totalSubmissions) * 100;

      problems.push({
        id: problem.id,
        status: "AC", // Mock status for now
        title: problem.title,
        acceptance: acceptanceRate > 0 ? acceptanceRate.toFixed(0) + "%" : "-",
        difficulty: problem.difficulty,
      });
    });

    await Promise.all(promises);
    return problems;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const ProblemsList = async () => {
  const problems = await fetchProblemList();
  return (
    <div className="flex flex-col w-full px-3">
      <div className="">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-x-hidden">
            <table className="table-fixed overflow-y-scroll lg:table-auto min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={column.id}
                      className={`lg:px-6 py-3 ${
                        index === columns.length - 1
                          ? "text-center"
                          : "text-left"
                      } ${
                        ["acceptance", "status"].includes(column.id)
                          ? "hidden lg:table-cell"
                          : ""
                      } ${
                        column.id == "title" ? "w-[70%]" : "w-auto"
                      } text-base font-medium text-gray-500 dark:text-gray-200`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {problems.map((problem) => (
                  <tr
                    key={problem.id}
                    className="odd:bg-neutral-900 text-gray-200"
                  >
                    <td className="hidden lg:table-cell px-6 py-4 text-base">
                      {problem.status === "AC" ? (
                        <CheckCircleIcon className="text-green-500 h-6 w-6" />
                      ) : (
                        <></>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 text-left text-base">
                      {problem.acceptance}
                    </td>

                    <td className="w-[70%] lg:w-auto hide-multi-line px-2 lg:px-6 py-4 hover:cursor-pointer hover:text-blue-700 text-base">
                      <Link href={`/problem/${problem.id}`}>
                        {problem.title.length > 50
                          ? problem.title.slice(0, 47) + "..."
                          : problem.title}
                      </Link>
                    </td>
                    <td
                      className={`px-6 py-4 text-center text-base first-letter:capitalize`}
                      style={{
                        color: getDifficultyColor(
                          problem.difficulty.toLowerCase()
                        ),
                      }}
                    >
                      {problem.difficulty.toLowerCase()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/problem/${problem.id}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded text-sm transition-colors">
                          Solve Challenge
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsList;