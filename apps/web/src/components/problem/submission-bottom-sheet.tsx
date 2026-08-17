"use client";
import ProcessingSpinner from "../utils/processing_spinner";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

const fetchStatusLongPoll = async ({
  submissionId,
  setSubmissionOutput,
  setAiFeedback,
  setLoading,
}: {
  submissionId: string | null;
  setSubmissionOutput: (output: string) => void;
  setAiFeedback: (feedback: string) => void;
  setLoading: (loading: boolean) => void;
}) => {
  const url = `/api/submission-status?id=${submissionId}`;
  if (!submissionId) return;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json();
  // Keep polling if status is PENDING or if the worker set a temporary status (like WA) but hasn't finalized the output yet.
  if (data.status === "PENDING" || !data.output) {
    setTimeout(() => {
      fetchStatusLongPoll({ submissionId, setSubmissionOutput, setAiFeedback, setLoading });
    }, 2000);
  } else {
    setLoading(false);
    setSubmissionOutput(data.output);
    setAiFeedback(data.aiFeedback || "");
  }
};

export default function SubmissionBottomSheet({
  open,
  setOpen,
  loading,
  setLoading,
  output,
  setSubmissionOutput,
  aiFeedback,
  setAiFeedback,
  submissionId,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  output: string;
  setSubmissionOutput: (o: string) => void;
  aiFeedback: string;
  setAiFeedback: (f: string) => void;
  submissionId: string;
}) {
  useEffect(() => {
    if (submissionId) {
      setAiFeedback("");
      setSubmissionOutput("");
      fetchStatusLongPoll({
        submissionId,
        setSubmissionOutput,
        setAiFeedback,
        setLoading,
      });
    }
  }, [submissionId]);

  return (
    <>
      {open && (
        <div
          style={{
            backgroundColor: "rgb(48 47 47)",
            borderRadius: "1rem 1rem 0 0",
          }}
          className="h-96 absolute w-[calc(85%)] sm:w-[calc(91%)] p-3 z-20 bottom-0 lg:h-[calc(100vh-64px)]  lg:w-[calc(99%)] lg:px-0 "
        >
          <SubmitSheetHeader setOpen={setOpen} />
          <div className="p-5 h-full overflow-y-auto pb-20">
            {loading ? (
              <ProcessingSpinner />
            ) : (
              <div className="flex flex-col gap-4">
                <div className="bg-neutral-800 p-4 rounded text-gray-300">
                  <h3 className="text-teal-400 font-semibold mb-2">Execution Output</h3>
                  <pre className="whitespace-pre-wrap">{output}</pre>
                </div>
                {aiFeedback && (
                  <div className="bg-neutral-800 p-4 rounded text-gray-300 border border-teal-900 shadow-[0_0_15px_rgba(45,212,191,0.15)]">
                    <h3 className="text-teal-400 font-semibold mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      AI Code Review
                    </h3>
                    <div className="text-sm space-y-2 [&>h3]:text-teal-300 [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-1 [&>h4]:text-teal-300 [&>h4]:font-bold [&>h4]:mt-4 [&>h4]:mb-1 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 [&>p>strong]:text-teal-200">
                      <ReactMarkdown>
                        {aiFeedback
                          .replace("AI Code Review:", "")
                          .replace(/^(#+)([^#\s])/gm, "$1 $2")
                          .trim()}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function SubmitSheetHeader({ setOpen }: { setOpen: (o: boolean) => void }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 1rem",
        height: "3rem",
        marginTop: "1rem",
      }}
    >
      <h2>Output Window</h2>
      <button onClick={() => setOpen(false)}>Close</button>
    </div>
  );
}
