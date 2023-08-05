import React from 'react';

function Footer() {
    return (
        <footer className='py-3 my-4'>
            <ul class='nav justify-content-center border-bottom pb-3 mb-3 dark'>
                <li class='nav-item'>
                    <a href='/' class='nav-link px-2 text-muted'>
                        Home
                    </a>
                </li>
                <li class='nav-item'>
                    <a href='/login' class='nav-link px-2 text-muted'>
                        Login
                    </a>
                </li>
                <li class='nav-item'>
                    <a href='/register' class='nav-link px-2 text-muted'>
                        Register
                    </a>
                </li>
                <li class='nav-item'>
                    <a href='/dashboard' class='nav-link px-2 text-muted'>
                        Dashboard
                    </a>
                </li>
            </ul>
            <p class='text-center text-muted'>Autograder</p>
        </footer>
    );
}

export default Footer;
