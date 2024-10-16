import { Link } from "react-router-dom";



const NavBar = ({ user, handleSignout }) => {
    return (
        <header>
        { user ? (
            <nav>
                <div className='navbar'>
                    <div className="logo">
                        <Link to='/'>
                            <img src='https://www.shutterstock.com/image-vector/colorful-creative-palm-children-education-600nw-1033656985.jpg' alt="logo"></img>
                        </Link>
                    </div>
                    <Link to='/'>Home</Link>
                    <Link to='/childs'>Add Child</Link>
                    <Link to='/newsfeeds'>Class Feed</Link>
                    <Link to='' onClick={handleSignout}>Sign Out</Link>
                </div>
            </nav>
        ) : (
            <nav>
                <div className='navbar'>
                <li><Link to='/signin'>Sign In</Link></li>
                <li><Link to='/signup'>Sign Up</Link></li>
                </div>
            </nav>
        )}
        </header>
    )
}
export default NavBar;