"use client";

import AIButtons from "@/components/ai/AIButtons";
import api from "@/lib/axios";
import {
  CheckCircle2,
  Clock,
  Edit,
  Plus,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  priority?: "low" | "medium" | "high";
  deadline?: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [deadline, setDeadline] = useState<string>("");
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [editDeadline, setEditDeadline] = useState<string>("");
  const [isEditPrioritizing, setIsEditPrioritizing] = useState(false);

  const [suggestions, setSuggestions] = useState<unknown[]>([]);
  const [reminders, setReminders] = useState<unknown[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await api.get("/tasks");
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
      const res = await api.post("/tasks", {
        title,
        priority,
        deadline,
      });
      setTasks((prev) => [...prev, res.data]);
      setTitle("");
      setPriority("medium");
      setDeadline("");
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const handleAutoSetPriority = async (taskTitle: string, isEdit = false) => {
    if (!taskTitle.trim()) return;

    try {
      if (isEdit) {
        setIsEditPrioritizing(true);
      } else {
        setIsPrioritizing(true);
      }

      const res = await api.post("/ai/suggestions", {
        taskTitle,
        deadline,
      });
      console.log({ res });

      const result: "low" | "medium" | "high" = res.data.split(": ")[1];

      // Set the priority based on the suggestion
      if (isEdit) {
        setEditPriority(result || "medium");
      } else {
        setPriority(result || "medium");
      }
    } catch (error) {
      console.error("Failed to get priority suggestion:", error);
    } finally {
      if (isEdit) {
        setIsEditPrioritizing(false);
      } else {
        setIsPrioritizing(false);
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      const res = await api.put(`/tasks/${id}/complete`);
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
    setEditPriority(task.priority || "medium");
    setEditDeadline(task.deadline || "");
  };

  const handleEditTask = async () => {
    if (!editTitle.trim() || !editingId) return;

    try {
      const res = await api.put(`/tasks/${editingId}`, {
        title: editTitle,
        priority: editPriority,
        deadline: editDeadline,
      });
      setTasks((prev) =>
        prev.map((task) =>
          task._id === editingId
            ? {
                ...task,
                title: res.data.title,
                priority: res.data.priority,
                deadline: res.data.deadline,
              }
            : task
        )
      );
      setEditingId(null);
      setEditTitle("");
      setEditPriority("medium");
      setEditDeadline("");
    } catch (err) {
      console.error("Failed to edit task", err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-900/30 text-red-400";
      case "medium":
        return "bg-amber-900/30 text-amber-400";
      case "low":
        return "bg-green-900/30 text-green-400";
      default:
        return "bg-gray-800 text-gray-400";
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionRate =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-900 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold flex items-center text-white">
            <span className="mr-2">📝</span> Decentralized To-Do
          </h1>
          <p className="text-indigo-300 mt-2">
            Organize your tasks efficiently
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Analytics Card */}
          <div className="bg-gray-900 rounded-xl shadow-md p-6 transition hover:shadow-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              📊 Analytics
            </h3>
            <div className="text-3xl font-bold text-indigo-400">
              {completionRate.toFixed(0)}%
            </div>
            <p className="text-gray-400 mt-1">
              {completedCount} of {totalCount} tasks completed
            </p>
            {/* Progress bar */}
            <div className="w-full bg-gray-800 rounded-full h-2.5 mt-4">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          {/* Pending Tasks Card */}
          <div className="bg-gray-900 rounded-xl shadow-md p-6 transition hover:shadow-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              ⏳ Pending
            </h3>
            <div className="text-3xl font-bold text-orange-400">
              {tasks.filter((t) => !t.completed).length}
            </div>
            <p className="text-gray-400 mt-1">Tasks remaining</p>
          </div>

          {/* Completed Tasks Card */}
          <div className="bg-gray-900 rounded-xl shadow-md p-6 transition hover:shadow-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              ✅ Completed
            </h3>
            <div className="text-3xl font-bold text-green-400">
              {completedCount}
            </div>
            <p className="text-gray-400 mt-1">Tasks finished</p>
          </div>
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mb-6 flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg shadow hover:bg-indigo-600 transition"
        >
          <Plus size={18} className="mr-2" /> Add New Task
        </button>

        {/* AI Assistance */}
        <div className="mb-8 bg-gray-900 rounded-xl shadow-md p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            🤖 AI Assistance
          </h3>
          <AIButtons
            setReminders={setReminders}
            setTips={setTips}
            className="flex flex-wrap gap-3"
          />

          {/* AI Tips Display */}
          {tips.length > 0 && (
            <div className="mt-4 p-4 bg-indigo-950/50 rounded-lg border border-indigo-900">
              <h4 className="font-medium text-indigo-300 mb-2">AI Tips</h4>
              <ul className="list-disc pl-5 text-sm text-indigo-200">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="bg-gray-900 rounded-xl shadow-md p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-gray-200 mb-4">Your Tasks</h2>

          {tasks.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No tasks yet. Add your first task to get started!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className={`py-4 ${task.completed ? "bg-gray-800/30" : ""}`}
                >
                  {editingId === task._id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
                      />

                      <div className="flex items-center gap-2">
                        <select
                          value={editPriority}
                          onChange={(e) =>
                            setEditPriority(
                              e.target.value as "low" | "medium" | "high"
                            )
                          }
                          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>

                        <button
                          onClick={() => handleAutoSetPriority(editTitle, true)}
                          className="px-3 py-2 bg-indigo-800 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-1"
                          disabled={isEditPrioritizing || !editTitle.trim()}
                          title="Auto-set priority using AI"
                        >
                          {isEditPrioritizing ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          ) : (
                            <>
                              <Wand2 size={16} /> Auto
                            </>
                          )}
                        </button>
                      </div>

                      <input
                        type="datetime-local"
                        value={editDeadline}
                        onChange={(e) => setEditDeadline(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
                      />

                      <div className="flex space-x-2">
                        <button
                          onClick={handleEditTask}
                          className="px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-600 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-medium ${
                              task.completed
                                ? "line-through text-gray-500"
                                : "text-gray-200"
                            }`}
                          >
                            {task.title}
                          </h3>

                          <div className="mt-1 flex flex-wrap gap-2 items-center text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                task.priority || "medium"
                              )}`}
                            >
                              {task.priority}
                            </span>

                            {task.deadline && (
                              <span className="flex items-center text-gray-400">
                                <Clock size={14} className="mr-1" />
                                {new Date(task.deadline).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-1">
                          {!task.completed && (
                            <button
                              onClick={() => handleCompleteTask(task._id)}
                              className="p-1 text-green-400 hover:bg-green-900/30 rounded-full transition"
                              title="Mark as completed"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                          )}

                          <button
                            onClick={() => handleStartEdit(task)}
                            className="p-1 text-blue-400 hover:bg-blue-900/30 rounded-full transition"
                            title="Edit task"
                          >
                            <Edit size={20} />
                          </button>

                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-1 text-red-400 hover:bg-red-900/30 rounded-full transition"
                            title="Delete task"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden border border-gray-700">
            <div className="flex justify-between items-center bg-indigo-900 text-white px-6 py-4">
              <h3 className="text-lg font-medium">Add New Task</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Priority
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as "low" | "medium" | "high")
                    }
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>

                  <button
                    onClick={() => handleAutoSetPriority(title)}
                    className="px-3 py-2 bg-indigo-800 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-1"
                    disabled={isPrioritizing || !title.trim()}
                    title="Auto-set priority using AI"
                  >
                    {isPrioritizing ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        <Wand2 size={16} /> Auto
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Deadline (optional)
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-600 transition"
                  disabled={!title.trim()}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
