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
export default function AddTeacher({csrf}) {

    const dispatch = useDispatch();
    const [values, setValues] = React.useState({
        name: "",
        age: "",
        gender: "",
        reporting_teacher:'',
        _token: csrf,
      })

      function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        console.log(value);
        setValues(values => ({
            ...values,
            [key]: value,
        }))
      }

      const handleSubmit = async (event) => {
        event.preventDefault();
    Inertia.post('/addTeacher', values,{
        onSuccess: (resp) => {
            closeActiveOffcanvas();
            dispatch({
                type: "updatedTeachers",payload:resp.props.teachers ?? resp.props.data ?? [],
              });
        }
    })
      }
    return (
       <>
       <h2>Add a teacher</h2>
       
        <Form className='mt-5' onSubmit={handleSubmit}>

<Form.Group className="mb-3" controlId="formBasicEmail">
 
 
       <Form.Label>Name</Form.Label>
       <Form.Control value={values.name} onChange={handleChange} name="name" type="text" placeholder="Enter a name " />
       
     </Form.Group>
     <Form.Group className="mb-3" controlId="formBasicEmail">
       <Form.Label>Age</Form.Label>
       <Form.Control value={values.age} onChange={handleChange} name="age" type="text" placeholder="Enter age" />
       
     </Form.Group>

     <Form.Group className="mb-3" controlId="formBasicPassword">
       <Form.Label>Gender</Form.Label>
       <Form.Select  aria-label="Select a gender"value={values.gender} onChange={handleChange}  name="gender">
      <option>Select a gender</option>

      <option value="Male">Male</option>
      <option value="Female">Female</option>

    </Form.Select>

      
          </Form.Group>
    
     
     
     <Button variant="primary" type="submit">
       Add teacher
     </Button>
   </Form>
       </>
    );
}
