export default function Sidebar() {
    return (
      <div className="w-1/4 bg-gray-800 h-screen p-6">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <ul>
          <li className="mb-3"><a href="/profile">Profile</a></li>
          <li className="mb-3"><a href="/chat">Chat</a></li>
          <li className="mb-3"><a href="/notifications">Notifications</a></li>
          <li className="mb-3"><a href="/wishlist">Wishlist</a></li>
          <li className="mb-3"><a href="/settings">Settings</a></li>
        </ul>
      </div>
    );
  }
  