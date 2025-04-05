// app/chat/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatList from '@/components/ChatList';
import Chat from '@/components/Chat';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function ChatPage() {
    const router = useRouter();
    const [selectedChat, setSelectedChat] = useState(null);
    const [userId, setUserId] = useState(null);
    const [hasConversations, setHasConversations] = useState(false);
  
    useEffect(() => {
      const fetchUserId = async () => {
        const res = await fetch('/api/user/id');
        if (res.ok) {
          const data = await res.json();
          setUserId(data.userId);
        } else {
          toast.error('Failed to load user data');
        }
      };
      fetchUserId();
    }, []);
  
    if (!userId) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-gray-300 text-lg font-medium">Loading your messages...</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar with gradient border */}
        <div className="w-80 min-w-[20rem] border-r border-gray-800 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent opacity-20 pointer-events-none"></div>
          <div className="p-4 border-b border-gray-800">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Messages
            </h1>
          </div>
          <ChatList 
            userId={userId} 
            onSelectChat={setSelectedChat}
            onHasConversations={setHasConversations}
          />
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-gray-900/50 relative overflow-hidden">
          {selectedChat ? (
            <Chat userId={userId} recipientId={selectedChat} />
          ) : (
            <div className="flex flex-col justify-center items-center h-full p-8 text-center">
              <div className="max-w-md">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-200 mb-2">
                  {hasConversations ? "Select a conversation" : "No conversations yet"}
                </h2>
                <p className="text-gray-400 mb-6">
                  {hasConversations 
                    ? "Choose a chat from the sidebar to continue your conversation" 
                    : "Start a new conversation by searching for users"}
                </p>
                {!hasConversations && (
                  <button 
                    onClick={() => router.push('/search')}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg"
                  >
                    Find People
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')]"></div>
          </div>
        </div>
      </div>
    );
}