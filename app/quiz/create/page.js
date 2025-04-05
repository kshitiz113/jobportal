'use client';
import QuizCreateForm from '@/components/QuizCreateForm';
import { useSearchParams } from 'next/navigation';

export default function QuizCreatePage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <QuizCreateForm jobId={jobId} />
    </div>
  );
}