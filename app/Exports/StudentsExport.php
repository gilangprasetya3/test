<?php

namespace App\Exports;

use App\Models\Student;
use Illuminate\Support\Arr;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class StudentsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    /**
     * @var array<string, mixed>
     */
    protected array $filters;

    /**
     * @param  array<string, mixed>  $filters
     */
    public function __construct(array $filters = [])
    {
        $this->filters = Arr::only($filters, ['nis', 'name', 'lembaga_id', 'teacher_id']);
    }

    public function collection()
    {
        $query = Student::with(['lembaga', 'teacher', 'marks'])->orderBy('name');

        if (!empty($this->filters['nis'])) {
            $query->where('nis', 'like', '%'.$this->filters['nis'].'%');
        }

        if (!empty($this->filters['name'])) {
            $query->where('name', 'like', '%'.$this->filters['name'].'%');
        }

        if (!empty($this->filters['lembaga_id'])) {
            $query->where('lembaga_id', $this->filters['lembaga_id']);
        }

        if (!empty($this->filters['teacher_id'])) {
            $query->where('teacher_id', $this->filters['teacher_id']);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'NIS',
            'Name',
            'Gender',
            'Age',
            'Lembaga',
            'Reporting Teacher',
            'Term One Total',
            'Term Two Total',
        ];
    }

    /**
     * @param  \App\Models\Student  $student
     */
    public function map($student): array
    {
        return [
            $student->nis,
            $student->name,
            $student->gender,
            $student->age,
            optional($student->lembaga)->name,
            $student->teacher_name,
            $student->total_marks_term_one,
            $student->total_marks_term_two,
        ];
    }
}
