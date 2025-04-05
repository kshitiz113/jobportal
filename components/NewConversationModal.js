// components/NewConversationModal.js
'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function NewConversationModal({ isOpen, onClose, userId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.users);
    } catch (error) {
      toast.error('Failed to search users');
    } finally {
      setIsLoading(false);
    }
  };

  const startConversation = async (recipientId) => {
    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, recipientId }),
      });
      
      if (!res.ok) throw new Error('Failed to start conversation');
      
      const data = await res.json();
      onClose(data.conversation); // Pass the new conversation back to parent
      toast.success('Conversation started!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">New Conversation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-md cursor-pointer"
                onClick={() => startConversation(user.id)}
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <button className="text-blue-500 hover:text-blue-400">
                  Message
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">
              {isLoading ? 'Searching...' : 'No users found'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}