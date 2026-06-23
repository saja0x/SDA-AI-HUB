
 
import React from 'react';
import RecommenderChat from '../components/RecommenderChat.jsx';
 
function ChatbotPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
        background: "var(--void)",
        minHeight: "calc(100vh - 70px)",
      }}
    >
      <RecommenderChat />
    </div>
  );
}
 
export default ChatbotPage;