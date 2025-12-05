import React from 'react';
import '../Shared/Modal.css';
import './CreateNewTask.css';
import '../EditTask/EditTask.css';

export default function CreateNewTask({ show, onClose, members, newTaskData, setNewTaskData, onCreate }) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal create-task-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Create Task</h3>
        <form>
          <input className='title-input'
            placeholder="Title"
            value={newTaskData.title}
            onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
          />
          <textarea className='des-textarea'
            placeholder="Description"
            value={newTaskData.description || ''}
            onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
            rows={3}
          />
          <input className='date-input'
            type="date"
            value={newTaskData.dueDate}
            onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
          />
          <select className='select-input'
            value={newTaskData.priority}
            onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select className='select-input'
            value={newTaskData.assignedTo}
            onChange={(e) => setNewTaskData({ ...newTaskData, assignedTo: e.target.value })}
          >
            <option value="">Assign to member...</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.displayName || m.email}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="button" className="btn primary" onClick={onCreate}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
