// تغيير: قبل كذا هذي القائمة كانت ثابتة بالكود وتطلع نفسها لكل موديل،
// بغض النظر وش الموديل المختار. الحين تستقبل أمثلة الموديل الحقيقية
// (model.sample_prompts من قاعدة البيانات)، وإذا ما كان عند الموديل
// أمثلة محفوظة، ترجع لنفس الأمثلة العامة كحل احتياطي.
function SamplePrompts({ prompts }) {
  const list =
    prompts && prompts.length > 0
      ? prompts
      : [
          "Explain AI in simple terms",
          "Write a React component",
          "Summarize a long article",
        ];
 
  return (
    <div>
      <h3>Sample Prompts</h3>
      {list.map((p, i) => (
        <p key={i}>💬 {p}</p>
      ))}
    </div>
  );
}
 
export default SamplePrompts;
 