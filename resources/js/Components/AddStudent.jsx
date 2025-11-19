import React from 'react';
import Form from 'react-bootstrap/Form';
import { Inertia } from '@inertiajs/inertia';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';

const closeActiveOffcanvas = () => {
    const closeButton = document.querySelector('.offcanvas.show .btn-close');
    if (closeButton) {
        closeButton.click();
    }
};

export default function AddStudent({ csrf, teachers, lembagas }) {
    const dispatch = useDispatch();
    const initialForm = React.useMemo(() => ({
        nis: '',
        name: '',
        age: '',
        gender: '',
        teacher_id: '',
        lembaga_id: '',
        _token: csrf,
    }), [csrf]);

    const [values, setValues] = React.useState(initialForm);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        setValues(initialForm);
    }, [initialForm]);

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        setValues((current) => ({
            ...current,
            [key]: value,
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        Inertia.post('/addStudent', values, {
            onSuccess: (resp) => {
                closeActiveOffcanvas();
                dispatch({
                    type: 'updatedStudents',
                    payload: resp.props.data,
                });
                setValues(initialForm);
                setErrors({});
            },
            onError: (errorBag) => {
                setErrors(errorBag);
            },
        });
    };

    return (
        <>
            <h2>Add a student</h2>

            <Form className="mt-5" onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="studentNis">
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

                <Form.Group className="mb-3" controlId="studentName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        value={values.name}
                        onChange={handleChange}
                        name="name"
                        type="text"
                        placeholder="Enter full name"
                    />
                    {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="studentAge">
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

                <Form.Group className="mb-3" controlId="studentGender">
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

                <Form.Group className="mb-3" controlId="studentLembaga">
                    <Form.Label>Lembaga</Form.Label>
                    <Form.Select
                        aria-label="Select a lembaga"
                        value={values.lembaga_id}
                        onChange={handleChange}
                        name="lembaga_id"
                    >
                        <option value="">Select a lembaga</option>
                        {lembagas.map((lembaga) => (
                            <option value={lembaga.id} key={lembaga.id}>
                                {lembaga.name}
                            </option>
                        ))}
                    </Form.Select>
                    {errors.lembaga_id && <Form.Text className="text-danger">{errors.lembaga_id}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="studentTeacher">
                    <Form.Label>Reporting Teacher (optional)</Form.Label>

                    <Form.Select
                        aria-label="Select a teacher"
                        value={values.teacher_id}
                        onChange={handleChange}
                        name="teacher_id"
                    >
                        <option value="">Select a teacher</option>
                        {teachers.map((teacher) => (
                            <option value={teacher.id} key={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </Form.Select>
                    {errors.teacher_id && <Form.Text className="text-danger">{errors.teacher_id}</Form.Text>}
                </Form.Group>

                <Button variant="primary" type="submit">
                    Add student
                </Button>
            </Form>
        </>
    );
}
