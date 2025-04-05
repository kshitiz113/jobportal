'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import NewConversationModal from './NewConversationModal';

export default function ChatList({ userId, onSelectChat }) {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/chat/conversations');
      if (!res.ok) throw new Error('Failed to fetch conversations');
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 10000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const handleNewConversation = (newConversation) => {
    setConversations(prev => [newConversation, ...prev]);
    onSelectChat(newConversation.userId);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden h-full">
      <div className="p-4 border-b border-gray-700 bg-gray-900 flex justify-between items-center">
        <h3 className="font-semibold">Conversations</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          New
        </button>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-60px)]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <p className="text-gray-400 mb-4">No conversations yet</p>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              onClick={() => setIsModalOpen(true)}
            >
              Start a new conversation
            </button>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.userId}
              className="p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
              onClick={() => onSelectChat(conv.userId)}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{conv.name}</p>
                {conv.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 truncate">
                {conv.lastMessage?.content || 'No messages yet'}
              </p>
            </div>
          ))
        )}
      </div>
      
      <NewConversationModal
        isOpen={isModalOpen}
        onClose={(conv) => {
          setIsModalOpen(false);
          if (conv) handleNewConversation(conv);
        }}
        userId={userId}
      />
    </div>
  );
}