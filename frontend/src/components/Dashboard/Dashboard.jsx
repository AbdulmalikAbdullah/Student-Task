import "./Dashboard.css";
import CourseCard from "./CourseCard.jsx";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [newCourseName, setNewCourseName] = useState("");
    const [creating, setCreating] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [joining, setJoining] = useState(false);
    const [createdCourse, setCreatedCourse] = useState(null);
    const navigate = useNavigate();

    // fetchCourses is extracted so we can call it after creating a course
    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/courses/my-courses");
            setCourses(res.data || []);
        } catch (err) {
            console.error("fetch courses error", err);
            setError(err.response?.data?.msg || err.message || "Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleView = (course) => {
        // navigate to course page
        navigate(`/course/${course._id}`);
    };

    const handleCreateClick = () => setShowCreate(true);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCourseName.trim()) return;
        setCreating(true);
        try {
            const res = await api.post("/courses/create", { name: newCourseName.trim() });
            setCreatedCourse(res.data); // store to show code copy modal
            setNewCourseName("");
            setShowCreate(false);
            await fetchCourses();
        } catch (err) {
            console.error('create course error', err);
            alert(err.response?.data?.msg || 'Failed to create course');
        } finally {
            setCreating(false);
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
            alert("Successfully joined course!");
        } catch (err) {
            console.error('join course error', err);
            alert(err.response?.data?.msg || 'Failed to join course');
        } finally {
            setJoining(false);
        }
    };

    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <h2 className="dashboard-title">My Courses</h2>

                <div className="dashboard-actions">
                    <button className="add-btn" onClick={handleCreateClick}>+ Create Course</button>
                    <button className="add-btn" onClick={() => setShowJoin(true)} style={{backgroundColor: '#28a745'}}>+ Join Course</button>
                </div>
            </header>

            <section className="courses-grid">
                {loading && <p>Loading courses...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && courses.length === 0 && <p>No courses found. Create or join a course.</p>}

                {!loading && !error && courses.map((c) => (
                    <CourseCard key={c._id} src={c.image || `https://placehold.co/600x400/333/fff?text=${encodeURIComponent(c.name)}`} title={c.name} tasks={c.taskCount || 0} createdCourse={c.code} onView={() => handleView(c)} />
                ))}
            </section>

            {showCreate && (
                <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Create a Course</h3>
                        <form onSubmit={handleCreate}>
                            <input
                                placeholder="Course name"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                                required
                            />
                            <div className="modal-actions">
                                <button type="button" className="btn ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                                <button type="submit" className="btn primary">{creating ? 'Creating...' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {createdCourse && (
                <div className="modal-overlay" onClick={() => setCreatedCourse(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Course Created!</h3>
                        <p>Share this code with others to join the course:</p>
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
        </main>
    );
}

export default Dashboard;