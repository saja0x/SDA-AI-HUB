{/*صفحة الشات بوت للتوصية بالموديل */}
 
import React from 'react';
import RecommenderChat from '../components/RecommenderChat.jsx';
 
// تغيير: قبل كذا هذي الصفحة كانت ترجع <RecommenderChat /> مباشرة بدون
// أي تنسيق حواليها - فالبطاقة كانت تطلع ملتصقة بالزاوية العلوية اليسرى
// بدل النص، وخلفية الصفحة تضل سوداء فاضية (مو نفس بنفسجي باقي الموقع).
// الحين لفّيناها بصندوق يوسّطها أفقيًا ويغطي الخلفية بلون الموقع.
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