import '../Shared/Modal.css';
import "./Dashboard.css";
import Mytasks from "../Mytasks/Mytasks.jsx"
import CourseCard from "./CourseCard.jsx";
import Navbar from "../Navbar/Navbar.jsx";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/notification";

function Dashboard() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [newCourseName, setNewCourseName] = useState("");
    const [newCourseCode, setNewCourseCode] = useState("");
    const [creating, setCreating] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [joining, setJoining] = useState(false);
    const [createdCourse, setCreatedCourse] = useState(null);
    const [showNotif, setShowNotif] = useState(false);
    const [showNotifErr_UpdateCourse, setShowNotifErr_UpdateCourse] = useState(false);
    const [showNotifsuccess_UpdateCourse, setShowNotifsuccess_UpdateCourse] = useState(false);
    const [showNotifErr_DeleteCourse, setShowNotifErr_DeleteCourse] = useState(false);
    const [showNotifsuccess_DeleteCourse, setShowNotifsuccess_DeleteCourse] = useState(false);
    const [showNotifErr_JoinCourse, setShowNotifErr_JoinCourse] = useState(false);
    const [showNotifsuccess_JoinCourse, setShowNotifsuccess_JoinCourse] = useState(false);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/courses/my-courses");
            setCourses(res.data || []);
        } catch (err) {
            console.error("fetch courses error", err);
            setShowNotif(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleView = (course) => {

        navigate(`/course/${course._id}`);
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            return;
        }
        try {
            await api.delete(`/courses/${courseId}`);
            setShowNotifsuccess_DeleteCourse(true);
            setTimeout(() => { setShowNotifsuccess_DeleteCourse(false); }, 3900);
            await fetchCourses();
        } catch (err) {
            console.error("deleteCourse error", err);
            setShowNotifErr_DeleteCourse(true);
            setTimeout(() => { setShowNotifErr_DeleteCourse(false); }, 3900);
        }
    };

    const handleUpdate = async (courseId, newName, newCode) => {
        if (!newName.trim() || !newCode.trim()) {
            return;
        }
        try {
            await api.put(`/courses/${courseId}`, {
                name: newName.trim(),
                courseCode: newCode.trim()
            });
            await fetchCourses();
            setShowNotifsuccess_UpdateCourse(true);
            setTimeout(() => { setShowNotifsuccess_UpdateCourse(false); }, 3900);
        } catch (err) {
            console.error("updateCourse error", err);
            setShowNotifErr_UpdateCourse(true);
            setTimeout(() => { setShowNotifErr_UpdateCourse(false); }, 3900);

        }
    }

    const handleCreateClick = () => setShowCreate(true);

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!newCourseName.trim() || !newCourseCode.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        setCreating(true);

        try {
            const res = await api.post("/courses/create", {
                name: newCourseName.trim(),
                courseCode: newCourseCode.trim(),

            });


            setCreatedCourse(res.data);
            setNewCourseName("");
            setNewCourseCode(newCourseCode);
            setShowCreate(false);

            await fetchCourses();
        } catch (err) {
            console.error("create course error", err);
            alert(err.response?.data?.msg || "Failed to create course");
        } finally {
            setCreating(false);
            setNewCourseCode("")
        }
    };


    const handleJoin = async (e) => {
        e.preventDefault();
        if (!joinCode.trim()) return;
        setJoining(true);
        try {
            await api.post("/courses/join", { code: joinCode.trim() });
            setJoinCode("");
            setShowJoin(false);
            await fetchCourses();
            setShowNotifsuccess_JoinCourse(true);
            setTimeout(() => { setShowNotifsuccess_JoinCourse(false); }, 3900);
        } catch (err) {
            console.error('join course error', err);
            alert(err.response?.data?.msg || 'Failed to join course');
            setShowNotifErr_JoinCourse(true);
            setTimeout(() => { setShowNotifErr_JoinCourse(false); }, 3900);
        } finally {
            setJoining(false);
        }
    };

    return (
        <>

            <main className="dashboard">
                <Navbar />
                {(() => {
                    const totals = courses.reduce((acc, c) => {
                        const total = Number(c.taskCount || 0);
                        const completed = Number(c.completedCount || 0);
                        acc.totalTasks += total;
                        acc.completedTasks += completed;
                        return acc;
                    }, { totalTasks: 0, completedTasks: 0 });

                    const pending = Math.max(totals.totalTasks - totals.completedTasks, 0);
                    const courseCount = courses.length || 0;

                    return (
                        <Mytasks
                            totalTasks={totals.totalTasks}
                            pendingTasks={pending}
                            completedTasks={totals.completedTasks}
                            numberCourses={courseCount}
                        />
                    );
                })()}

                <header className="dashboard-header">
                    <h2 className="dashboard-title">My Courses</h2>

                    <div className="dashboard-actions">
                        <button className="add-btn" onClick={handleCreateClick}>+ Create Course</button>
                        <button className="join-btn" onClick={() => setShowJoin(true)}>+ Join Course</button>
                    </div>
                </header>

                <div className="Cards-container">
                    <section className="courses-grid">
                        {loading && <p>Loading courses...</p>}
                        {error && <p className="error">{error}</p>}
                        {!loading && !error && courses.length === 0 && <p>No courses found. Create or join a course.</p>}

                        {!loading && !error && courses.map((c) => (
                            <CourseCard
                                key={c._id}
                                title={c.name}
                                courseCode={c.courseCode}
                                totalTasks={c.taskCount || 0}
                                completedTasks={c.completedCount || 0}
                                onView={() => handleView(c)}
                                onDelete={() => handleDelete(c._id)}
                                onUpdate={(newName, newCode) => handleUpdate(c._id, newName, newCode)}
                            />))}
                    </section>
                </div>


                {showCreate && (
                    <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Create a Course</h3>
                            <form onSubmit={handleCreate} className="course-form">
                                <div className="form-group">
                                    <input
                                        className="course-input"
                                        placeholder="Course Code (ex, CS 150)"
                                        value={newCourseCode}
                                        onChange={(e) => setNewCourseCode(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        className="course-input"
                                        placeholder="Course Name (ex, Cloud Computing)"
                                        value={newCourseName}
                                        onChange={(e) => setNewCourseName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                                    <button type="submit" className="btn primary">{creating ? 'Creating...' : 'Create'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showNotif && (
                    <div className="notification">Error fetching courses</div>
                )}

                {createdCourse && (
                    <div className="modal-overlay" onClick={() => setCreatedCourse(null)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Course Created!</h3>
                            <p className='code-p'>Share this code with others to join the course:</p>
                            <div className="share-code">
                                <p className="share-code-text" >{createdCourse.code}</p>
                                <button className="code-copy" onClick={() => { navigator.clipboard.writeText(createdCourse.code); }}>Copy Code</button>
                            </div>
                            <div className="modal-actions">
                                <button className="btn primary" onClick={() => setCreatedCourse(null)}>Done</button>
                            </div>
                        </div>
                    </div>
                )}

                {showJoin && (
                    <div className="modal-overlay" onClick={() => setShowJoin(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Join a Course</h3>
                            <form onSubmit={handleJoin}>
                                <input
                                    placeholder="Enter course code"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    required
                                />
                                <div className="modal-actions">
                                    <button type="button" className="btn ghost" onClick={() => setShowJoin(false)}>Cancel</button>
                                    <button type="submit" className="btn primary">{joining ? 'Joining...' : 'Join'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showNotifErr_UpdateCourse && (
                    <Notification
                        message="Course code or name was not updated successfully."
                        type="error"
                    />
                )}

                {showNotifsuccess_UpdateCourse && (
                    <Notification
                        message="Course code or name updated successfully."
                        type="success"
                    />
                )}

                {showNotifErr_DeleteCourse && (
                    <Notification
                        message="Course was not deleted successfully."
                        type="error"
                    />
                )}

                {showNotifsuccess_DeleteCourse && (
                    <Notification
                        message="Course deleted successfully."
                        type="success"
                    />
                )}

                {showNotifErr_JoinCourse && (
                    <Notification
                        message="Failed to join course"
                        type="error"
                    />
                )}
                {showNotifsuccess_JoinCourse && (
                    <Notification
                        message="Successfully joined course!"
                        type="success"
                    />
                )}



            </main>
        </>
    );
}

export default Dashboard;