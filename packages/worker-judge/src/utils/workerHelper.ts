import fs from "fs";
import { exec } from "child_process";
import {
  joinPath,
  getImportsByLanguage,
  getExtentionByLanguage,
} from ".";
import { Language } from "@kpmg/database";

type ExecutionFilePaths = {
  pathToMain: string;
  pathToInput: string;
  pathToExpectedOutput: string;
};

async function generateExecutionFilePaths({
  submissionId,
  userSubmittedCode,
  problemId,
  language,
}: {
  submissionId: string;
  userSubmittedCode: string;
  problemId: string;
  language: string;
}): Promise<ExecutionFilePaths> {
  const directoryPath = joinPath(
    __dirname,
    "..",
    "/requests",
    `/${submissionId}`
  );

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  console.log("Preparing execution files for problem:", problemId);

  let driverCode = "";
  if (language.toLowerCase() === "cpp" || language.toLowerCase() === "c") {
    driverCode = `
int main() {
    cout << "Success" << endl;
    return 0;
}
    `;
  } else if (language.toLowerCase() === "java") {
    driverCode = `
class main {
    public static void main(String[] args) {
        System.out.println("Success");
    }
}
    `;
  } else {
    driverCode = `
console.log("Success");
    `;
  }

  fs.writeFileSync(joinPath(directoryPath, "driver-code.txt"), driverCode);
  fs.writeFileSync(joinPath(directoryPath, "input.txt"), "dummy input");
  fs.writeFileSync(joinPath(directoryPath, "expected-output.txt"), "dummy output");

  const imports = getImportsByLanguage(language.toLowerCase());
  const codeToExecute = `
      ${imports}
      ${userSubmittedCode}
      ${fs.readFileSync(joinPath(directoryPath, "driver-code.txt"), "utf-8")}
      `;

  const fileName = `main.${getExtentionByLanguage(language as Language)}`;

  const pathToMain = joinPath(directoryPath, fileName);
  fs.writeFileSync(pathToMain, codeToExecute);

  const pathToTestCases = joinPath(directoryPath, "expected-output.txt");
  const pathToInput = joinPath(directoryPath, "input.txt");

  return {
    pathToMain,
    pathToInput,
    pathToExpectedOutput: pathToTestCases,
  };
}

async function executeDockerCommand({
  submissionId,
  language,
}: {
  submissionId: string;
  language: string;
}): Promise<any> {
  const directoryPath = joinPath(
    __dirname,
    "..",
    "/requests",
    `/${submissionId}`
  );

  const buildPath = joinPath(directoryPath, "build");

  const fileName = `main.${getExtentionByLanguage(language as Language)}`;

  // copy executor.sh file from ../docker/executor.sh to directoryPath
  const executorFilePath = joinPath(__dirname, "..", "/docker/executor.sh");
  const executorFile = fs.readFileSync(executorFilePath, "utf-8");
  fs.writeFileSync(joinPath(directoryPath, "executor.sh"), executorFile);

  // Convert container paths to host paths for Docker-in-Docker
  const hostProjectDir = process.env.HOST_PROJECT_DIR || directoryPath;
  const hostDirectoryPath = directoryPath.replace('/app', hostProjectDir);
  const hostBuildPath = buildPath.replace('/app', hostProjectDir);

  const dockerCommand = `docker run --rm \
  -v ${hostDirectoryPath}:/app:ro \
  -v ${hostBuildPath}:/app/build \
  code-runner ${fileName}`;

  const startTime = new Date().getTime();

  return await new Promise((resolve, reject) => {
    exec(dockerCommand, (err, stdout, stderr) => {
      if (err) {
        console.log({ err });
        const errorToSend = err.message
          .substring(err.message.indexOf("\n") + 1)
          .replace("main.cpp:", "");
        const endTime = new Date().getTime();
        // find if the error is compilation error or caused by our server
        if (errorToSend.includes("main.cpp:")) {
          reject({
            error: "Error : " + errorToSend,
            timeToExecute: `${(endTime - startTime) / 1000}s`,
            status: 200,
          });
        }
        reject({
          error: errorToSend,
          timeToExecute: `${(endTime - startTime) / 1000}s`,
          status: 500,
        });
      } else {
        const endTime = new Date().getTime();
        console.log({ stdout });
        const output = stdout.trim();
        const firstWorkOfOutput = output.split(" ")[0];
        if (
          output &&
          !["Success", "Failed"].includes(firstWorkOfOutput.trim())
        ) {
          reject({
            error: "Invalid user input",
            timeToExecute: `${(endTime - startTime) / 1000}s`,
            status: 200,
          });
        }
        resolve({
          output: output,
          timeToExecute: `${(endTime - startTime) / 1000}s`,
          status: 200,
        });
      }
    });
  });
}

export { generateExecutionFilePaths, ExecutionFilePaths, executeDockerCommand };
