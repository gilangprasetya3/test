import React from 'react';
import Form from 'react-bootstrap/Form';
import { Inertia } from '@inertiajs/inertia'
import Offcanvas from 'react-bootstrap/Offcanvas';

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ButtonGroup, Button } from "react-bootstrap";
export default function StudentList({csrf,studentdata,teacherdata,subjectdata,marklist}) {
 
    const dispatch = useDispatch();
    const [show, setShow] = React.useState(false);
    const store = useSelector(state => state);
    const [students, setStudents] = React.useState(studentdata);

    const [values, setValues] = React.useState({
        name: "",
        age: "",
        gender: "",
        reporting_teacher:'',
        _token: csrf,
      });

function handleShow(student)  {
        
        setValues(student);
        setShow(true);
    
    };
    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        console.log(value);
        setValues(values => ({
            ...values,
            [key]: value,
        }))
      }
    
    const handleClose = () => setShow(false);



    const handleSubmit = async (event) => {
        event.preventDefault();
        document.getElementsByClassName("btn-close")[0].click();
        Inertia.post('/editStudent', values,{onSuccess: (resp) => {
            console.log( res.props.data);
            dispatch({
                type: "updatedStudents",payload:res.props.data
              });
            
                }})
    }
    const handleDelete = async (event,student) => {
        event.preventDefault();
      console.log(student);
        Inertia.post('/deleteStudent',{id:student.id},{onSuccess: (resp) => {
            console.log( res.props.data);
            dispatch({
                type: "updatedStudents",payload:res.props.data
              });
            
                }})
    }
    React.useEffect(() => {
         

    if(store.students.length<1)
    {
        dispatch({
            type: "updatedStudents",payload:studentdata
          });
    }
    if(store.teachers.length<1)
    {
        dispatch({
            type: "updatedTeachers",payload:teacherdata
          });
    }
    if(store.subjects.length<1)
    {
        dispatch({
            type: "updatedSubjects",payload:subjectdata
          });
    }
    if(store.marks.length<1)
    {
        dispatch({
            type: "updatedMarks",payload:marklist
          });
    }
     },[store]);
    
    return (
       <>
       <h2 className='px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xl font-semibold text-gray-700 uppercase tracking-wider'>Student List</h2>
       <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            ID
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
              Reporting Teacher
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody>

{
     store.students.map((student) => (
          <tr key={student.id}>
            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
             
                  <p className="text-gray-900 whitespace-no-wrap">
                   {student.id}
                  </p>
          
            </td>
            <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
           
              <p className="text-gray-900 whitespace-no-wrap">
               {student.name}
              </p>
             
            
            </td>
            <td className="px-5  py-3 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
               {student.age}
              </p>
             
            </td>
            <td className="px-5  py-3  border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
               {student.gender}
              </p>
            </td>
            <td className="px-5  py-3  border-b border-gray-200 bg-white text-sm  ">
            <p className="text-gray-900 whitespace-no-wrap">
            {student.teacher_name}
              </p>
            </td>
            <td className="px-5  py-3  border-b border-gray-200 bg-white text-sm  ">
            <p className="text-gray-900 whitespace-no-wrap">
            <button onClick={() =>handleShow(student)}   class="bg-green-500 hover:bg-blue-700 text-white font-bold mr-2 py-2 px-4 rounded">

Edit
</button>
<button   onClick={(event) =>handleDelete(event,student)}  class="bg-red-500 hover:bg-blue-700 text-white font-bold mr-2 py-2 px-4 rounded">

Delete
</button>
              </p>
            </td>
          </tr>
    ))

}

        </tbody>
      </table>
      <Offcanvas show={show} onHide={handleClose} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
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

       <Form.Select  aria-label="Select a gender" value={values.gender} onChange={handleChange}  name="gender">
      <option>Select a gender</option>

      <option value="Male">Male</option>
      <option value="Female">Female</option>

    </Form.Select>

       </Form.Group>
    
     <Form.Group className="mb-3" controlId="formBasicPassword">
       <Form.Label>Reporting Teacher</Form.Label>
      
       <Form.Select aria-label="Select a teacher" value={values.teacher_id} onChange={handleChange}  name="teacher_id">
      <option>Select a teacher</option>
{store.teachers.map((teacher) => (
      <option value={teacher.id}>{teacher.name}</option>
      
))
}
    </Form.Select>
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
