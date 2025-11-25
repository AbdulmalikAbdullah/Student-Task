import "./Nav.css";

function Nav() {
    return (
        <>
            <div className="nav-container">
                <nav className="nav-bar">
                    <div><a href="#">Home</a></div>
                    <div><a href="#">FeedBack</a></div>

                    {/* concave shape */}
                    <div className="concave"></div>

                    <div><a href="#">Dashboard</a></div>
                    <div><a href="#">Login</a></div>
                </nav>

                {/* floating center button */}
                <div className="center-button">+</div>
            </div>
        </>
    );
}

export default Nav;
