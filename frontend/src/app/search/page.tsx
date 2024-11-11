// app/results/page.tsx
'use client';

import SearchBox from '@/components/SearchBox';
import Navbar from '../../components/Navbar';
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const mockResults = [
    {
        title: "Orange",
        img: "/images/fruit-1.jpeg",
        price: "$5.50",
    },
    {
        title: "Tangerine",
        img: "/images/fruit-2.jpeg",
        price: "$3.00",
    },
    {
        title: "Raspberry",
        img: "/images/fruit-3.jpeg",
        price: "$10.00",
    },
    {
        title: "Lemon",
        img: "/images/fruit-4.jpeg",
        price: "$5.30",
    },
    {
        title: "Avocado",
        img: "/images/fruit-5.jpeg",
        price: "$15.70",
    },
    {
        title: "Lemon 2",
        img: "/images/fruit-6.jpeg",
        price: "$8.00",
    },
    {
        title: "Banana",
        img: "/images/fruit-7.jpeg",
        price: "$7.50",
    },
    {
        title: "Watermelon",
        img: "/images/fruit-8.jpeg",
        price: "$12.20",
    },
];

export default function SearchResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState(mockResults);

    useEffect(() => {
        // 模拟搜索结果数据
        setResults(mockResults);
    }, []);

    return (
        <div className="min-h-screen text-foreground bg-background">
            {/* 导航栏 */}
            <Navbar />


            {/* 搜索结果标题 */}
            <div className="max-w-3xl mx-auto mt-10 p-4">

                <SearchBox />

                {/* 搜索结果展示区域 */}
                {results.length > 0 ? (
                    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mt-8">
                        {mockResults.map((item, index) => (
                            <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
                                <CardBody className="overflow-visible p-0">
                                    <Image
                                        shadow="sm"
                                        radius="lg"
                                        width="100%"
                                        alt={item.title}
                                        className="w-full object-cover h-[140px]"
                                        src={item.img}
                                    />
                                </CardBody>
                                <CardFooter className="text-small justify-between">
                                    <b>{item.title}</b>
                                    <p className="text-default-500">{item.price}</p>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10">未找到相关商品</p>
                )}
            </div>
        </div>
    );
}
