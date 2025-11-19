import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/inertia-react';

export default function Guest({ children ,title,subtitle,login}) {
    return (<>
    
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div className='text-center'>
           
              <h2 className='text-2xl'>{title}</h2>
              <h2 className='text-1xl pt-2'>{subtitle}</h2>
              {}
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
                
            </div>
        </div></>
    );
}
