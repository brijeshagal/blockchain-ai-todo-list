"use client";

import AIButtons from "@/components/ai/AIButtons";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [suggestions, setSuggestions] = useState<unknown[]>([]);
  const [reminders, setReminders] = useState<unknown[]>([]);
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await api.get("/api/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    }
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!title.trim()) return;

    try {
      const res = await api.post("/api/tasks", { title });
      setTasks((prev) => [...prev, res.data]);
      setTitle("");
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      const res = await api.put(`/api/tasks/${id}/complete`);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, completed: res.data.completed } : task
        )
      );
    } catch (err) {
      console.error("Failed to complete task", err);
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const handleEditTask = async () => {
    if (!editTitle.trim() || !editingId) return;

    try {
      const res = await api.put(`/api/tasks/${editingId}`, {
        title: editTitle,
      });
      setTasks((prev) =>
        prev.map((task) =>
          task._id === editingId ? { ...task, title: res.data.title } : task
        )
      );
      setEditingId(null);
      setEditTitle("");
    } catch (err) {
      console.error("Failed to edit task", err);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionRate =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 16 }}>
      <h1>📝 Decentralized To-Do</h1>

      {/* Analytics */}
      <div style={{ marginBottom: 24 }}>
        <h3>📊 Analytics</h3>
        <p>
          {completedCount} of {totalCount} tasks completed (
          {completionRate.toFixed(0)}%)
        </p>
      </div>

      {/* Add/Edit */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Enter task"
          value={editingId ? editTitle : title}
          onChange={(e) =>
            editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)
          }
          style={{ flex: 1, padding: 8 }}
        />
        <button
          onClick={editingId ? handleEditTask : handleAddTask}
          style={{ padding: "8px 12px" }}
        >
          {editingId ? "Save" : "Add"}
        </button>
      </div>

      {/* AI Agent Buttons */}
      <AIButtons
        setReminders={setReminders}
        setSuggestions={setSuggestions}
        setTips={setTips}
      />

      {/* Tasks */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #ccc",
              paddingBottom: 4,
            }}
          >
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>

            <div style={{ display: "flex", gap: 8 }}>
              {!task.completed && (
                <button onClick={() => handleCompleteTask(task._id)}>✅</button>
              )}
              <button onClick={() => handleStartEdit(task)}>✏️</button>
              <button onClick={() => handleDeleteTask(task._id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
