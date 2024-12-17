// app/results/page.tsx
'use client';

import SearchBox from '@/components/SearchBox';
import Navbar from '../../components/Navbar';
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ErrorCode } from '@/models/error';
import { Pagination } from '@nextui-org/react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function SearchResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState<ProductInfo[]>([]);
    const [total, setTotal] = useState(0);

    const params = useSearchParams();

    const keyword = params.get('keyword');
    const page_size = 20;
    const [page_num, setPageNum] = useState(1);

    const handlePageChange = (prev: number) => {
        setPageNum(prev);
    };

    const handleCardClick = (id: number) => {
        router.push(`/product?${id}`);
    };

    useEffect(() => {
        // get products from backend
        const fetchResults = async () => {
            const searchUrl = `${apiUrl}/api/product/list?keyword=${keyword}&page_num=${page_num - 1}&page_size=${page_size}`;
            const response = await fetch(searchUrl, {
                method: 'POST',
                credentials: 'include',
            });

            const resp: Response = await response.json();
            console.log(resp)
            if (resp.code == ErrorCode.NoErr) {
                if (resp.data.products == null) {
                    setResults([]);
                } else {
                    setResults(resp.data.products);
                }
                setTotal(resp.data.total);
            } else {
                console.error(resp.msg);
            }
        };
        fetchResults();
    }, [keyword, page_num]);

    return (
        <div className="min-h-screen text-foreground bg-background">
            {/* 导航栏 */}
            <Navbar />


            {/* 搜索结果标题 */}
            <div className="max-w-3xl mx-auto mt-10 p-4">

                <SearchBox />

                {/* 搜索结果展示区域 */}
                {results.length > 0 ? (
                    <div className='flex flex-col justify-center'>
                        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mt-8">
                            {results.map((product) => (
                                <Card shadow="sm" key={product.id} isPressable onPress={() => handleCardClick(product.id)}>
                                    <CardBody className="overflow-visible p-0">
                                        <Image
                                            shadow="sm"
                                            radius="lg"
                                            width="100%"
                                            alt={product.name}
                                            className="w-full object-cover h-[140px]"
                                            src={product.picture}
                                        />
                                    </CardBody>
                                    <CardFooter className="text-small justify-between flex flex-col">
                                        <b className="line-clamp-2">{product.name}</b>
                                        <b className="text-blue-500 text-lg">$ {product.price}</b>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        <div className='mx-auto mt-8'>
                            <Pagination showControls total={Math.ceil(total / page_size)} page={page_num} onChange={handlePageChange} size='lg' />
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10">未找到相关商品</p>
                )}
            </div>
        </div>
    );
}
