// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardBody, Image } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { useParams, useRouter } from 'next/navigation';
import { ErrorCode } from '@/models/error';
import { Response, PlatformGetNameResp, ProductGetInfoResp, ProductGetHistoryResp } from '@/models/response';
import { ProductInfo, PriceHistory } from '@/models/models';
import { ProductGetHistoryReq, WishlistAddProductReq } from '@/models/request';

import Navbar from '@/components/Navbar';

import { ResponsiveContainer } from 'recharts';

import { Link } from '@nextui-org/react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ChartData {
    name: string;
    price: number;
}

export default function ProductComparisonPage() {
    const [product, setProduct] = useState<ProductInfo>();
    const [histories, setHistories] = useState<PriceHistory[]>([]);
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const [platform, setPlatform] = useState<string>('');
    const [data, setData] = useState<ChartData[]>([]);

    const fetchAddWishlist = async () => {
        const req: WishlistAddProductReq = {
            id: id,
        };
        const response = await fetch(`${apiUrl}/api/wishlist/add`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
        });

        const resp: Response = await response.json();
        console.log(resp)
        if (resp.code == ErrorCode.NoErr) {
            alert('Add wishlist success');
            console.log('Add wishlist success');
        } else if (resp.code == ErrorCode.ErrNotLogin) {
            alert('Please login first');
            router.push('/auth');
        } else {
            console.error(resp.msg);
        }
    }

    const fetchPlatform = async (platform_id: number) => {
        const searchUrl = `${apiUrl}/api/platform/get?id=${platform_id}`;
        const response = await fetch(searchUrl, {
            method: 'GET',
            credentials: 'include',
        });

        const resp: Response = await response.json();
        console.log(resp)
        if (resp.code == ErrorCode.NoErr) {
            const data: PlatformGetNameResp = resp.data as PlatformGetNameResp;
            return data.name;
        } else {
            console.error(resp.msg);
        }
        return 'Unknown';
    }

    const formatDate = (time: string) => {
        // convert ISO time string to date
        const date = new Date(time);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month}-${day}`;
    }

    const fetchProduct = async () => {
        const searchUrl = `${apiUrl}/api/product/info?id=${id}`;
        const response = await fetch(searchUrl, {
            method: 'GET',
            credentials: 'include',
        });

        const resp: Response = await response.json();
        console.log(resp)
        if (resp.code == ErrorCode.NoErr) {
            const data = resp.data as ProductGetInfoResp;
            const product: ProductInfo = {
                id: data.id,
                name: data.name,
                picture: data.picture,
                url: data.url,
                price: 0,
                platform_id: data.platform_id,
            }
            setProduct(product);
            fetchPlatform(product.platform_id).then((name) => setPlatform(name));
        } else {
            console.error(resp.msg);
        }
    };
    const fetchPrice = async () => {
        const cur_date = new Date();
        const start_date = new Date(cur_date.getDate() - 7);
        const req: ProductGetHistoryReq = {
            product_id: id,
            start_date: start_date.toISOString(),
            end_date: cur_date.toISOString(),
        };
        const response = await fetch(`${apiUrl}/api/product/history`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
        });

        const resp: Response = await response.json();
        console.log(resp)
        if (resp.code == ErrorCode.NoErr) {
            const data = resp.data as ProductGetHistoryResp;
            setHistories(data.history);
            const new_data: ChartData[] = [];
            data.history.forEach((item: PriceHistory) => {
                new_data.push({ name: formatDate(item.date), price: item.price });
            });
            setData(new_data);
        } else {
            console.error(resp.msg);
        }
    };
    useEffect(() => {
        // fetch product info
        fetchProduct();
        fetchPrice();
        router.refresh();
    }, []);

    const { theme } = useTheme();

    // 选择字体颜色
    const textColor = theme == "dark" ? '#f5f5f5' : '#333';  // 暗模式使用浅色字体，亮模式使用深色字体
    const gridColor = theme == "dark" ? '#444' : '#e6e6e6';   // 网格线颜色，根据模式调整

    // 构建价格历史图表的数据

    return (
        <div className="min-h-screen text-foreground bg-background">
            {/* Navbar */}
            <Navbar />

            {/* 主内容 */}
            <div className="max-w-5xl mx-auto mt-10 p-4 grid gap-8 grid-cols-1 md:grid-cols-3">
                {/* 产品详情 */}
                <div className="md:col-span-2">
                    <Card>
                        <CardBody>
                            <div className="flex items-center gap-4">
                                <div className="w-1/2">
                                    <Image
                                        src={product?.picture}
                                        alt={product?.name}
                                        width="100%"
                                        height="auto"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <h2 className="text-2xl font-bold">{product?.name}</h2>
                                    <p className="text-md mt-2 text-gray-600">{platform}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* 操作卡片 */}
                <div>
                    <Card>
                        <CardBody>
                            <h3 className="text-xl font-semibold mb-4">Product Actions</h3>
                            <p className="text-lg font-semibold text-primary mb-4">
                                $ {histories.length > 0 ? histories[histories.length - 1].price : 'Unknown'}
                            </p>
                            <Button
                                className="w-full mb-2"
                                as={Link}
                                isExternal
                                href={product?.url || ''}
                                color="success"
                            >
                                Buy Now
                            </Button>
                            <Button
                                className="w-full"
                                onClick={fetchAddWishlist}
                                color="warning"
                            >
                                Add to Wishlist
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* 图表区域 */}
            <div className="max-w-5xl mx-auto mt-10 p-4">
                <Card>
                    <CardBody>
                        <h3 className="text-xl font-semibold mb-4 text-center">Price History</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid stroke={gridColor} strokeDasharray="5 5" />
                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                        fill: textColor, // 使用动态字体颜色
                                    }}
                                    label={{
                                        value: 'Date',
                                        position: 'insideBottom',
                                        offset: -5,
                                        fontSize: 14,
                                        fontWeight: '500',
                                        fill: textColor,
                                    }}
                                />
                                <YAxis
                                    tick={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                        fill: textColor, // 使用动态字体颜色
                                    }}
                                    label={{
                                        value: 'Price ($)',
                                        angle: -90,
                                        position: 'insideLeft',
                                        fontSize: 14,
                                        fontWeight: '500',
                                        fill: textColor,
                                    }}
                                    domain={[
                                        (dataMin: number) => Math.max(0, dataMin - 10),
                                        (dataMax: number) => dataMax + 10,
                                    ]}
                                    tickFormatter={(value) => value.toFixed(2)}
                                />
                                <Tooltip
                                    formatter={(value: number) => `$${value.toFixed(2)}`}
                                    contentStyle={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        backgroundColor: theme == "dark" ? '#444' : '#fafafa',
                                        borderRadius: '4px',
                                        border: '1px solid #e5e5e5',
                                    }}
                                />
                                <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}