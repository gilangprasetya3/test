import React from 'react';
import Form from 'react-bootstrap/Form';
import { Inertia } from '@inertiajs/inertia';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';

const closeActiveOffcanvas = () => {
    const closeButton = document.querySelector('.offcanvas.show .btn-close');
    if (closeButton) {
        closeButton.click();
    }
};

export default function StudentList({ csrf, studentdata, teacherdata, subjectdata, marklist, lembagaOptions }) {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [show, setShow] = React.useState(false);
    const tableRef = React.useRef(null);
    const dataTableRef = React.useRef(null);
    const filterStateRef = React.useRef({ nis: '', name: '', lembaga_id: '' });
    const lembagaMapRef = React.useRef({});

    const [filters, setFilters] = React.useState({
        nis: '',
        name: '',
        lembaga_id: '',
    });

    const [values, setValues] = React.useState({
        id: '',
        nis: '',
        name: '',
        age: '',
        gender: '',
        teacher_id: '',
        lembaga_id: '',
        _token: csrf,
    });
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        dispatch({ type: 'updatedStudents', payload: studentdata });
    }, [dispatch, studentdata]);

    React.useEffect(() => {
        dispatch({ type: 'updatedTeachers', payload: teacherdata });
    }, [dispatch, teacherdata]);

    React.useEffect(() => {
        dispatch({ type: 'updatedSubjects', payload: subjectdata });
    }, [dispatch, subjectdata]);

    React.useEffect(() => {
        dispatch({ type: 'updatedMarks', payload: marklist });
    }, [dispatch, marklist]);

    React.useEffect(() => {
        dispatch({ type: 'updatedLembagas', payload: lembagaOptions });
    }, [dispatch, lembagaOptions]);

    React.useEffect(() => {
        const map = {};
        store.lembagas.forEach((item) => {
            map[item.id] = item.name;
        });
        lembagaMapRef.current = map;
    }, [store.lembagas]);

    React.useEffect(() => {
        filterStateRef.current = filters;
        if (dataTableRef.current) {
            dataTableRef.current.draw();
        }
    }, [filters]);

    React.useEffect(() => {
        if (!tableRef.current) {
            return undefined;
        }

        if (dataTableRef.current) {
            dataTableRef.current.destroy();
        }

        dataTableRef.current = $(tableRef.current).DataTable({
            order: [[1, 'asc']],
            pageLength: 10,
        });

        return () => {
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }
        };
    }, [store.students]);

    React.useEffect(() => {
        const filterFn = function (settings, data) {
            const { nis, name, lembaga_id } = filterStateRef.current;
            const nisValue = (data[1] || '').toLowerCase();
            const nameValue = (data[2] || '').toLowerCase();
            const lembagaValue = (data[5] || '').toLowerCase();
            const selectedLembagaName = lembaga_id
                ? (lembagaMapRef.current[lembaga_id] || '').toLowerCase()
                : '';

            const matchesNis = nis ? nisValue.includes(nis.toLowerCase()) : true;
            const matchesName = name ? nameValue.includes(name.toLowerCase()) : true;
            const matchesLembaga = selectedLembagaName ? lembagaValue === selectedLembagaName : true;

            return matchesNis && matchesName && matchesLembaga;
        };

        $.fn.dataTable.ext.search.push(filterFn);

        return () => {
            $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter((fn) => fn !== filterFn);
        };
    }, []);

    function handleShow(student) {
        setValues({
            id: student.id,
            nis: student.nis,
            name: student.name,
            age: student.age,
            gender: student.gender,
            teacher_id: student.teacher_id ?? '',
            lembaga_id: student.lembaga_id ?? '',
            _token: csrf,
        });
        setErrors({});
        setShow(true);
    }

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        setValues((current) => ({
            ...current,
            [key]: value,
        }));
    }

    const handleClose = () => setShow(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        Inertia.post('/editStudent', values, {
            onSuccess: (resp) => {
                closeActiveOffcanvas();
                setShow(false);
                dispatch({
                    type: 'updatedStudents',
                    payload: resp.props.data,
                });
                setErrors({});
            },
            onError: (errorBag) => {
                setErrors(errorBag);
            },
        });
    };

    const handleDelete = async (event, student) => {
        event.preventDefault();
        if (!window.confirm(`Delete ${student.name}?`)) {
            return;
        }
        Inertia.post('/deleteStudent', { id: student.id }, {
            onSuccess: (resp) => {
                dispatch({
                    type: 'updatedStudents',
                    payload: resp.props.data,
                });
            },
        });
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({ nis: '', name: '', lembaga_id: '' });
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (filters.nis) params.append('nis', filters.nis);
        if (filters.name) params.append('name', filters.name);
        if (filters.lembaga_id) params.append('lembaga_id', filters.lembaga_id);

        const query = params.toString();
        window.location.href = `/students/export${query ? `?${query}` : ''}`;
    };

    return (
        <>
            <div className="flex flex-col gap-4 p-4 bg-white border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 uppercase tracking-wider">Student List</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Search NIS</label>
                        <input
                            type="text"
                            name="nis"
                            value={filters.nis}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="e.g. NIS-1001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Search Name</label>
                        <input
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Type student name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Filter Lembaga</label>
                        <select
                            name="lembaga_id"
                            value={filters.lembaga_id}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">All Lembaga</option>
                            {store.lembagas.map((lembaga) => (
                                <option value={lembaga.id} key={lembaga.id}>
                                    {lembaga.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end gap-2">
                        <Button variant="outline-secondary" onClick={resetFilters}>
                            Reset
                        </Button>
                        <Button variant="success" onClick={handleExport}>
                            Export Excel
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <table className="min-w-full leading-normal display" ref={tableRef}>
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                NIS
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Age
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Gender
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Lembaga
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Reporting Teacher
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.students.map((student) => (
                            <tr key={student.id}>
                                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{student.id}</p>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{student.nis}</p>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{student.name}</p>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{student.age}</p>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{student.gender}</p>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                        {student.lembaga?.name ?? '—'}
                                    </p>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                        {student.teacher_name ?? '—'}
                                    </p>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleShow(student)}
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(event) => handleDelete(event, student)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Edit Student</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form className="mt-5" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="editStudentNis">
                            <Form.Label>NIS</Form.Label>
                            <Form.Control
                                value={values.nis}
                                onChange={handleChange}
                                name="nis"
                                type="text"
                                placeholder="e.g. NIS-1001"
                            />
                            {errors.nis && <Form.Text className="text-danger">{errors.nis}</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editStudentName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                value={values.name}
                                onChange={handleChange}
                                name="name"
                                type="text"
                                placeholder="Enter a name"
                            />
                            {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editStudentAge">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                value={values.age}
                                onChange={handleChange}
                                name="age"
                                type="number"
                                min="5"
                                max="25"
                                placeholder="Enter age"
                            />
                            {errors.age && <Form.Text className="text-danger">{errors.age}</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editStudentGender">
                            <Form.Label>Gender</Form.Label>

                            <Form.Select
                                aria-label="Select a gender"
                                value={values.gender}
                                onChange={handleChange}
                                name="gender"
                            >
                                <option value="">Select a gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Select>
                            {errors.gender && <Form.Text className="text-danger">{errors.gender}</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editStudentLembaga">
                            <Form.Label>Lembaga</Form.Label>
                            <Form.Select
                                aria-label="Select a lembaga"
                                value={values.lembaga_id}
                                onChange={handleChange}
                                name="lembaga_id"
                            >
                                <option value="">Select a lembaga</option>
                                {store.lembagas.map((lembaga) => (
                                    <option value={lembaga.id} key={lembaga.id}>
                                        {lembaga.name}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.lembaga_id && <Form.Text className="text-danger">{errors.lembaga_id}</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editStudentTeacher">
                            <Form.Label>Reporting Teacher</Form.Label>

                            <Form.Select
                                aria-label="Select a teacher"
                                value={values.teacher_id}
                                onChange={handleChange}
                                name="teacher_id"
                            >
                                <option value="">Select a teacher</option>
                                {store.teachers.map((teacher) => (
                                    <option value={teacher.id} key={teacher.id}>
                                        {teacher.name}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.teacher_id && <Form.Text className="text-danger">{errors.teacher_id}</Form.Text>}
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Update student
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
