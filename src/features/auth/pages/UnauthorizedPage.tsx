import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <h1 className="text-6xl font-bold text-gray-900">403</h1>
                <h2 className="text-3xl font-semibold text-gray-800">Access Restricted</h2>
                <p className="text-gray-600">
                    You do not have the necessary permissions to view this page.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};
