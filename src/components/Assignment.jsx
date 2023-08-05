import axios from 'axios';
import { useRef, useEffect, useState } from 'react';

const baseUrl = 'http://127.0.0.1:8000';
const token = localStorage.getItem('accessToken');

/** Collects input from the user as form data
 *  to create a new assignment via POST to the server
 */
function Assignment() {
    const userRef = useRef();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    //Assignment properties
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [course_id, setCourse] = useState('');
    const [courseList, setCourseList] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [configFile, setConfigFile] = useState(null);

    /** Populates the DOM with courses on load */
    useEffect(() => {
        axios
            .get(baseUrl + '/api/course/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setCourseList(response.data);
            });
    }, []);

    const uploadTestcases = (event) => {
        setSelectedFiles(event.target.files);
    };

    const uploadConfigFiles = (event) => {
        setConfigFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('course_id', course_id);
        for (let file of selectedFiles) {
            formData.append('testcase', file);
        }
        formData.append('config', configFile);

        try {
            const response = await axios({
                method: 'post',
                url: baseUrl + '/api/course/assignment',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const accessToken = response?.data?.token?.access_token;
            localStorage.setItem('accessToken', accessToken);

            setName('');
            setDesc('');
            setCourse('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Fields)');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Assignment Creation Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <>
            {success ? (
                <section>
                    <h1 class='text-success p-4'>Assignment Created</h1>
                    <br />
                    <p>{<a href='/dashboard'>Go to Home</a>}</p>
                </section>
            ) : (
                <section>
                    <p
                        class='text-success'
                        ref={errRef}
                        className={errMsg ? 'errmsg' : 'offscreen'}
                        aria-live='assertive'
                    >
                        {errMsg}
                    </p>
                    <h1 className='container p-4'>Create Assignment</h1>
                    <form
                        className='container p-4'
                        onSubmit={handleSubmit}
                        encType='multipart/form-data'
                    >
                        <select
                            onChange={(e) => setCourse(e.target.value)}
                            name='assignment_id'
                            class='form-select form-select-lg mb-3'
                            aria-label='course'
                        >
                            <option selected>Select Course</option>
                            {courseList.map((item) => (
                                <option value={item.id}>
                                    [{item.course_code}] {item.name}
                                </option>
                            ))}
                        </select>
                        <label className='mt-3' htmlFor='name'>
                            Assignment Name:
                        </label>
                        <input
                            type='text'
                            id='name'
                            ref={userRef}
                            className='form-control mt-2'
                            autoComplete='off'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                        <label className='mt-3' htmlFor='description'>
                            Assignment description:
                        </label>
                        <textarea
                            id='description'
                            className='form-control mt-2'
                            onChange={(e) => setDesc(e.target.value)}
                            value={description}
                            required
                        />
                        <label for='formFileLg' className='form-label mt-4'>
                            Add testcase files
                        </label>
                        <input
                            onChange={uploadTestcases}
                            className='form-control form-control-lg w-50 '
                            id='formFileLg'
                            type='file'
                            multiple
                        />
                        <label for='formFileLg' className='form-label mt-4'>
                            Add Config file
                        </label>
                        <input
                            onChange={uploadConfigFiles}
                            className='form-control form-control-lg w-50 '
                            id='formFileLg'
                            type='file'
                        />
                        <button className='btn btn-primary mt-4'>Create Assignment</button>
                    </form>
                </section>
            )}
        </>
    );
}
export default Assignment;
