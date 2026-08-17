"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRole } from "@/providers/role-provider";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

type Doubt = {
  id: string;
  title: string;
  content: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  aiDraftAnswer: string | null;
  finalAnswer: string | null;
  createdAt: string;
  user: { name: string; email: string };
};

export default function DoubtBoard() {
  const { role } = useRole();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/doubts?role=${role}`);
      setDoubts(res.data);
    } catch (err) {
      toast.error("Failed to fetch doubts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [role]);

  const handlePostDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/doubts", {
        title,
        content,
        // Since we don't have real auth yet, just use a dummy email that we seeded
        email: "teacher@example.com",
      });
      toast.success("Doubt posted! Waiting for teacher review.");
      setShowForm(false);
      setTitle("");
      setContent("");
      fetchDoubts();
    } catch (err) {
      toast.error("Failed to post doubt");
    }
  };

  const handleReview = async (id: string, newStatus: string, finalAnswer: string) => {
    try {
      await axios.put(`/api/doubts/${id}/review`, {
        status: newStatus,
        finalAnswer,
      });
      toast.success(`Doubt ${newStatus.toLowerCase()} successfully`);
      fetchDoubts();
    } catch (err) {
      toast.error("Failed to update doubt");
    }
  };

  if (loading) {
    return <div className="text-gray-400 animate-pulse">Loading doubts...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {role === "STUDENT" && (
        <div className="mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            {showForm ? "Cancel" : "Post a Doubt"}
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handlePostDoubt} className="bg-neutral-800 p-6 rounded-lg mb-6 shadow-md border border-neutral-700">
          <h2 className="text-xl font-bold mb-4 text-white">Ask a Question</h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 mb-4 text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Describe your doubt in detail..."
            className="w-full h-32 bg-neutral-900 border border-neutral-700 rounded p-2 mb-4 text-white"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded">
            Submit
          </button>
        </form>
      )}

      {doubts.length === 0 ? (
        <p className="text-gray-400">No doubts found.</p>
      ) : (
        doubts.map((doubt) => (
          <DoubtCard key={doubt.id} doubt={doubt} role={role} onReview={handleReview} />
        ))
      )}
    </div>
  );
}

function DoubtCard({ doubt, role, onReview }: { doubt: Doubt; role: string; onReview: any }) {
  const [editAnswer, setEditAnswer] = useState(doubt.aiDraftAnswer || "");

  return (
    <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{doubt.title}</h3>
          <p className="text-sm text-gray-400 mt-1">Asked by {doubt.user.name}</p>
        </div>
        <div>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${
              doubt.status === "APPROVED"
                ? "bg-green-900 text-green-300"
                : doubt.status === "PENDING_REVIEW"
                ? "bg-yellow-900 text-yellow-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {doubt.status.replace("_", " ")}
          </span>
        </div>
      </div>
      <p className="text-gray-200 mb-6">{doubt.content}</p>

      {/* Teacher Review Mode */}
      {role === "TEACHER" && doubt.status === "PENDING_REVIEW" ? (
        <div className="bg-neutral-800 p-4 rounded border border-neutral-700 mt-4">
          <h4 className="text-teal-400 font-semibold mb-2">AI Draft Answer (Needs Review):</h4>
          <textarea
            className="w-full h-32 bg-neutral-900 border border-neutral-700 rounded p-2 mb-4 text-gray-300 text-sm"
            value={editAnswer}
            onChange={(e) => setEditAnswer(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              onClick={() => onReview(doubt.id, "APPROVED", editAnswer)}
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
            >
              Approve & Publish
            </button>
            <button
              onClick={() => onReview(doubt.id, "REJECTED", editAnswer)}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
            >
              Reject
            </button>
          </div>
        </div>
      ) : doubt.status === "APPROVED" ? (
        <div className="bg-neutral-800 p-4 rounded border border-teal-900 mt-4">
          <h4 className="text-teal-400 font-semibold mb-2">Answer:</h4>
          <div className="text-sm space-y-2 text-gray-300 [&>h4]:text-teal-300 [&>h4]:font-bold [&>h4]:mt-4 [&>h4]:mb-1 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 [&>p>strong]:text-teal-200">
            <ReactMarkdown>{doubt.finalAnswer || ""}</ReactMarkdown>
          </div>
        </div>
      ) : null}
    </div>
  );
}
