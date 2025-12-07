import React, { useState } from 'react';
import './TaskList.css';
import dueIcon from "../../../assets/dueIcon.svg";

export default function TaskList({ tasks, members = [], loading, onSelect, onToggleComplete, onDragEnd }) {
  const [draggedId, setDraggedId] = useState(null);
  
  if (loading) return <div>Loading...</div>;

  const handleDragStart = (e, taskId) => {
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTaskId) => {
    e.preventDefault();
    if (draggedId === targetTaskId) {
      setDraggedId(null);
      return;
    }
    
    const draggedIndex = tasks.findIndex(t => t._id === draggedId);
    const targetIndex = tasks.findIndex(t => t._id === targetTaskId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      return;
    }
    
    const reordered = Array.from(tasks);
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);
    
    if (onDragEnd) {
      onDragEnd(reordered);
    }
    setDraggedId(null);
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`task${draggedId === task._id ? ' dragging' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, task._id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, task._id)}
          onDragEnd={() => setDraggedId(null)}
        >
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
                <div className="task-due"><img className='due-Icon' src={dueIcon} alt="Date Icon" />{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</div>
                <div className='assign-to'><strong>Assigned to:</strong> {task.assignedTo ? `${members.find(m => m._id === task.assignedTo)?.firstName || 'Unknown'} ${members.find(m => m._id === task.assignedTo)?.lastName || ''}`.trim() : 'not assignedTo anyone'}</div>
              </div>
            </div>
          </div>
          <button className='view-details' onClick={(e) => { e.stopPropagation(); onSelect(task); }}>View Details</button>
        </div>
      ))}
    </div>
  );
}
