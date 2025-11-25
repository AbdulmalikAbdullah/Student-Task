// import "./CoursePage.css"

// function CoursePage() {
//     return (

//         <div className="course-container">
//             <div className="course-title">Computer Networking Cs 256</div>
//             <div className="task one">Task
//                 <button className="task-dbutton">Details</button>
//             </div>
//             <div className="task one">Task
//                 <button className="task-dbutton">Details</button>
//             </div>
//             <div className="task one">Task
//                 <button className="task-dbutton">Details</button>
//             </div>
//             <div className="task one">Task
//                 <button className="task-dbutton">Details</button>
//             </div>
//         </div>

//     )
// }

// export default CoursePage


import "./CoursePage.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import socket from "../../api/socket";

function CoursePage() {
    const params = useParams();
    // support both route param names: `:courseId` or legacy `:id`
    const courseId = params.courseId || params.id;
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'members'
    const navigate = useNavigate();

    const [newTaskData, setNewTaskData] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
        status: "Pending",
        assignedTo: "",
    });

    const [selectedTask, setSelectedTask] = useState(null); // for task detail modal
    const [editingTask, setEditingTask] = useState(null); // for edit modal

    useEffect(() => {
        if (!courseId) return;

        // Connect socket and join course room
        socket.connect();
        socket.emit("joinCourse", courseId);

        // Socket event listeners
        socket.on("taskCreated", (task) => {
            setTasks((prev) => [task, ...prev]);
        });

        socket.on("taskUpdated", (task) => {
            setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
        });

        socket.on("taskDeleted", ({ id }) => {
            setTasks((prev) => prev.filter((t) => t._id !== id));
        });

        // Initial fetch
        fetchTasks();
            fetchCourse();

        return () => {
            socket.emit("leaveCourse", courseId);
            socket.off("taskCreated");
            socket.off("taskUpdated");
            socket.off("taskDeleted");
            try { socket.disconnect(); } catch (e) {}
        };
    }, [courseId]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/tasks/course/${courseId}`);
            setTasks(res.data || []);
        } catch (err) {
            console.error("fetch tasks error", err);
        } finally {
            setLoading(false);
        }
    };

        const [members, setMembers] = useState([]);
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${courseId}`);
                const c = res.data;
                setMembers(c.members || []);
                // prefer course name from server if available
                if (c.name) {
                    // set title in local state
                    // we use courseTitle variable above only for initial param
                    // replace window title display
                    // (we'll store in state below)
                    setCourseName(c.name);
                }
            } catch (err) {
                console.error('fetchCourse error', err);
            }
        };

        const [courseName, setCourseName] = useState('');

    const addTask = async () => {
        try {
            // Basic client-side validation to avoid server 400s
            if (!courseId) {
                console.error('Cannot create task: missing courseId (route param)');
                return;
            }

            const title = (newTaskData.title || "").trim();
            if (!title) {
                console.error('Cannot create task: title is required');
                return;
            }

            // ensure we include `course` for mongoose validation as some code expects it
            const payload = { ...newTaskData, title, courseId, course: courseId };
            await api.post("/tasks/create", payload);
            // server will emit 'taskCreated' and update via socket
            setNewTaskData({ title: "", description: "", dueDate: "", priority: "Low", status: "Pending" });
        } catch (err) {
            console.error("addTask error", err);
            if (err?.response) {
                console.error('Server response:', err.response.status, err.response.data);
            }
        }
    };

    const updateTask = async (id, updates) => {
        try {
            await api.put(`/tasks/${id}`, updates);
            // server emits 'taskUpdated'
        } catch (err) {
            console.error("updateTask error", err);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            // server emits 'taskDeleted'
        } catch (err) {
            console.error("deleteTask error", err);
        }
    };

    const toggleComplete = (task) => {
           const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
           updateTask(task._id, { status: newStatus });
    };

    return (
        <div className="course-container">
            <div className="course-header">
                <span className="menu-icon">☰</span>
                <div className="course-title">{courseName || 'Course'}</div>
                <div className="user-avatar">S</div>
            </div>

            <div className="course-body">
                <div className="tab-header">
                    <div>
                        <span className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Tasks</span>
                        <span className={`tab ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>Members</span>
                    </div>
                    <div>
                        <button className="back-button" onClick={() => navigate('/dashboard')}>Back</button>
                        <button style={{ marginLeft: 8 }} className="new-task-button" onClick={addTask}>Create Task</button>
                    </div>
                </div>

                <div className="task-form">
                    <input placeholder="Title" value={newTaskData.title} onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })} />
                    <textarea placeholder="Description" value={newTaskData.description} onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })} rows={2} />
                    <input placeholder="Due" type="date" value={newTaskData.dueDate} onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })} />
                    <select value={newTaskData.priority} onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value })}>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                    <select value={newTaskData.assignedTo} onChange={(e) => setNewTaskData({ ...newTaskData, assignedTo: e.target.value })}>
                        <option value="">Assign to member...</option>
                        {members.map((m) => (
                            <option key={m._id} value={m._id}>{m.displayName || m.email}</option>
                        ))}
                    </select>
                </div>

                {activeTab === 'tasks' ? (
                    <div className="task-list">
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            tasks.map((task) => (
                                <div className="task" key={task._id} onClick={() => setSelectedTask(task)}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={task.status === 'Completed'} onChange={() => toggleComplete(task)} onClick={(e) => e.stopPropagation()} />
                                        <div className="task-info">
                                            <div className="task-title">{task.title}</div>
                                            {task.description && <div className="task-desc">{task.description.substring(0, 50)}...</div>}
                                            <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                                                <div className={`priority-badge priority-${(task.priority||'Low').toLowerCase()}`}>{task.priority || 'Low'}</div>
                                                <div className="task-due">Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={(e) => { e.stopPropagation(); setEditingTask(task); }}>Edit</button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}>Delete</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="members-panel">
                        {members.length === 0 ? (
                            <div>No members</div>
                        ) : (
                            members.map((m) => (
                                <div key={m._id} className="member-row" onClick={() => alert(m.displayName || m.email)}>
                                    {m.displayName || m.email}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedTask.title}</h3>
                        <p><strong>Description:</strong> {selectedTask.description || 'No description'}</p>
                        <p><strong>Due:</strong> {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : '—'}</p>
                        <p><strong>Priority:</strong> {selectedTask.priority || 'Low'}</p>
                        <p><strong>Status:</strong> {selectedTask.status}</p>
                        {selectedTask.assignedTo && <p><strong>Assigned to:</strong> {members.find(m => m._id === selectedTask.assignedTo)?.displayName || 'Unknown'}</p>}
                        <div className="modal-actions">
                            <button className="btn ghost" onClick={() => setSelectedTask(null)}>Close</button>
                            <button className="btn primary" onClick={() => { setEditingTask(selectedTask); setSelectedTask(null); }}>Edit</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Task Modal */}
            {editingTask && (
                <div className="modal-overlay" onClick={() => setEditingTask(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit Task</h3>
                        <form>
                            <input
                                placeholder="Title"
                                value={editingTask.title}
                                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                value={editingTask.description || ''}
                                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                rows={3}
                            />
                            <input
                                type="date"
                                value={editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : ''}
                                onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                            />
                            <select
                                value={editingTask.priority || 'Low'}
                                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                            <select
                                value={editingTask.assignedTo || ''}
                                onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
                            >
                                <option value="">Assign to member...</option>
                                {members.map((m) => (
                                    <option key={m._id} value={m._id}>{m.displayName || m.email}</option>
                                ))}
                            </select>
                            <div className="modal-actions">
                                <button type="button" className="btn ghost" onClick={() => setEditingTask(null)}>Cancel</button>
                                <button type="button" className="btn primary" onClick={() => { updateTask(editingTask._id, editingTask); setEditingTask(null); }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CoursePage;
