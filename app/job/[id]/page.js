"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function JobDetails() {
  const params = useParams();
  const id = params?.id;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetails(id);
    }
  }, [id]);

  async function fetchJobDetails(id) {
    try {
      setLoading(true);
      const res = await fetch(`/api/job/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Job not found");

      const data = await res.json();
      setJob(data.job);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setResumeName(file.name);
    }
  };

  async function handleApply() {
    if (!resume) {
      setMessage("Please upload a resume before applying.");
      setIsSuccess(false);
      return;
    }

    setApplying(true);
    setMessage("");

    const formData = new FormData();
    formData.append("jobId", id);
    formData.append("jobTitle", job.title);
    formData.append("companyName", job.company);
    formData.append("resume", resume);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Application submitted successfully!");
        setIsSuccess(true);
      } else {
        setMessage(result.error || "Failed to apply. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Error submitting application. Please try again.");
      setIsSuccess(false);
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : job ? (
        <div className="max-w-4xl mx-auto">
          {/* Job Header */}
          <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center text-blue-400 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex items-center text-gray-300 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="bg-blue-900/30 px-4 py-2 rounded-lg border border-blue-700">
                <p className="text-lg font-semibold text-blue-300">
                  {job.salary}
                </p>
                <p className="text-sm text-blue-200">Salary</p>
              </div>
            </div>

            {/* Job Description */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3 text-white">
                Job Description
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-line text-gray-300">
                  {job.description}
                </p>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-white">
              Apply for this Position
            </h2>
            
            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Resume (PDF, DOC, DOCX)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-400">
                      {resumeName || "Click to select file"}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {resumeName && (
                  <button
                    onClick={() => {
                      setResume(null);
                      setResumeName("");
                    }}
                    className="p-2 text-red-400 hover:text-red-300 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleApply}
              disabled={applying || !resume}
              className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                applying
                  ? "bg-blue-700 cursor-not-allowed"
                  : resume
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              {applying ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Submit Application"
              )}
            </button>

            {/* Status Message */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  isSuccess
                    ? "bg-green-900/30 border border-green-800 text-green-200"
                    : "bg-red-900/30 border border-red-800 text-red-200"
                }`}
              >
                <div className="flex items-center">
                  {isSuccess ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span>{message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-lg">Job not found</span>
          </div>
          <p className="mt-4 text-gray-400">
            The job you're looking for doesn't exist or may have been removed.
          </p>
        </div>
      )}
    </div>
  );
}