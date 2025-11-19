<?php

namespace App\Models;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mark extends Model
{
    use HasFactory;
    protected $appends = ['student_name','subject','total_marks_term_one','total_marks_term_two','formatted_date'];

    public function getStudentNameAttribute()
    {
        return $this->student()->get()->first()->name;
    }

      /*
     Convert sql time to more human readble format
    */
    public function getFormattedDateAttribute()
    {
        $new_date = date('F d  Y, h:i:s A', strtotime($this->attributes['created_at'])); 
        return  $new_date;
    }

    public function getTotalMarksTermTwoAttribute()
    {
        return $this->student()->get()->first()->total_marks_term_two;

    }

    public function getTotalMarksTermOneAttribute()
    {
        return $this->student()->get()->first()->total_marks_term_one;
    }
    
    public function getSubjectAttribute()
    {
        return $this->subject()->get()->first()->name;
    }

    public function student()
    {
    return $this->belongsTo(Student::class);
    }

    public function subject()
    {
    return $this->belongsTo(Subject::class);
    }
}
