import axios from 'axios';
import { useEffect, useState, useRef } from 'react';

const baseUrl = 'http://127.0.0.1:8000/api/register';

function Register() {
    document.title = 'Register';

    const errRef = useRef();

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, []);

    const [userData, setUserData] = useState({
        name: '',
        login_id: '',
        password: '',
        role: '',
    });

    /** Sets registration data while user types */
    const handleChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value,
        });
    };

    //TODO
    const connectLMS = async () => {};
    const registerUser = async (e) => {
        e.preventDefault();

        const userFormData = new FormData();
        userFormData.append('name', userData.name);
        userFormData.append('login_id', userData.login_id);
        userFormData.append('password', userData.password);
        userFormData.append('role', userData.role);
        try {
            const response = await axios.post(baseUrl, userFormData, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response);
            setSuccess(true);
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else if (error.response?.status === 400) {
                setErrMsg('Missing Fields)');
            } else if (error.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <div>
            {success ? (
                <section className='container p-4'>
                    <h1 class='text-success p-4'>You are logged in!</h1>
                    <br />
                    <p>
                        <a href='/'>Go to Home</a>
                        {(window.location.href = '/')}
                    </p>
                </section>
            ) : (
                <section className='container p-4'>
                    <p
                        ref={errRef}
                        className={errMsg ? 'errmsg' : 'offcanvas'}
                        aria-live='assertive'
                    >
                        {errMsg}
                    </p>
                    <form className='p-4' onSubmit={connectLMS}>
                        <h1 class='mb-4'>Register</h1>
                        <div className='mb-3'>
                            <label for='name' className='form-label'>
                                Name
                            </label>
                            <input
                                value={userData.name}
                                onChange={handleChange}
                                name='name'
                                type='text'
                                className='form-control'
                                id='name'
                                aria-describedby='emailHelp'
                            />
                            <div id='emailHelp' className='form-text'>
                                Full Name not required
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label for='email' className='form-label'>
                                Email/Login Id
                            </label>
                            <input
                                value={userData.login_id}
                                onChange={handleChange}
                                name='login_id'
                                type='email'
                                className='form-control'
                                id='email'
                                aria-describedby='emailHelp'
                            />
                            <div id='emailHelp' className='form-text'>
                                Authenticate with your LMS instead
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label for='password' className='form-label'>
                                Password
                            </label>
                            <input
                                value={userData.password}
                                onChange={handleChange}
                                name='password'
                                type='password'
                                className='form-control'
                                id='password'
                            />
                        </div>
                        <div className='mb-3'>
                            <label for='password' className='form-label'>
                                Role
                            </label>
                            <select
                                onChange={handleChange}
                                value={userData.role}
                                name='role'
                                class='form-select form-select mb-3'
                                aria-label='user role'
                            >
                                <option selected>Select role</option>
                                <option key='teacher' value='2'>
                                    Teacher
                                </option>
                                <option key='student' value='3'>
                                    Student
                                </option>
                            </select>
                        </div>
                        <button
                            onClick={registerUser}
                            type='submit'
                            className='btn btn-primary mt-4'
                        >
                            Register
                        </button>
                        <button type='submit' className='btn btn-primary mt-4 ms-4'>
                            Sign up with your LMS
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
}
export default Register;
