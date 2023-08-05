import axios from 'axios';
import { useEffect, useState } from 'react';

const LMSUrl = 'http://127.0.0.1:8000/api';
const token = localStorage.getItem('accessToken');

/** This component connects the allows the teacher user to
 * edit assignments in a course fetched from the autograder's server
 */
function Dashboard() {
    document.title = 'Dashboard';

    const [assignmentList, setAssignmentList] = useState([]);
    const [course, setCourse] = useState([]);

    /** Populates the DOM with courses on load */
    useEffect(() => {
        axios
            .get(LMSUrl + '/course/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setCourse(response.data);
            });
    }, []);

    // TODO
    const reuploadTestcases = (e) => {};
    // TODO
    const reuploadConfigFile = (e) => {};

    const deleteAssignment = (e) => {
        axios
            .delete(LMSUrl + '/course/assignment/' + e.target.value + '/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                window.location.reload();
            });
    };

    const fetchCourseAssignments = (e) => {
        axios
            .get(LMSUrl + '/course/' + e.target.value + '/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setAssignmentList(response.data);
            });
    };
    return (
        <div className='container p-4'>
            <h1>Dashboard</h1>

            <select
                onChange={fetchCourseAssignments}
                name='course'
                class='form-select form-select-lg mb-3'
                aria-label='Courses'
            >
                <option selected>Select Course</option>
                {course.map((item) => (
                    <option value={item.id}>
                        [{item.course_code}] {item.name}
                    </option>
                ))}
            </select>
            <ul className='list-group'>
                {assignmentList.map((item) => (
                    <li value={item.id} className='list-group-item'>
                        <div className='d-flex justify-content-between'>
                            <div
                                role='button'
                                data-bs-toggle='collapse'
                                href={'#card' + item.id}
                                aria-expanded='false'
                                aria-controls={'card' + item.id}
                            >
                                {item.name}
                            </div>
                            <div
                                class='btn-group btn-group-sm'
                                role='group'
                                aria-label='Edit buttons'
                            >
                                <button
                                    type='button'
                                    class='btn btn-primary'
                                    onClick={reuploadTestcases}
                                >
                                    Edit Testcases
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-secondary'
                                    onClick={reuploadConfigFile}
                                >
                                    Edit Config
                                </button>
                                <button
                                    value={item.id}
                                    type='button'
                                    class='btn btn-danger'
                                    onClick={deleteAssignment}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div class='collapse mt-3' id={'card' + item.id}>
                            <div class='card card-body'>{item.description}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
