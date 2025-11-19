<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Lembaga;

class DashboardController extends Controller
{
   /*
This Function is responsible for rendering the dashboard after authentication

Every Data required is passed via Inertia to React Component using props

*/

public function render()
{

   $students=Student::with(['teacher','lembaga'])->orderBy('created_at', 'desc')->get();
   $teachers=Teacher::orderBy('created_at', 'desc')->get();
   $subjects=Subject::orderBy('created_at', 'desc')->get();
   $lembagas=Lembaga::orderBy('name')->get();
  $marklists=[];

foreach ($students as $student){
    $marklists[]=$student->marks()->where('term','One')->get();
    $marklists[]=$student->marks()->where('term','Two')->get();

 }



     return Inertia::render('Dashboard',[
        'data'=>$students,
        'teachers'=>$teachers,
        'subjects'=>$subjects,
        'lembagas'=>$lembagas,
        'marklist'=>$marklists,
        'csrf_token'=>csrf_token(),
    ]);
}

    
}
