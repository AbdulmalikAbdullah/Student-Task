import "./CourseCard.css";
import '../Shared/Modal.css';
import { useState } from "react";

function CourseCard({
    title = "Course Title",
    courseCode = "x",
    totalTasks = 0,
    completedTasks = 0,
    onView = () => { },
    onDelete = () => { },
    onUpdate = () => { },
}) {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updatedName, setUpdatedName] = useState(title);
    const [updatedCode, setUpdatedCode] = useState(courseCode);

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const handleUpdateClick = () => {
        setUpdatedName(title);
        setUpdatedCode(courseCode);
        setShowUpdateModal(true);
    };

    const handleConfirmUpdate = () => {
        onUpdate(updatedName, updatedCode);
        setShowUpdateModal(false);
    };

    return (
        <>
            <article className="card">
                <div className="card-body">
                    <div className="code-badge">{courseCode}</div>
                    <h4 className="card-title">{title}</h4>

                    <div className="progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="progress-text">{progress}%</div>
                    </div>

                    <div className="stats-row">
                        <div className="stat-box">
                            <div className="stat-title">Total Tasks</div>
                            <div className="stat-value">{totalTasks}</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-title">Completed</div>
                            <div className="stat-value" style={{color: "#16a34a"}}>{completedTasks}</div>
                        </div>
                    </div>

                    <div className="card-actions">
                        <button className="btn primary" onClick={onView}>View Tasks</button>
                        <button className="btn secondary" onClick={handleUpdateClick}>Update</button>
                        <button className="btn leave" onClick={onDelete}>Delete</button>
                    </div>
                </div>
            </article>

            {showUpdateModal && (
                <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Update Course</h3>
                        <form className="course-form">
                            <div className="form-group">
                                <input
                                    className="course-input"
                                    placeholder="Course Code (ex, CS 150)"
                                    value={updatedCode}
                                    onChange={(e) => setUpdatedCode(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    className="course-input"
                                    placeholder="Course Name (ex, Cloud Computing)"
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                />
                            </div>
                        </form>
                        <div className="modal-actions">
                            <button className="btn ghost" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                            <button className="btn primary" onClick={handleConfirmUpdate}>Update</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CourseCard;