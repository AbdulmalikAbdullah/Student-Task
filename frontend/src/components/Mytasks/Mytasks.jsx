import "./Mytasks.css";

function Mytasks({ totalTasks, pendingTasks, completedTasks, numberCourses }) {
    return (
        <><div className="myTasks-container">
            <div className="myTasks-header">
                <h1 className="header-h1">My Tasks</h1>
                <h4 className="header-h4">Manage all your academic tasks across courses in one place</h4>
            </div>

            <div className="myTasks-boxes">
                <div className="total-Tasks">
                    <span className="sub-tilte"><strong>Total Tasks</strong></span><br />
                    <span className="sub-count" style={{color:"#black"}}><strong >{totalTasks}</strong></span>
                </div>

                <div className="pending-Tasks">
                    <span className="sub-tilte"><strong>Pendings</strong></span><br />
                    <span className="sub-count" style={{color:"#d97706"}}><strong >{pendingTasks}</strong></span>
                </div>
                <div className="completed-Tasks">
                    <span className="sub-tilte"><strong>Completed</strong></span><br />
                    <span className="sub-count" style={{color:"#16a34a"}}><strong >{completedTasks}</strong></span>
                </div>
                <div className="number-Courses">
                    <span className="sub-tilte"><strong>Courses</strong></span><br />
                    <span className="sub-count" style={{color:"#black"}}><strong >{numberCourses}</strong></span>
                </div>
            </div>
        </div>
        </>
    );
}

export default Mytasks;