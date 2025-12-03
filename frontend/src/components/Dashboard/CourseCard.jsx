import "./CourseCard.css";

function CourseCard({
    src = "https://placehold.co/600x400/white/black?text=3",
    title = "Course Title",
    courseCode = "x",
    tasks = 0,
    createdCourse = null,
    onView = () => { },
    onClick = () => { },
}) {
    return (
        <article className="card">
            <div className="card-media">
                <img className="card-img" src={src} alt={`${title} image`} />
            </div>

            <div className="card-body">
                <h4 className="card-title">{title}</h4>
                <p className="card-courseCode">{courseCode}</p>
                <p className="card-sub">{tasks} tasks</p>
                <p className="card-sub">Course Code: {createdCourse}</p>
                <div className="btns">
                    <button className="btn primary" onClick={onView}>View Course</button>
                    <button className="btn leave" onClick={onClick} style={{marginLeft: "2px"}}>Leave Course</button>
                </div>

            </div>
        </article>
    );
}

export default CourseCard;