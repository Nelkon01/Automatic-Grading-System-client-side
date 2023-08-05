import axios from 'axios';
import { useRef, useEffect, useState } from 'react';

const baseUrl = 'http://127.0.0.1:8000/api/login';

function Login() {
    document.title = 'Login';

    const userRef = useRef();
    const errRef = useRef();
    const [login_id, setUser] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [login_id, password]);

    const signIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                baseUrl,
                JSON.stringify({ login_id: login_id, password: password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            const accessToken = response?.data?.token?.access_token;
            localStorage.setItem('accessToken', accessToken);
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else if (error.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (error.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        }
    };

    return (
        <>
            {success ? (
                <section className='container p-4'>
                    <h1 class='text-success'>You are logged in!</h1>
                    <br />
                    <p>{<a href='/'>Go to Home</a>}</p>
                </section>
            ) : (
                <section className='container p-4'>
                    <p
                        ref={errRef}
                        className={errMsg ? 'errmsg' : 'offscreen'}
                        aria-live='assertive'
                    >
                        {errMsg}
                    </p>

                    <form className='p-4' onSubmit={signIn}>
                        <h1 class='mb-4'>Log In</h1>
                        <div className='mt-3'>
                            <label for='username' class='form-label'>
                                Login ID/Email
                            </label>
                            <input
                                type='text'
                                id='username'
                                ref={userRef}
                                className='form-control'
                                autoComplete='off'
                                onChange={(e) => setUser(e.target.value)}
                                value={login_id}
                                required
                            />
                        </div>
                        <div className='mt-3'>
                            <label for='password' class='form-label'>
                                Password
                            </label>
                            <input
                                type='password'
                                id='password'
                                className='form-control'
                                onChange={(e) => setPwd(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        <button type='submit' className='btn btn-primary btn-lg mt-4'>Sign In</button>
                        <p className='mt-4'>
                            Need an Account?
                            <br />
                            <span className='line'>
                                <a href='/register'>Register</a>
                            </span>
                        </p>
                    </form>
                </section>
            )}
        </>
    );
}
export default Login;
