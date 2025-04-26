import axios from "axios";

const AIButtons = ({
  setReminders,
  setSuggestions,
  setTips,
}: {
  setReminders: React.Dispatch<React.SetStateAction<unknown[]>>;
  setTips: React.Dispatch<React.SetStateAction<string[]>>;
  setSuggestions: React.Dispatch<React.SetStateAction<unknown[]>>;
}) => {
  const fetchSuggestions = async () => {
    const res = await axios.get("/api/ai/suggestions");
    setSuggestions(res.data);
  };

  const fetchReminders = async () => {
    const res = await axios.get("/api/ai/reminders");
    setReminders(res.data);
  };

  const fetchTips = async () => {
    const res = await axios.get("/api/ai/tips");
    setTips(res.data);
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <h2>⚙️ AI Tools</h2>
      <button onClick={fetchSuggestions} style={{ marginRight: 10 }}>
        📌 Get Priority Suggestions
      </button>
      <button onClick={fetchReminders} style={{ marginRight: 10 }}>
        ⏰ Show Reminders
      </button>
      <button onClick={fetchTips}>💡 Productivity Tips</button>
    </div>
  );
};

export default AIButtons;
