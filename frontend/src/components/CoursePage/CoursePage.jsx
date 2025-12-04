import "./CoursePage.css";
import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import socket from "../../api/socket";
import Navbar from "../Navbar/Navbar";
import CreateNewTask from "../CreateNewTask/CreateNewTask";
import EditTask from "../EditTask/EditTask";
import TaskList from "../TaskList/TaskList";
import TaskDetails from "../TaskDetails/TaskDetails";
import MembersList from "../MembersList/MembersList";

function CoursePage() {
    const params = useParams();
    const courseId = params.courseId || params.id;
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tasks');
    const [draggedTask, setDraggedTask] = useState(null);
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState();
    const [newTaskData, setNewTaskData] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
        status: "Pending",
        assignedTo: "",
    });
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [memberFilter, setMemberFilter] = useState("All");
    const [dateSort, setDateSort] = useState("asc");
    const [showFilter, setShowFilter] = useState(true);
    const [onlineUser, setOnlineUser] = useState(0);


    useEffect(() => {
        if (!courseId) return;

        socket.connect();
        socket.emit("joinCourse", courseId);

        socket.on("taskCreated", (task) => {
            setTasks((prev) => [task, ...prev]);
        });

        socket.on("taskUpdated", (task) => {
            setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
        });

        socket.on("taskDeleted", ({ id }) => {
            setTasks((prev) => prev.filter((t) => t._id !== id));
        });

        socket.on("tasksReordered", (reorderedTasks) => {
            setTasks(reorderedTasks);
        });

        fetchTasks();
        fetchCourse();

        return () => {
            socket.emit("leaveCourse", courseId);
            socket.off("taskCreated");
            socket.off("taskUpdated");
            socket.off("taskDeleted");
            try { socket.disconnect(); } catch (e) { }
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
            if (c.name && c.courseCode) {
                setCourseName(c.name);
                setCourseCode(c.courseCode)
            }
        } catch (err) {
            console.error('fetchCourse error', err);
        }
    };



    const addTask = async () => {
        try {
            if (!courseId) {
                console.error('Cannot create task: missing courseId (route param)');
                return;
            }

            const title = (newTaskData.title || "").trim();
            if (!title) {
                console.error('Cannot create task: title is required');
                return;
            }
            const payload = { ...newTaskData, title, courseId, course: courseId };
            await api.post("/tasks/create", payload);
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
        } catch (err) {
            console.error("updateTask error", err);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            setSelectedTask(null);
        } catch (err) {
            console.error("deleteTask error", err);
        }
    };

    const toggleComplete = (task) => {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        updateTask(task._id, { status: newStatus });
    };

    const filteredTasks = tasks
        .filter(t => {
            if (search.trim() !== "") {
                const txt = search.toLowerCase();
                if (
                    !t.title.toLowerCase().includes(txt) &&
                    !t.description?.toLowerCase().includes(txt)
                ) return false;
            }

            if (statusFilter !== "All" && t.status !== statusFilter) return false;

            if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;

            if (memberFilter !== "All" && t.assignedTo !== memberFilter) return false;

            return true;
        })
        .sort((a, b) => {
            if (!a.dueDate || !b.dueDate) return 0;
            return dateSort === "asc"
                ? new Date(a.dueDate) - new Date(b.dueDate)
                : new Date(b.dueDate) - new Date(a.dueDate);
        });

    const backIcon = <svg width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 9H5.414l3.293-3.293a.999.999 0 10-1.414-1.414l-5 5a.999.999 0 000 1.414l5 5a.997.997 0 001.414 0 .999.999 0 000-1.414L5.414 11H17a1 1 0 100-2z" fill="#000" />
    </svg>
    return (
        <><Navbar />
            <div className="course-container">
                <div className="course-header">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>{backIcon}</button>
                    <div className="course-title">{courseName || 'Course'}</div>
                    <div className="course-code">({courseCode || 'Course'})</div>
                    <button className="new-task-button" onClick={() => setShowCreateModal(true)}>Create Task</button>
                </div>

                <div className="course-body">
                    <div className="tab-header">
                        <div>
                            <span className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => { setActiveTab('tasks'); setShowFilter(true); }}>Tasks</span>
                            <span className={`tab ${activeTab === 'members' ? 'active' : ''}`} onClick={() => { setActiveTab('members'); setShowFilter(false) }}>Members</span>
                            <span className="online-user">Online users: {onlineUser}</span>
                        </div>
                    </div>

                    {showFilter && (<div className="filters-container">

                        <div className="top-row">
                            <input type="text" placeholder="Search tasks..." className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>

                        <div className="bottom-row">

                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option>All</option>
                                <option>Pending</option>
                                <option>Completed</option>
                            </select>


                            <select
                                className="filter-select"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <option>All</option>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>


                            <select
                                className="filter-select"
                                value={memberFilter}
                                onChange={(e) => setMemberFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                {members.map(m => (
                                    <option key={m._id} value={m._id}>
                                        {m.displayName || m.email}
                                    </option>
                                ))}
                            </select>


                            <select
                                className="filter-select"
                                value={dateSort}
                                onChange={(e) => setDateSort(e.target.value)}
                            >
                                <option value="asc">Due Date (Ascending)</option>
                                <option value="desc">Due Date (Descending)</option>
                            </select>


                        </div>

                    </div>)}


                    <CreateNewTask
                        show={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        members={members}
                        newTaskData={newTaskData}
                        setNewTaskData={setNewTaskData}
                        onCreate={async () => { await addTask(); setShowCreateModal(false); }}
                    />

                    {false && activeTab === 'tasks' && (
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
                    )}
                    {activeTab === 'tasks' ? (
                        <TaskList
                            tasks={filteredTasks}
                            members={members}
                            loading={loading}
                            onSelect={(t) => setSelectedTask(t)}
                            onToggleComplete={toggleComplete}
                            onDragEnd={(reorderedTasks) => {
                                setTasks(reorderedTasks);
                            }}
                        />
                    ) : (
                        <MembersList members={members} onMemberClick={(m) => alert(m.displayName || m.email)} />
                    )}
                </div>

                <TaskDetails task={selectedTask} members={members} onDelete={deleteTask} onClose={() => setSelectedTask(null)} onEdit={(t) => { setEditingTask(t); setSelectedTask(null); }} />

                <EditTask
                    editingTask={editingTask}
                    setEditingTask={setEditingTask}
                    members={members}
                    onSave={(task) => updateTask(task._id, task)}
                />
            </div>
        </>
    );
}

export default CoursePage;
