import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <div className=''>
            <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
                <div className='container'>
                    <Link className='navbar-brand' to='/login'>
                        <h3>Autograder</h3>
                    </Link>
                    <button
                        className='navbar-toggler'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarNav'
                        aria-controls='navbarNav'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                    >
                        <span class='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarNav'>
                        <div className='navbar-nav ms-auto'>
                            <Link to='/' className='nav-link' aria-current='page'>
                                Home
                            </Link>
                            <Link className='nav-link' to='/login'>
                                Login
                            </Link>
                            <Link className='nav-link' to='/register'>
                                Register
                            </Link>
                            <li className='nav-item dropdown'>
                                <a
                                    className='nav-link dropdown-toggle'
                                    href='/#'
                                    id='navbarDropdown'
                                    role='button'
                                    data-bs-toggle='dropdown'
                                    aria-expanded='false'
                                >
                                    Instructor
                                </a>
                                <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                                    <li>
                                        <Link className='dropdown-item' to='/dashboard'>
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className='dropdown-item' to='/assignment'>
                                            Create Assignment
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link className='nav-link' to='/logout'>
                                    Logout
                                </Link>
                            </li>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default NavBar;
