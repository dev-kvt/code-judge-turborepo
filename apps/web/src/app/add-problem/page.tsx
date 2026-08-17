"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRole } from "@/providers/role-provider";
import toast from "react-hot-toast";

export default function AddProblem() {
  const router = useRouter();
  const { role } = useRole();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [boilerplate, setBoilerplate] = useState("");
  const [loading, setLoading] = useState(false);

  // If not a teacher, don't allow them to see the form
  if (role !== "TEACHER") {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-[#1a1a1a]">
        <div className="text-center bg-red-900/20 border border-red-500/50 p-8 rounded-lg">
          <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
          <p className="text-gray-300">You must be logged in as a Teacher to post assignments.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData to conform to the existing /api/problems POST handler
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("difficulty", difficulty);
      formData.append("boilerplate", boilerplate);

      // Create dummy driver code & test cases so the backend doesn't crash
      const driverCode = `
#include <iostream>
using namespace std;

int main() {
    cout << "Success" << endl;
    return 0;
}
`;
      const driverBlob = new Blob([driverCode], { type: "text/plain" });
      const inputBlob = new Blob(["dummy input"], { type: "text/plain" });
      const expectedOutputBlob = new Blob(["dummy output"], { type: "text/plain" });

      formData.append("driverCode", driverBlob, "driverCode.cpp");
      formData.append("inputFiles", inputBlob, "input.txt");
      formData.append("outputFiles", expectedOutputBlob, "expectedOutput.txt");
      
      // Pass the teacher email manually since we don't have real auth yet
      formData.append("authorEmail", "teacher@example.com");

      const response = await axios.post("/api/problems", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Assignment posted successfully!");
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data || "Failed to post assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#1a1a1a] text-gray-200 py-10 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Post New Assignment</h1>
          <p className="text-gray-400 mt-2">Publish a new coding problem for your students.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Assignment Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Merge Two Sorted Lists"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Difficulty Level</label>
              <select
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">Problem Description (Markdown)</label>
            <textarea
              required
              rows={8}
              placeholder="Describe the problem, input formats, and provide examples..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white font-mono text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">Boilerplate C++ Code</label>
            <textarea
              required
              rows={6}
              placeholder="class Solution {\npublic:\n    // Your code here\n};"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white font-mono text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
              value={boilerplate}
              onChange={(e) => setBoilerplate(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-teal-500/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Post Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}