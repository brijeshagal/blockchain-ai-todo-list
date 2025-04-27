import api from "@/lib/axios";
import { Clock, Lightbulb } from "lucide-react";
import { useState } from "react";

const AIButtons = ({
  setReminders,
  setTips,
  className = "",
}: {
  setReminders: React.Dispatch<React.SetStateAction<unknown[]>>;
  setTips: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}) => {
  const [loading, setLoading] = useState({
    suggestions: false,
    reminders: false,
    tips: false,
  });

  const fetchReminders = async () => {
    try {
      setLoading((prev) => ({ ...prev, reminders: true }));
      const res = await api.get("/ai/reminders");
      setReminders(res.data);
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
    } finally {
      setLoading((prev) => ({ ...prev, reminders: false }));
    }
  };

  const fetchTips = async () => {
    try {
      setLoading((prev) => ({ ...prev, tips: true }));
      const res = await api.get("/ai/tips");
      console.log({ res });
      setTips(res.data);
    } catch (error) {
      console.error("Failed to fetch tips:", error);
    } finally {
      setLoading((prev) => ({ ...prev, tips: false }));
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <button
          onClick={fetchReminders}
          disabled={loading.reminders}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-900 to-blue-700 text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 border border-blue-800"
        >
          {loading.reminders ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <>
              <Clock size={18} />
              <span>Show Reminders</span>
            </>
          )}
        </button>

        <button
          onClick={fetchTips}
          disabled={loading.tips}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-green-900 to-green-700 text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 border border-green-800"
        >
          {loading.tips ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <>
              <Lightbulb size={18} />
              <span>Productivity Tips</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIButtons;
