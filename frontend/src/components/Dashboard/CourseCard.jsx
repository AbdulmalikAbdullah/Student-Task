import "./CourseCard.css";

function CourseCard({
    src = "https://placehold.co/600x400/EEE/31343C",
    title = "CS 350",
    tasks = 0,
    createdCourse = null,
    onView = () => {},
}) {
    return (
        <article className="card">
            <div className="card-media">
                <img className="card-img" src={src} alt={`${title} image`} />
            </div>

            <div className="card-body">
                <h4 className="card-title">{title}</h4>
                <p className="card-sub">{tasks} tasks</p>
                <p className="card-sub">Course Code: {createdCourse}</p>
                <button className="btn primary" onClick={onView}>View Course</button>
            </div>
        </article>
    );
}

export default CourseCard;