'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        toast.error("Failed to load applications");
      }
    };

    fetchApplications();
  }, []);

  const handlePostQuiz = (jobId) => {
    router.push(`/quiz/create?jobId=${jobId}`);
  };

  const handleApplicationAction = async (applicationId, action) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error("Action failed");

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: action } : app
        )
      );

      // Show success notification
      if (action === "accepted") {
        toast.success("Applicant shortlisted! Notification sent.");
      } else {
        toast.success("Applicant notified of rejection.");
      }

    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Failed to update application status");
    }
  };

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📂 Job Applications</h2>
      </div>

      {applications.length === 0 ? (
        <p className="text-gray-400">No one has applied to your jobs yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-yellow-300">📌 {app.job_title}</h3>
                <p className="text-gray-400">{app.company}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePostQuiz(app.job_id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded-lg transition"
                >
                  Create Quiz
                </button>
                {app.quiz_id && (
                  <button
                    onClick={() => router.push(`/quiz/results/${app.quiz_id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-lg transition"
                  >
                    View Results
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-2 text-gray-300">
              <div className="mb-2">
                👤 <strong>Applicant:</strong> {app.applicant_name} ({app.applicant_email})
              </div>
              <div className="text-sm text-gray-400">
                Applied on: {new Date(app.applied_at).toLocaleDateString()}
              </div>
            </div>
            
            <div className="mt-3 flex gap-2">
              {app.resume_path && (
                <a
                  href={app.resume_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition"
                >
                  View Resume
                </a>
              )}
            </div>

            {/* Accept/Reject Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleApplicationAction(app.id, "accepted")}
                className={`px-4 py-2 rounded-lg transition ${
                  app.status === "accepted" 
                    ? "bg-green-700" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={app.status === "accepted"}
              >
                {app.status === "accepted" ? "Shortlisted ✓" : "Shortlist"}
              </button>
              <button
                onClick={() => handleApplicationAction(app.id, "rejected")}
                className={`px-4 py-2 rounded-lg transition ${
                  app.status === "rejected" 
                    ? "bg-red-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={app.status === "rejected"}
              >
                {app.status === "rejected" ? "Rejected ✗" : "Reject"}
              </button>
            </div>

            {/* Status Indicator */}
            {app.status && (
              <div className="mt-2 text-sm">
                Status: <span className={`font-medium ${
                  app.status === "accepted" ? "text-green-400" : "text-red-400"
                }`}>
                  {app.status === "accepted" 
                    ? "Shortlisted - Applicant notified" 
                    : "Rejected - Applicant notified"}
                </span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}