import React from 'react';
import { Spinner } from '@nextui-org/react';

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg flex flex-col">
                <Spinner size="lg" />
                <p className="text-primary-500 text-center mt-4">Loading...</p>
            </div>
        </div>
    );
}