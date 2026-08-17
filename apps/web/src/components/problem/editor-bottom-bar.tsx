"use client";
import axios from "axios";
import { Language } from "@kpmg/database";
import toast from "react-hot-toast";

async function submitCode({
  code,
  problemId,
  language,
}: {
  code: string;
  problemId: string;
  language: Language;
}) {
  const url = "/api/submit";
  const response = await axios({
    url,
    method: "POST",
    data: {
      code,
      problemId,
      language,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export default function EditorBottomBar({
  solutionClassCode,
  problemId,
  language,
  setOpen,
  setIsLoading,
  setSubmissionId,
}: {
  solutionClassCode: string;
  problemId: string;
  language: Language;
  setOpen: (o: boolean) => void;
  setIsLoading: (l: boolean) => void;
  setSubmissionId: (id: string) => void;
}) {
  return (
    <div
      className="flex px-5 py-2 z-10 lg:fixed lg:bottom-0 bg-neutral-800 justify-end text-sm"
      style={{
        width: "inherit",
      }}
    >
      <button
        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-[3px] px-2 sm:py-[6px] sm:px-4  rounded inline-flex items-center"
        onClick={() => {
          setOpen(true);
          setIsLoading(true);
          submitCode({
            code: solutionClassCode,
            problemId,
            language,
          })
            .then((data) => {
              setSubmissionId(data.id);
            })
            .catch((err: any) => {
              setIsLoading(false);
              setOpen(false);
              if (err.response?.status === 401) {
                return toast.error("Please login to submit the code");
              }
              const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed";
              toast.error(`Submission failed: ${errMsg}`);
            });
        }}
      >
        Compile and Run
      </button>
      <span style={{ width: "20px" }}></span>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-[3px] px-2 sm:py-[6px] sm:px-4 rounded"
        onClick={() => {
          setOpen(true);
          setIsLoading(true);
          submitCode({
            code: solutionClassCode,
            problemId,
            language,
          })
            .then((data) => {
              setSubmissionId(data.id);
            })
            .catch((err: any) => {
              setIsLoading(false);
              setOpen(false);
              const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed";
              toast.error(`Submission failed: ${errMsg}`);
            });
        }}
      >
        Submit
      </button>
    </div>
  );
}
