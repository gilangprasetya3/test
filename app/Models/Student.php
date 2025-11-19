<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Mark;
use App\Models\Teacher;
use App\Models\Lembaga;
class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'nis',
        'name',
        'gender',
        'age',
        'lembaga_id',
        'teacher_id',
    ];

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

    public function lembaga()
    {
        return $this->belongsTo(Lembaga::class);
    }

}
