// components/SearchBox.tsx
'use client';  // 表明该组件在客户端渲染

import { Input, Button, Spinner } from '@nextui-org/react';
import { useState } from 'react';
import { SearchIcon } from "./SearchIcon.jsx";
import { useRouter } from 'next/navigation.js';
import { ErrorCode } from '@/models/error';
import { Response } from '@/models/response.jsx';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const SearchBox = () => {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const fetchSearch = async () => {
        const response = await fetch(`${apiUrl}/api/product/search?keyword=${query}`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) {
            console.error('Failed to search');
            setIsLoading(false);
            return;
        }

        const resp: Response = await response.json();
        console.log(resp)
        if (resp.code == ErrorCode.NoErr) {
            router.replace(`/search?keyword=${query}`);
        } else {
            console.error(resp.msg);
        }
        setIsLoading(false);
    };

    const handleSearch = () => {
        if (query === '') return;
        setIsLoading(true);
        // search
        fetchSearch();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log(e.key)
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="flex justify-center items-center">
                <Input
                    label="Search"
                    isClearable
                    size='lg'
                    radius="lg"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading}
                    classNames={{
                        label: "text-black/50 dark:text-white/90",
                        input: [
                            "bg-transparent",
                            "text-black/90 dark:text-white/90",
                            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                        ],
                        innerWrapper: "bg-transparent",
                        inputWrapper: [
                            "shadow-xl",
                            "bg-default-200/50",
                            "dark:bg-default/60",
                            "backdrop-blur-xl",
                            "backdrop-saturate-200",
                            "hover:bg-default-200/70",
                            "dark:hover:bg-default/70",
                            "group-data-[focus=true]:bg-default-200/50",
                            "dark:group-data-[focus=true]:bg-default/60",
                            "!cursor-text",
                        ],
                    }}
                    placeholder="Type to search..."
                    startContent={
                        <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                    }
                />
                {
                    isLoading ? <Spinner color='default' /> : <Button onClick={handleSearch} className="ml-2">
                        Search
                    </Button>
                }
            </div >
        </div>
    );
};

export default SearchBox;
