import React from 'react';

const Page = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#ffe9e3a8] via-[#faedcda8] to-[#fde2e2a8] text-gray-800 text-center">
            <div>
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="text-lg">
                    You do not have the necessary permissions to access the admin panel.
                </p>
            </div>
        </div>
    );
};

export default Page;
