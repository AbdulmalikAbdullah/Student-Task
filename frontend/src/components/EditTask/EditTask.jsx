import React from 'react';
import '../Shared/Modal.css';
import './EditTask.css';

export default function EditTask({ editingTask, setEditingTask, members, onSave }) {
  if (!editingTask) return null;

  const onChange = (patch) => setEditingTask({ ...editingTask, ...patch });

  return (
    <div className="modal-overlay" onClick={() => setEditingTask(null)}>
      <div className="modal edit-task-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Task</h3>
        <form>
          <input className='title-input' placeholder="Title" value={editingTask.title} onChange={(e) => onChange({ title: e.target.value })} />
          <textarea className='des-textarea' placeholder="Description" value={editingTask.description || ''} onChange={(e) => onChange({ description: e.target.value })} rows={3} />
          <input className='date-input' type="date" value={editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : ''} onChange={(e) => onChange({ dueDate: e.target.value })} />
          <select className='select-input' value={editingTask.priority || 'Low'} onChange={(e) => onChange({ priority: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select className='select-input' value={editingTask.assignedTo || ''} onChange={(e) => onChange({ assignedTo: e.target.value })}>
            <option value="">Assign to member...</option>
            {members.map(m => (
              <option key={m._id} value={m._id}>{m.displayName || m.email}</option>
            ))}
          </select>
          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={() => setEditingTask(null)}>Cancel</button>
            <button type="button" className="btn primary" onClick={() => { onSave(editingTask); setEditingTask(null); }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
