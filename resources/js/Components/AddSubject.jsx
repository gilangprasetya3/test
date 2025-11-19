import React from 'react';
import Form from 'react-bootstrap/Form';
import { Inertia } from '@inertiajs/inertia'
import { useDispatch } from "react-redux";
import { ButtonGroup, Button } from "react-bootstrap";
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
        document.getElementsByClassName("btn-close")[0].click();
    Inertia.post('/addSubject', values,{onSuccess: (resp) => {
console.log( res.props.data);
dispatch({
    type: "updatedStudents",payload:res.props.data
  });

    }})
        
      
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
