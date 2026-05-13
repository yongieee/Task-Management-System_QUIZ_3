import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8001/api/tasks/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTaskTitle,
          is_completed: false,
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Toggle task completion
  const toggleComplete = async (task) => {
    try {
      const response = await fetch(`${API_URL}${task.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_completed: !task.is_completed,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  return (
    <div className="app-container">
      {/* Main Content Area */}
      <main className="main-content">
        <section className="task-management">
          <div className="content-header" style={{ marginBottom: '3rem' }}>
            <h2>ADD NEW TASK</h2>
            <form onSubmit={addTask} className="brutalist-form">
              <input
                type="text"
                className="brutalist-input"
                placeholder="What is the mission?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
              <button type="submit" className="brutalist-button">ADD</button>
            </form>
          </div>

          <div className="task-header" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: 'black', color: 'white', padding: '0.2rem 0.5rem', fontWeight: 'bold' }}>★</span>
            <h2 style={{ margin: 0, textTransform: 'uppercase' }}>MY MISSIONS</h2>
          </div>

          <div className="task-grid">
            {loading ? (
              <p>LOADING DATA from database...</p>
            ) : tasks.length === 0 ? (
              <p>NO MISSIONS FOUND.</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="task-card"
                  onClick={() => toggleComplete(task)}
                >
                  <div className="task-item-header">
                    <div className="task-id-badge">#{task.id}</div>
                    <span className="task-title" style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>
                      {task.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span className={`status-badge ${task.is_completed ? 'status-completed' : 'status-pending'}`} style={{
                      border: '2px solid black',
                      borderRadius: '0',
                      background: task.is_completed ? '#34d399' : '#fbbf24',
                      color: 'black',
                      padding: '0.25rem 0.5rem',
                      fontWeight: 'bold',
                      fontSize: '0.8rem'
                    }}>
                      {task.is_completed ? 'DONE' : 'ACTIVE'}
                    </span>
                    <button className="read-more">TOGGLE »</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
