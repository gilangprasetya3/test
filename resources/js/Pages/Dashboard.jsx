import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Head } from '@inertiajs/inertia-react';
import  AddStudent from '../Components/AddStudent';
import AddTeacher from '@/Components/AddTeacher';
import AddSubject from '@/Components/AddSubject';
import { configureStore  } from "@reduxjs/toolkit";
import StudentList from '@/Components/StudentList';
import MarkList from '@/Components/MarkList';
import EnterMarks from '@/Components/EnterMarks';
import Store from '../Components/reducers/Store';
import { Provider } from "react-redux";
import { useDispatch } from "react-redux";
export default function Dashboard(props) {
    const scrollto = React.useRef(null);

    const handleMarkList = () => {
        

        setShowMarklist('block');
        setShowStudentslist('none');
        
    }
    const handleStudentList = () => {
        const marklistelement = document.getElementsByClassName('marklist')[0];

        setShowMarklist('none');
        setShowStudentslist('block');
        
    }
    const store = configureStore({ reducer: Store })
console.log(props.marklist);
    const [students, setStudents] = React.useState(props.data);
    const [teachers, setTeachers] = React.useState(props.teachers);

    const [showStudentslist, setShowStudentslist] = React.useState('block');
    const [showMarklist, setShowMarklist] = React.useState('none');

    const [show, setShow] = React.useState(false);
    const [showteacher, setShowteacher] = React.useState(false);
    const [showsubject, setShowsubject] = React.useState(false);
    const [showmarkentry, setShowmarkentry] = React.useState(false);

    const handleShow = () => setShow(true);
    
    const handleEnterMarks = () => setShowmarkentry(true);
    const handleCloseEnterMarks = () => setShowmarkentry(false);

    const handleShowTeacher = () => setShowteacher(true);
    const handleShowSubject = () => setShowsubject(true);
    const handleCloseSubject = () => setShowsubject(false);

    const handleCloseTeacher = () => setShowteacher(false);
    const handleClose = () => setShow(false);

    console.log(props.teachers);


   
    return (<> 
    <Provider store={store}>
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<><h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
            <div className='mt-2'>
                <button onClick={handleShow}  class="bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded">

            Add Student
    </button>
    <button onClick={handleShowTeacher} class="bg-blue-500 hover:bg-blue-700 text-white font-bold mr-2 py-2 px-4 rounded">

            Add Teacher
        </button>
        <button onClick={handleShowSubject} class="bg-blue-500 hover:bg-blue-700 text-white mr-2 font-bold py-2 px-4 rounded">

            Add Subject
        </button>
        <button onClick={handleEnterMarks} class="bg-green-500 hover:bg-blue-700 text-white mr-2 font-bold py-2 px-4 rounded">

Enter Student marks
</button>
<a style={{float:"right",cursor:"pointer"}} onClick={handleMarkList}  class="    no-underline	  mr-2 font-bold py-2 px-4 rounded">

View Mark Lists
</a>
<a style={{float:"right",cursor:"pointer"}}  onClick={handleStudentList}  class="   no-underline	   mr-2 font-bold py-2 px-4 rounded">

View Student Lists
</a>
        </div></>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div style={{display:showStudentslist}} ref={scrollto} className="marklist">
                          <StudentList csrf={props.csrf_token} lembagaOptions={props.lembagas} marklist={props.marklist} subjectdata={props.subjects}  teacherdata={props.teachers} studentdata={props.data}/>

                        </div>

         <div style={{display:showMarklist}} ref={scrollto} className="marklist">
                        <MarkList  marklist={props.marklist} subjectdata={props.subjects}  teacherdata={props.teachers} studentdata={props.data}/>
                        </div>

                    </div>
                </div>
            </div>
            <Offcanvas show={show} onHide={handleClose} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
         <AddStudent csrf={props.csrf_token} teachers={props.teachers} lembagas={props.lembagas} />
       
        </Offcanvas.Body>
      </Offcanvas>
      <Offcanvas show={showteacher} onHide={handleCloseTeacher} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
       <AddTeacher csrf={props.csrf_token}  />
       
        </Offcanvas.Body>
      </Offcanvas>
      <Offcanvas show={showsubject} onHide={handleCloseSubject} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
       <AddSubject csrf={props.csrf_token}  />
       
        </Offcanvas.Body>
      </Offcanvas>
      <Offcanvas show={showmarkentry} onHide={handleCloseEnterMarks} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
       <EnterMarks csrf={props.csrf_token} subjects={props.subjects} teachers={props.teachers}/>
       
        </Offcanvas.Body>
      </Offcanvas>
        </AuthenticatedLayout></Provider></>
    );
}
