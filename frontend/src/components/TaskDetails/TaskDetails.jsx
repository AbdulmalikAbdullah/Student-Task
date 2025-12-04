import React from 'react';
import '../Shared/Modal.css';
import './TaskDetails.css';

export default function TaskDetails({ task, members, onClose, onEdit, onDelete }) {
  if (!task) return null;

  const assignedMember = members.find(m => m._id === task.assignedTo);
  const assignedName = assignedMember ? `${assignedMember.firstName} ${assignedMember.lastName}` : 'Unknown';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{task.title}</h3>
        <p><strong>Description:</strong> {task.description || 'No description'}</p>
        <p><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</p>
        <p><strong>Priority:</strong> {task.priority || 'Low'}</p>
        <p><strong>Status:</strong> {task.status}</p>
        {task.assignedTo && <p><strong>Assigned to:</strong> {assignedName}</p>}
        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Close</button>
          <button className="btn primary" onClick={() => { onEdit(task); onClose(); }}>Edit</button>
          <button className="btn leave" onClick={() => { onDelete(task._id);}}>Delete</button>
        </div>
      </div>
    </div>
  );
}
