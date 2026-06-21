function SamplePrompts() {
  const prompts = [
    "Explain AI in simple terms",
    "Write a React component",
    "Summarize a long article",
  ];

  return (
    <div>
      <h3>Sample Prompts</h3>

      {prompts.map((p, i) => (
        <p key={i}>💬 {p}</p>
      ))}
    </div>
  );
}

export default SamplePrompts;