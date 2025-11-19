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
export default function AddSubject({csrf}) {

    const dispatch = useDispatch();
    const [values, setValues] = React.useState({
        name: "",
        
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
    Inertia.post('/addSubject', values,{
        onSuccess: (resp) => {
            closeActiveOffcanvas();
            dispatch({
                type: "updatedSubjects",payload:resp.props.subjects ?? resp.props.data ?? [],
              });
        }
    })
      }
    return (
       <>
       <h2>Add a subject</h2>
       
        <Form className='mt-5' onSubmit={handleSubmit}>

<Form.Group className="mb-3" controlId="formBasicEmail">
 
 
       <Form.Label>Name</Form.Label>
       <Form.Control value={values.name} onChange={handleChange} name="name" type="text" placeholder="Enter a name " />
       
     </Form.Group>
     
     <Button variant="primary" type="submit">
       Add subject
     </Button>
   </Form>
       </>
    );
}
