'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function TakeQuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${id}`);
        if (!res.ok) throw new Error('Failed to fetch quiz');
        const data = await res.json();
        setQuiz(data.quiz);
        
        // Initialize answers object
        const initialAnswers = {};
        data.quiz.questions.forEach(question => {
          initialAnswers[question.id] = null;
        });
        setAnswers(initialAnswers);
      } catch (error) {
        toast.error(error.message);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, router]);

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Validate all questions are answered
      const unanswered = Object.values(answers).some(a => a === null);
      if (unanswered) {
        throw new Error('Please answer all questions');
      }

      const res = await fetch(`/api/quiz/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error('Submission failed');
      
      const result = await res.json();
      toast.success(`Quiz submitted! Score: ${result.score}/${result.totalQuestions}`);
      router.push('/dashboard/job-seeker');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Loading Quiz...</h1>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        {quiz.description && <p className="text-gray-400 mb-6">{quiz.description}</p>}

        <div className="space-y-6">
          {quiz.questions.map((question) => (
            <div key={question.id} className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">{question.text}</h2>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div 
                    key={option.id} 
                    className={`p-3 rounded cursor-pointer ${answers[question.id] === option.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    onClick={() => handleAnswerSelect(question.id, option.id)}
                  >
                    {option.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
}