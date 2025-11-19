import React from 'react';
import Form from 'react-bootstrap/Form';
import { Inertia } from '@inertiajs/inertia';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const closeActiveOffcanvas = () => {
    const closeButton = document.querySelector('.offcanvas.show .btn-close');
    if (closeButton) {
        closeButton.click();
    }
};

export default function EnterMarks({csrf,teachers,subjects}) {

    const dispatch = useDispatch();
    const store = useSelector(state => state);

    var resultsub = store.subjects.map(function(a) {return a.id;});
    var subnames=Object.keys(resultsub).reduce(function(obj, key) {
        obj[resultsub[key]] = "";
        return obj;
      }, {});

    const [values, setValues] = React.useState({
        ...subnames,
        student: "",
        term: "",
    
      })

      function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        console.log(value);
        setValues(values => ({
            ...values,
            [key]: value,
        }))
        //console.log(values);
      }

      const handleSubmit = async (event) => {
        event.preventDefault();
        Inertia.post('/addMarks', values,{onSuccess: (resp) => {
  closeActiveOffcanvas();
  console.log( resp.props.data);
  dispatch({
      type: "updatedStudents",payload:resp.props.data
    });

      }})
      }
    return (
       <>
       <h2>Enter Marks</h2>
       
        <Form className='mt-5' onSubmit={handleSubmit}>

<Form.Group className="mb-3" controlId="formBasicEmail">
 
 
       <Form.Label>Student</Form.Label>
       <Form.Select aria-label="Select a student" value={values.student} onChange={handleChange}  name="student">
      <option>Select a student</option>
{store.students.map((student) => (
      <option value={student.id}>{student.name}</option>
      
))
}
    </Form.Select>
     </Form.Group>
     <Form.Group className="mb-3" controlId="formBasicEmail">
       <Form.Label>Term</Form.Label>
       <Form.Select  aria-label="Select a term"value={values.term} onChange={handleChange}  name="term">
      <option>Select a term</option>

      <option value="One">One</option>
      <option value="Two">Two</option>

    </Form.Select>
     </Form.Group>

     <Form.Group className="mb-3" controlId="formBasicEmail">
    
     {store.subjects.map((subject) => (
        <p className='  '><Form.Label className='mr-5'>{subject.name}</Form.Label>  <Form.Control value={values[subject.id]} onChange={handleChange} name={subject.id} type="text" placeholder={"Enter a mark for "+subject.name }/>
        </p>
      
      
))
}
    

     </Form.Group>
     
     <Button variant="primary" type="submit">
       Update 
     </Button>
   </Form>
       </>
    );
}
