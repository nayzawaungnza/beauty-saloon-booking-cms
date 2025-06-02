import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, canLogin, canRegister }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="flex items-center justify-between py-10">
                            
                            <nav className="flex space-x-4">
                            {auth.user?.name}
                            {auth.user?.roles ? (
                <p>You have Super Admin access.</p>
            ) : (
                <p>You are not a Super Admin.</p>
            )}
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-gray-800 transition hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-200 dark:hover:text-gray-400"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        {canLogin && (
                                            <Link
                                                href={route('login')}
                                                className="rounded-md px-3 py-2 text-gray-800 transition hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-200 dark:hover:text-gray-400"
                                            >
                                                Log in
                                            </Link>
                                        )}
                                        {canRegister && (
                                            <Link
                                                href={route('register')}
                                                className="rounded-md px-3 py-2 text-gray-800 transition hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-200 dark:hover:text-gray-400"
                                            >
                                                Register
                                            </Link>
                                        )}
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6 text-center">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Welcome to Our Application
                            </h1>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                                Start exploring our platform or sign in to access your dashboard.
                            </p>
                        </main>

                        <footer className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} Your App Name
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}