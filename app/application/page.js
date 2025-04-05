'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/applications");
        if (!res.ok) throw new Error("Failed to fetch applications");
        
        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        toast.error("Failed to load applications");
      } finally {
        setIsLoading(false);
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

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: action } : app
        )
      );

      toast.success(action === "accepted" 
        ? "Applicant shortlisted! Notification sent." 
        : "Applicant notified of rejection."
      );

    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Failed to update application status");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-white flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 text-white max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            📂 Job Applications
          </h2>
          <p className="text-gray-400 mt-1">
            Manage all applications for your posted jobs
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-medium text-gray-300 mb-2">
            No applications yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Your posted jobs haven't received any applications yet. Check back later or share your job posts.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div 
              key={`${app.id}-${app.status}`} // Unique key with status to force re-render on status change
              className="bg-gray-800/70 hover:bg-gray-800/90 p-5 rounded-xl shadow-lg border border-gray-700 transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg md:text-xl font-semibold text-white">
                      {app.job_title}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                      {app.company}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300 mb-3">
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                        👤
                      </span>
                      <div>
                        <p className="font-medium">{app.applicant_name}</p>
                        <p className="text-sm text-gray-400">{app.applicant_email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Applied on {formatDate(app.applied_at)}
                    </span>
                  </div>
                  
                  {app.resume_path && (
                    <a
                      href={app.resume_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Resume
                    </a>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePostQuiz(app.job_id)}
                      className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded-lg transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Quiz
                    </button>
                    {app.quiz_id && (
                      <button
                        onClick={() => router.push(`/quiz/results/${app.quiz_id}`)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View Results
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={() => handleApplicationAction(app.id, "accepted")}
                      className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg transition ${
                        app.status === "accepted" 
                          ? "bg-green-700 cursor-default" 
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      disabled={app.status === "accepted"}
                    >
                      {app.status === "accepted" ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Shortlisted
                        </>
                      ) : (
                        "Shortlist"
                      )}
                    </button>
                    <button
                      onClick={() => handleApplicationAction(app.id, "rejected")}
                      className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg transition ${
                        app.status === "rejected" 
                          ? "bg-red-700 cursor-default" 
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                      disabled={app.status === "rejected"}
                    >
                      {app.status === "rejected" ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Rejected
                        </>
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {app.status && (
                <div className={`mt-3 text-sm px-3 py-2 rounded-md ${
                  app.status === "accepted" 
                    ? "bg-green-900/30 text-green-400" 
                    : "bg-red-900/30 text-red-400"
                }`}>
                  <span className="font-medium">
                    {app.status === "accepted" 
                      ? "✓ Shortlisted - Applicant has been notified" 
                      : "✗ Rejected - Applicant has been notified"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}