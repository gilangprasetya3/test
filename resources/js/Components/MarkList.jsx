import React from 'react';
import Form from 'react-bootstrap/Form';
import { Inertia } from '@inertiajs/inertia';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';

const closeActiveOffcanvas = () => {
    const closeButton = document.querySelector('.offcanvas.show .btn-close');
    if (closeButton) {
        closeButton.click();
    }
};
export default function MarkList({csrf,studentdata,teacherdata,subjectdata,marklist}) {
 
    const dispatch = useDispatch();
    const [show, setShow] = React.useState(false);
    const store = useSelector(state => state);
    const [students, setStudents] = React.useState(studentdata);

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

function handleShow(mark)  {
        console.log(mark);
        var newObj = {};
        for (var i = 0; i < mark.length; i++) {
          newObj[mark[i].subject_id] = mark[i].mark;
          newObj['term'] = mark[i].term;
          newObj['student'] = mark[i].student_id;
        }
        console.log(newObj);
        setValues(newObj);
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
      Inertia.post('/editMark', values,{onSuccess: (resp) => {
closeActiveOffcanvas();
dispatch({
    type: "updatedStudents",payload:resp.props.data
  });

    }})
        
      
    }
    const handleDelete = async (event,mark) => {
        event.preventDefault();
       
        Inertia.post('/deleteMarks',{id:mark[0].student_id,term:mark[0].term},{onSuccess: (resp) => {
            dispatch({
                type: "updatedStudents",payload:resp.props.data
              });
            
                }})
    }
    
    return (
       <>
        <h2 className='px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xl font-semibold text-gray-700 uppercase tracking-wider'>Mark List</h2>
      
       <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            ID
            </th>
            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Name
            </th>
            {store.subjects.map((subject) => (
        
      
        <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
       {subject.name}
        </th>
))
}



            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Term
            </th>

            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Total Marks
            </th>
            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Created On
            </th>
            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
             Action
            </th>
          </tr>
        </thead>
        <tbody>

{
     store.marks.map((mark) => (<>
        {mark.length>0?
          <tr key={mark[0].id}>
            <td className="px-2 py-3 border-b border-gray-200 bg-white text-sm">
             
                  <p className="text-gray-900 whitespace-no-wrap">
                   {mark[0].id}
                  </p>
          
            </td>
            <td className="px-2 py-3 border-b border-gray-200 bg-white text-sm">
           
              <p className="text-gray-900 whitespace-no-wrap">
               {mark[0].student_name}
              </p>
             
            
            </td>
           {mark.map((marksub) => (

            <td className="px-2  py-3 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
              {marksub.mark}
              </p>
             
            </td>
           ))
           }


            <td className="px-2  py-3  border-b border-gray-200 bg-white text-sm  ">
            <p className="text-gray-900 whitespace-no-wrap">
            {mark[0].term}
              </p>
            </td>
            <td className="px-2  py-3  border-b border-gray-200 bg-white text-sm  ">
            <p className="text-gray-900 whitespace-no-wrap">
            
            {mark[0].term=='One'?mark[0].total_marks_term_one:mark[0].total_marks_term_two}
              </p>
            </td>
            <td className="px-2  py-3  border-b border-gray-200 bg-white text-sm  ">
            <p className="text-gray-900 whitespace-no-wrap">
            {mark[0].formatted_date}
              </p>
            </td>
            
            <td className="px-2  py-3  border-b border-gray-200 bg-white text-sm  ">
            <p className="text-gray-900 whitespace-no-wrap">
            <button onClick={() =>handleShow(mark)}   class="bg-green-500 hover:bg-blue-700 text-white font-bold mr-2 py-2 px-4 rounded">

Edit
</button>
<button   onClick={(event) =>handleDelete(event,mark)}  class="bg-red-500 hover:bg-blue-700 text-white font-bold mr-2 py-2 px-4 rounded">

Delete
</button>
              </p>
            </td>
          </tr>
        :null  }
          </>
    ))
        
}

        </tbody>
      </table>
      <Offcanvas show={show} onHide={handleClose} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
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
       
        </Offcanvas.Body>
      </Offcanvas>
       </>
    );
}
