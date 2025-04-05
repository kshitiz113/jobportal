'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizCreateForm({ jobId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: [{ text: '', isCorrect: false }] }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: [{ text: '', isCorrect: false }] }]);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) return;
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    if (questions[qIndex].options.length <= 1) return;
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleCorrectChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].isCorrect = !newQuestions[qIndex].options[oIndex].isCorrect;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate at least one correct option per question
      for (const question of questions) {
        if (!question.options.some(opt => opt.isCorrect)) {
          throw new Error('Each question must have at least one correct option');
        }
      }

      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          questions,
          jobId: jobId || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create quiz');
      }

      const data = await response.json();
      router.push(`/quiz/results/${data.quizId}`);
    } catch (err) {
      setError(err.message);
      console.error('Error creating quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-white">Create New Quiz</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            required
            placeholder="Enter quiz title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            rows="3"
            placeholder="Enter quiz description (optional)"
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Add Question
            </button>
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="p-4 bg-gray-700 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Question {qIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 hover:text-red-400"
                  disabled={questions.length <= 1}
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Question Text</label>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  className="w-full p-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                  required
                  placeholder="Enter question text"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-300">Options</h4>
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="text-sm bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                  >
                    Add Option
                  </button>
                </div>

                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={() => handleCorrectChange(qIndex, oIndex)}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="flex-1 p-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                      placeholder="Option text"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="text-red-500 hover:text-red-400 px-2"
                      disabled={question.options.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Quiz...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}