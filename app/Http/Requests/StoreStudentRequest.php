<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
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
            'nis' => ['required', 'string', 'max:50', 'unique:students,nis'],
            'name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:Male,Female'],
            'age' => ['required', 'integer', 'between:5,25'],
            'lembaga_id' => ['required', 'exists:lembagas,id'],
            'teacher_id' => ['nullable', 'exists:teachers,id'],
        ];
    }
}
