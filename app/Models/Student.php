<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Mark;
use App\Models\Teacher;
class Student extends Model
{
    use HasFactory;

    protected $appends = ['teacher_name','total_marks_term_one','total_marks_term_two'];

    //implement the attribute
    public function getTeacherNameAttribute()
    {
        return $this->teacher()?->get()->first()?->name;
    }

    public function getTotalMarksTermOneAttribute()
    {
        return $this->marks()->where('term','One')->sum('mark');
    }

    public function getTotalMarksTermTwoAttribute()
    {
        return $this->marks()->where('term','Two')->sum('mark');
    }

    public function marks()
    {
    return $this->hasMany(Mark::class);
    }

    public function teacher()
    {
    return $this->belongsTo(Teacher::class);
    }

}
