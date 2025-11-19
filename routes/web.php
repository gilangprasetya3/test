<?php


use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\SubjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::post('addStudent', [StudentController::class,'create']);
Route::post('editStudent', [StudentController::class,'update']);
Route::post('editMark', [StudentController::class,'editMark']);
Route::post('deleteStudent', [StudentController::class,'destroy']);
Route::post('deleteMarks', [StudentController::class,'deleteMarks']);
Route::post('addMarks', [StudentController::class,'addMark']);

Route::post('addTeacher', [TeacherController::class,'create']);
Route::post('addSubject', [SubjectController::class,'create']);

Route::get('/dashboard', 'App\Http\Controllers\DashboardController@render')->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/auth.php';
