<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'id' => ['required', 'exists:students,id'],
            'nis' => [
                'required',
                'string',
                'max:50',
                \Illuminate\Validation\Rule::unique('students', 'nis')->ignore($this->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:Male,Female'],
            'age' => ['required', 'integer', 'between:5,25'],
            'lembaga_id' => ['required', 'exists:lembagas,id'],
            'teacher_id' => ['nullable', 'exists:teachers,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $studentId = $this->route('student')?->id ?? $this->route('id');

        if ($studentId && !$this->has('id')) {
            $this->merge(['id' => $studentId]);
        }
    }
}
