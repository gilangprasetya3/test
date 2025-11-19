<?php

use App\Models\Lembaga;
use App\Models\Student;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'nis')) {
                $table->string('nis')->nullable()->unique()->after('id');
            }

            if (!Schema::hasColumn('students', 'lembaga_id')) {
                $table->foreignId('lembaga_id')
                    ->nullable()
                    ->after('age')
                    ->constrained('lembagas')
                    ->nullOnDelete();
            }
        });

        $lembagas = [
            'Latiseducation',
            'Tutorindonesia',
        ];

        foreach ($lembagas as $name) {
            Lembaga::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }

        $defaultLembagaId = Lembaga::first()->id ?? null;

        if ($defaultLembagaId) {
            Student::whereNull('lembaga_id')
                ->chunkById(100, function ($students) use ($defaultLembagaId) {
                    foreach ($students as $student) {
                        $student->lembaga_id = $defaultLembagaId;
                        if (empty($student->nis)) {
                            $student->nis = 'NIS-' . str_pad($student->id, 4, '0', STR_PAD_LEFT);
                        }
                        $student->save();
                    }
                });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            if (Schema::hasColumn('students', 'lembaga_id')) {
                $table->dropForeign(['lembaga_id']);
                $table->dropColumn('lembaga_id');
            }

            if (Schema::hasColumn('students', 'nis')) {
                $table->dropColumn('nis');
            }
        });
    }
};
