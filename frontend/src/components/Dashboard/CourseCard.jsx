import "./CourseCard.css";
import '../Shared/Modal.css';
import { useState } from "react";

function CourseCard({
    src = "https://placehold.co/600x400/EEE/31343C",
    title = "Course Title",
    courseCode = "x",
    tasks = 0,
    createdCourse = null,
    onView = () => { },
    onDelete = () => { },
    onUpdate = () => { },
}) {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updatedName, setUpdatedName] = useState(title);

    const handleUpdateClick = () => {
        setUpdatedName(title);
        setShowUpdateModal(true);
    };

    const handleConfirmUpdate = () => {
        onUpdate(updatedName);
        setShowUpdateModal(false);
    };

    return (
        <>
            <article className="card">
                <div className="card-media">
                    <img className="card-img" src={src} alt={`${title} image`} />
                </div>

                <div className="card-body">
                    <h4 className="card-title">{title}</h4>
                    <p className="card-courseCode">{courseCode}</p>
                    <p className="card-sub">{tasks} tasks</p>
                    <p className="card-sub">Course Code: {createdCourse}</p>
                    <div className="card-actions">
                        <button className="btn primary" onClick={onView}>View</button>
                        <button className="btn secondary" onClick={handleUpdateClick}>Update</button>
                        <button className="btn leave" onClick={onDelete}>Delete</button>
                    </div>
                </div>
            </article>

            {showUpdateModal && (
                <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Update Course Name</h3>
                        <input
                            placeholder="Course name"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                        />
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