import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/inertia-react';

export default function Profile({ auth, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth.user?.name ?? '',
        email: auth.user?.email ?? '',
        position: auth.user?.position ?? '',
        profile_photo: null,
    });
    const [preview, setPreview] = React.useState(auth.user?.profile_photo_url ?? null);

    React.useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
            onSuccess: () => {
                setData('profile_photo', null);
            },
        });
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        setData('profile_photo', file || null);

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    return (
        <AuthenticatedLayout auth={auth} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}>
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        {flash?.success && (
                            <div className="mb-4 rounded bg-green-50 p-3 text-green-800">
                                {flash.success}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            <div className="flex items-center gap-6">
                                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-2xl font-semibold text-gray-600">
                                    {preview ? (
                                        <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        (auth.user?.name || '?').charAt(0)
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="mt-2 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-50 file:text-indigo-700
                                            hover:file:bg-indigo-100"
                                    />
                                    {errors.profile_photo && <p className="mt-2 text-sm text-red-600">{errors.profile_photo}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Position</label>
                                <input
                                    type="text"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    placeholder="e.g. Academic Coordinator"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.position && <p className="mt-2 text-sm text-red-600">{errors.position}</p>}
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                    onClick={() => {
                                        reset();
                                        setPreview(auth.user?.profile_photo_url ?? null);
                                    }}
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
