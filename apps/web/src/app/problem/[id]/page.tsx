import { prisma } from "@kpmg/database";
import ProblemSubmittionScreen from "@/components/problem/screen";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return <div>{"No problem id provided."}</div>;

  const problem = await prisma.problem.findUnique({
    where: {
      id: id,
    },
  });
  // find submissions for this problem and calculate acceptance rate and total submissions
  const submissions = await prisma.submission.findMany({
    where: {
      problemId: id as string,
    },
  });
  const totalSubmissions = submissions.length;
  const acceptedSubmissions = submissions.filter(
    (submission) => submission.status === "AC"
  ).length;
  const acceptanceRate = totalSubmissions === 0 ? 0 : (acceptedSubmissions / totalSubmissions) * 100;
  
  if (!problem) return <div>{"Problem not found."}</div>;

  return (
    <ProblemSubmittionScreen
      problem={{
        id: problem.id,
        description: problem.description,
        boilerplate: problem.boilerplate,
        header: {
          title: problem.title,
          difficulty: problem.difficulty,
          acceptanceRate: parseFloat(acceptanceRate.toFixed(2)),
          totalSubmissions: totalSubmissions,
        },
      }}
    />
  );
}
