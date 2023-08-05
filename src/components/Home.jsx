import axios from 'axios';
import { useRef, useEffect, useState } from 'react';

const graderUrl = 'http://127.0.0.1:8000/api';
const LMSUrl = 'http://127.0.0.1:7000/api';
const token = localStorage.getItem('accessToken');

/** This component renders the submission page.
 * The submission information is fetched from autograder's server.
 * On successful grading the submission grade is sent to the LMS's server
 */
function Home() {
    document.title = 'Home';

    const errRef = useRef();

    const [errMsg, setErrMsg] = useState('');
    const [submissionSucces, setSuccess] = useState(false);
    const [course, setCourse] = useState([]);
    const [assignmentList, setAssignmentList] = useState([]);
    const [assignment, setAssignment] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [response, setResponse] = useState({});
    const [results, setResults] = useState({});

    /** Populates the DOM with courses on load */
    useEffect(() => {
        axios
            .get(graderUrl + '/course/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setCourse(response.data);
            });
    }, []);

    const refreshPage = () => {
        window.location.reload();
    };

    const uploadAssignmentCode = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const fetchCourseAssignments = (e) => {
        axios
            .get(graderUrl + '/course/' + e.target.value + '/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setAssignmentList(response.data);
            });
    };

    /** Post submission request to the autograder.
     * Then Post the response (grade) to the sublogger i.e. LMS
     */
    const submitAssignment = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('assignment_id', assignment);
        try {
            //Request to autograder
            const response = await axios({
                method: 'post',
                url: graderUrl + '/course/assignment/submission',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setResults(response.data.result);
            setResponse(response.data);
            setAssignmentList([]);
            setSelectedFile(null);
            setCourse([]);
            setSuccess(true);

            sendResToLMS(response);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Fields)');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Submission Failed');
            }
            errRef.current.focus();
        }
    };

    const sendResToLMS = async (response) => {
        // Submission grade
        const subResult = new FormData();
        subResult.append('assignment_id', assignment);
        subResult.append('user_id', response.data.user_id);
        subResult.append('posted_grade', response.data.grade);
        subResult.append('comment', JSON.stringify(response.data.result));

        try {
            //Request to simulated LMS (sublogger)
            const LMSres = await axios({
                method: 'post',
                url: LMSUrl + '/sublogger/',
                data: subResult,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(LMSres);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {submissionSucces ? (
                <section className='container mt-4 p-4'>
                    <h1 class='text-success'>Submission Successful! </h1>
                    <br />
                    <h3>Grade: {response.grade}</h3>
                    <ul className='list-group'>
                        {results.map((result) => (
                            <li className='list-group-item'>
                                <div>
                                    <strong>Testcase:</strong> {result.name}
                                </div>
                                <div>
                                    <strong>Weight:</strong> {result.weight}
                                </div>
                                <div>
                                    <strong>Grade:</strong> {result.grade}
                                </div>
                                <div>
                                    <strong>Message:</strong> <pre>{result.message}</pre>
                                </div>
                                <div>
                                    <strong>Extra outputs:</strong> {}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button
                        type='button'
                        onClick={refreshPage}
                        className='btn btn-primary btn-lg mt-4'
                    >
                        Submit again
                    </button>
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
                    <h1 className='container p-4'>Submit your Assignment</h1>
                    <form className='container p-4' onSubmit={submitAssignment}>
                        <select
                            onChange={fetchCourseAssignments}
                            name='assignment_id'
                            class='form-select form-select-lg mb-3'
                            aria-label='.form-select-lg example'
                        >
                            <option selected>Select Course</option>
                            {course.map((course) => (
                                <option value={course.id}>
                                    [{course.course_code}] {course.name}
                                </option>
                            ))}
                        </select>

                        <select
                            onChange={(e) => setAssignment(e.target.value)}
                            name='assignment_id'
                            class='form-select form-select-lg mb-3'
                            aria-label='.form-select-lg example'
                        >
                            <option selected>Select Assignment</option>
                            {assignmentList.map((ass) => (
                                <option value={ass.id}>{ass.name}</option>
                            ))}
                        </select>

                        <label for='formFileLg' className='form-label mt-4'>
                            Upload your assignment code
                        </label>
                        <input
                            onChange={uploadAssignmentCode}
                            className='form-control form-control-lg w-50 '
                            id='formFileLg'
                            type='file'
                        />
                        <button className='btn btn-primary mt-4 btn-lg'>Submit Assignment</button>
                    </form>
                </section>
            )}
        </>
    );
}

export default Home;
