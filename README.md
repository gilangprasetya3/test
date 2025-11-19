<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Student Managment System

Student Management System is A Web Application Built On Laravel with React & Inertia

## Laravel Version - 9.0
## Require Minimum PHP verison of 8.0


## Installation



Clone the repository

    git clone https://github.com/Arun123321/Student-Management-System.git
    Or Download the folder to your local system
    
Switch to the project folder (**Before this You must move the project folder to /var/www/html if on a LAMP server or inside htdocs if on a XAMPP or WAMP server**)

    cd Student-Management-System

Install all the dependencies using composer

    composer install
    
    
Install all the javascript dependencies using npm (Since we are using React & Inertia for frontend - **If You are not installed Nodejs (v16.17.0 is preffered) and NPM On your system first install it and try to run npm commands**)

    npm install    

Copy the example env file and make the required configuration changes in the .env file

    cp .env.example .env

Generate a new application key

    php artisan key:generate
    
Run the database migrations (**Set the database connection in .env before migrating**)

    php artisan migrate
    
**Populate the database with seed data with relationships which includes Subjects & Teachers**

Run the below commands

    php artisan db:seed --class=TeacherSeeder
    
    php artisan db:seed --class=SubjectSeeder
    

Run the below commands for compiling Js assets.


   For development run

    npm run dev
    
   For production run

    npm run build
 
   
Run the laravel development server on another terminal (Because npm run dev will be using the current one)

    php artisan serve
   
    
   The projects can now be accessed at

   http://localhost:8000 or http://127.0.0.1:8000/
    
 ## Author
 
 - Arun Ajith
