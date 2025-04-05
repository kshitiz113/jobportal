'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function QuizResultsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/quiz/results/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        setData(await res.json());
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!data) return <div className="p-8 text-white">Quiz not found</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">{data.quiz.title} Results</h1>
      <div className="space-y-4">
        {data.submissions.map(sub => (
          <div key={sub.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{sub.user_name}</h2>
              <span className="bg-blue-600 px-3 py-1 rounded-full">
                Score: {sub.score}/{sub.total_questions}
              </span>
            </div>
            <div className="mt-2 space-y-2">
              {sub.answers.map((ans, i) => (
                <div key={i} className={`p-2 rounded ${ans.is_correct ? 'bg-green-900' : 'bg-red-900'}`}>
                  <p><strong>Q:</strong> {ans.question_text}</p>
                  <p><strong>A:</strong> {ans.option_text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}