<?php

namespace App\Http\Controllers\Api;

use App\Exports\StudentsExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class StudentApiController extends Controller
{
    /**
     * Display a listing of the students with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Student::with(['lembaga', 'teacher'])->orderByDesc('created_at');

        if ($request->filled('nis')) {
            $query->where('nis', 'like', '%'.$request->query('nis').'%');
        }

        if ($request->filled('name')) {
            $query->where('name', 'like', '%'.$request->query('name').'%');
        }

        if ($request->filled('lembaga_id')) {
            $query->where('lembaga_id', $request->query('lembaga_id'));
        }

        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->query('teacher_id'));
        }

        $perPage = $request->integer('per_page', 15);
        $students = $query->paginate($perPage)->appends($request->query());

        return response()->json($students);
    }

    /**
     * Store a newly created student in storage.
     */
    public function store(StoreStudentRequest $request): JsonResponse
    {
        $student = Student::create($request->validated());
        $student->load(['lembaga', 'teacher']);

        return response()->json([
            'message' => 'Student created successfully.',
            'data' => $student,
        ], 201);
    }

    /**
     * Display the specified student.
     */
    public function show(Student $student): JsonResponse
    {
        $student->load(['lembaga', 'teacher', 'marks.subject']);

        return response()->json([
            'data' => $student,
        ]);
    }

    /**
     * Update the specified student in storage.
     */
    public function update(UpdateStudentRequest $request, Student $student): JsonResponse
    {
        $student->update($request->validated());
        $student->load(['lembaga', 'teacher']);

        return response()->json([
            'message' => 'Student updated successfully.',
            'data' => $student,
        ]);
    }

    /**
     * Remove the specified student from storage.
     */
    public function destroy(Student $student): JsonResponse
    {
        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully.',
        ], 200);
    }

    /**
     * Export the filtered students list to Excel.
     */
    public function export(Request $request)
    {
        $filters = $request->only(['nis', 'name', 'lembaga_id', 'teacher_id']);
        $fileName = 'students-export-'.now()->format('Y_m_d_His').'.xlsx';

        return Excel::download(new StudentsExport($filters), $fileName);
    }
}
