import "./CoursesBox.css"
import CourseCard from "../Dashboard/CourseCard.jsx"

function CoursesBox() {
    return (
        <div className="container">
            <div className="couresCard">
                {/* <h3>Courses List</h3> */}
                <CourseCard />
                <CourseCard />
                <CourseCard />
            </div>

            <div className="notificationSide">
                <h3>Notification List</h3>
            </div>
        </div>
    )
}

export default CoursesBox