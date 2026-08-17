import { executeDockerCommand, generateExecutionFilePaths } from "./utils";
import { Status, prisma } from "@kpmg/database";
import { generateAICodeReview } from "./ai-grader";

export const processQueue = async () => {
  await new Promise<void>(async (resolve) => {
    try {
      const submission = await prisma.submission.findFirst({
        where: { status: "PENDING" },
      });

      if (!submission) {
        setTimeout(resolve, 5000);
      } else {
        const timeout = setTimeout(() => {
          resolve();
        }, 30 * 1000);
        await processResponse(submission);
        clearTimeout(timeout);
        resolve();
      }
    } catch (e) {
      console.log(`ERROR: while polling queue`, e);
      setTimeout(resolve, 5000);
    }
  });
};

const processResponse = async (submission: any) => {
  try {
    const submissionId = submission.id;

    // Mark as running so another worker doesn't pick it up
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: "WA" }, // Temporary state while grading to avoid re-polling
    });

    await generateExecutionFilePaths({
      submissionId: submission.id,
      userSubmittedCode: submission.code,
      problemId: submission.problemId,
      language: submission.language,
    });

    try {
      const res = await executeDockerCommand({
        submissionId: submissionId,
        language: submission.language,
      });

      const finalStatus = res.output === "Success" ? Status.AC : Status.WA;

      // Execute real LangChain qualitative review with prompt injection defense
      const aiFeedback = await generateAICodeReview({
        code: submission.code,
        language: submission.language,
        status: finalStatus,
        output: res.output || "Success",
      });

      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: finalStatus,
          output: res.output,
          time: res.timeToExecute || "0.1s",
          aiFeedback: aiFeedback,
        },
      });
    } catch (e: any) {
      console.log(`ERROR: while executing Docker or grading submission : ${submissionId}`, e);
      
      const errorMsg = e?.error || e?.message || "Execution or compilation error occurred.";
      const errTime = e?.timeToExecute || "0.0s";

      // Generate AI debugging assistance even on compilation/execution errors!
      const errorAiFeedback = await generateAICodeReview({
        code: submission.code,
        language: submission.language,
        status: "CE/WA",
        output: `Error: ${errorMsg}`,
      });

      // Always update database so UI never hangs in empty state
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: Status.WA,
          output: `Error:\n\n${errorMsg}`,
          time: errTime,
          aiFeedback: errorAiFeedback,
        },
      });
    }
  } catch (e) {
    console.log(`ERROR: while processing queue`);
    console.log(e);
  }
};

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
});

