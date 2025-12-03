import React from 'react';
import './TaskList.css';

export default function TaskList({ tasks, loading, onSelect, onToggleComplete }) {
  if (loading) return <div>Loading...</div>;

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task">
          <div className="task-box">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={task.status === "Completed"}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleComplete(task);
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="checkmark"></span>
            </label>
            <div className="task-info">
              <div className="task-title">{task.title}</div>
              {task.description && <div className="task-desc">{task.description.substring(0, 50)}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                <div className={`priority-badge priority-${(task.priority || 'Low').toLowerCase()}`}>{task.priority || 'Low'}</div>
                <div className="task-due"><img className='due-Icon' src="../../../assets/dueIcon.svg" alt="Date Icon" />{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</div>
                <div className='assign-to'>not assignedTo anyone</div>
              </div>
            </div>
          </div>
          <button className='view-details' key={task._id} onClick={() => onSelect(task)}>View Details</button>
        </div>
      ))}
    </div>
  );
}
