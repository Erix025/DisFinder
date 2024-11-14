// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { Props } from 'react-apexcharts';

import Navbar from '@/components/Navbar';

import { Steam } from '@/components/PriceChart';

const Chart = dynamic(
    () => import('../../components/PriceChart').then((mod) => mod.Steam),
    {
        ssr: false,
    }
);

const mockProduct = {
    title: "Smartphone XYZ",
    img: "https://images-na.ssl-images-amazon.com/images/G/01/DiscoTec/2024/BrandActivations/Armani/Homepage/Armani24_homepage_category_card_desktop_379x304_v2._SY304_CB542579375_.jpg",
    platforms: [
        { name: "Platform A", currentPrice: "$499", priceHistory: [490, 480, 500, 510, 495] },
        { name: "Platform B", currentPrice: "$505", priceHistory: [510, 515, 500, 505, 498] },
        { name: "Platform C", currentPrice: "$495", priceHistory: [485, 490, 495, 505, 495] },
    ],
    description: "This is a description of the product.",
};

const state: Props['series'] = [
    {
        name: 'Platform A',
        data: [490, 480, 500, 510, 495],
    },
    {
        name: 'Platform B',
        data: [510, 515, 500, 505, 498],
    },
    {
        name: 'Platform C',
        data: [485, 490, 495, 505, 495],
    }
];


export default function ProductComparisonPage() {
    const [product, setProduct] = useState(mockProduct);

    useEffect(() => {
        // 这里可以获取实际的数据，如从 API 获取商品信息和历史价格
        setProduct(mockProduct);
    }, []);

    // 构建价格历史图表的数据
    const chartData = {
        labels: ["1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago"], // 价格历史日期
        datasets: product.platforms.map(platform => ({
            label: platform.name,
            data: platform.priceHistory,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        }))
    };

    return (
        <div className="min-h-screen text-foreground bg-background">
            {/* Navbar */}
            <Navbar />
            <div className="max-w-4xl mx-auto mt-10 p-4 flex items-start gap-8">

                {/* 左侧：平台价格信息 */}
                <div className="w-1/3">
                    {product.platforms.map((platform, index) => (
                        <Card key={index} className="mb-4">
                            <CardBody>
                                <h3 className="text-lg font-semibold">{platform.name}</h3>
                                <p className="text-xl text-primary">{platform.currentPrice}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* 右侧：商品信息（名称和图片） */}
                <div className="w-2/3">
                    <Card>
                        <CardBody>
                            <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
                            <Image src={product.img} alt={product.title} width="100%" height="auto" />
                        </CardBody>
                    </Card>
                </div>
            </div>
            <div className="max-w-4xl mx-auto mt-2 p-4">
                <Card>
                    <CardBody>
                        <h3 className="text-lg font-semibold mb-4">Description</h3>
                        <p>{product.description}</p>
                    </CardBody>
                </Card>
            </div>
            <div className="max-w-4xl mx-auto mt-2 p-4">
                <Card>
                    <CardBody>
                        <h3 className="text-lg font-semibold mb-4">Price History</h3>
                        <Chart
                            series={state}
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
