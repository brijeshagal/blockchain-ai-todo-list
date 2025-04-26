import axios from "axios";
import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetch() {
      const res = await axios.post(`/api/`);
      console.log({ res });
    }
    fetch();
  }, []);

  return (
    <div>
      <h1>Decentralized To-Do</h1>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title} - {t.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
}
