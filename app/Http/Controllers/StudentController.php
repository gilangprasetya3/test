<?php

namespace App\Http\Controllers;

use App\Exports\StudentsExport;
use App\Models\Student;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Mark;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Maatwebsite\Excel\Facades\Excel;
class StudentController extends Controller
{


 
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Creating new student
     *
     * @return \Illuminate\Http\Response
     */
    public function store(StoreStudentRequest $request)
    {
        $payload = $request->validated();

        $student = Student::create($payload);

        if ($student) {
            return $this->redirectWithStudents('Student created successfully.');
        }

        return Redirect::route('dashboard')->withErrors(['student' => 'Unable to add student.']);
    }

    /**
     * Add marks to students.
     *
     * @param  \App\Http\Requests\StoreStudentRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function addMark(Request $request)
    {
       $subjects=$request->except(['student','term']);
       $student=Student::findOrFail($request->student);
       $isexist=$student->marks()->where('term',$request->term)->get();

       if (!empty($isexist)) {
        $student->marks()->where('term',$request->term)->delete();
       }

       foreach ($subjects as $id => $markvalue) {

        
     $mark=new Mark;
     $subject=Subject::find($id);
     $mark->student()->associate($student);
     $mark->subject()->associate($subject);
     $mark->mark=$markvalue;
     $mark->term=$request->term;
     $mark->save();

   


       }


       return $this->redirectWithStudents('Marks saved successfully.');

    }

/**
     * Update marks.
     *
     */

    public function editMark(Request $request)
    {
       $subjects=$request->except(['student','term']);
       $student=Student::findOrFail($request->student);
       $isexist=$student->marks()->where('term',$request->term)->get();

       if (!empty($isexist)) {
        $student->marks()->delete();

       } else {
        $student->marks()->delete();

       }

       foreach ($subjects as $id => $markvalue) {

        
     $mark=new Mark;
     $subject=Subject::find($id);
     $mark->student()->associate($student);
     $mark->subject()->associate($subject);
     $mark->mark=$markvalue;
     $mark->term=$request->term;
     $mark->save();

   


       }


       return $this->redirectWithStudents('Marks updated successfully.');

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function show(Student $student)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update Students data.
     *
     * @param  \App\Http\Requests\UpdateStudentRequest  $request
     * @param  \App\Models\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateStudentRequest $request)
    {
        $student = Student::findOrFail($request->validated('id'));

        $student->update($request->validated());

        return $this->redirectWithStudents('Student updated successfully.');
    }

    /**
     * Remove student data.
     *
     * @param  \App\Models\Student  $student
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
       
        $student = Student::findOrFail($request->id);

        if ($student->delete()) {
            return $this->redirectWithStudents('Student deleted successfully.');
        }

        return Redirect::route('dashboard')->withErrors(['student' => 'Unable to delete student.']);
    }

  /**
     * Remove mark data.
     *
     */

    public function deleteMarks(Request $request)
    {
        $student=Student::findOrFail($request->id);
       
         $student->marks()->where('term',$request->term)->delete();
        
         return $this->redirectWithStudents('Marks removed successfully.');
    }

    protected function redirectWithStudents(string $message = null)
    {
        $students = Student::with(['teacher', 'lembaga'])->orderByDesc('created_at')->get();

        $payload = [
            'data' => $students,
        ];

        if ($message) {
            $payload['success'] = $message;
        }

        return Redirect::back()->with($payload);
    }

    public function export(Request $request)
    {
        $filters = $request->only(['nis', 'name', 'lembaga_id']);
        $fileName = 'students-export-'.now()->format('Y_m_d_His').'.xlsx';

        return Excel::download(new StudentsExport($filters), $fileName);
    }
}
