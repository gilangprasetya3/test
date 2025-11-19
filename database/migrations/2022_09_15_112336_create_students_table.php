

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::dropIfExists('students');
        Schema::create('students', function (Blueprint $table) {
            $table->bigIncrements("id");
            $table->string('name');
            $table->enum('gender',['Male','Female'])->default('Male');
            $table->integer('age');
            $table->unsignedBigInteger('teacher_id')->unsigned()->nullable();
            $table->foreign('teacher_id')->references('id')->on('teachers')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('students');
    }
};
