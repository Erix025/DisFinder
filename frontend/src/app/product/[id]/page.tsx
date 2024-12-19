// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { Props } from 'react-apexcharts';
import { useParams, useRouter } from 'next/navigation';
import { ErrorCode } from '@/models/error';

import Navbar from '@/components/Navbar';

import { Link } from '@nextui-org/react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ProductComparisonPage() {
    const [product, setProduct] = useState<ProductInfo>();
    const [histories, setHistories] = useState<PriceHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const [platform, setPlatform] = useState<string>('');
    const [data, setData] = useState([]);

    const fetchPlatform = async (platform_id: number) => {
        const searchUrl = `${apiUrl}/api/platform/get?id=${platform_id}`;
        const response = await fetch(searchUrl, {
            method: 'GET',
            credentials: 'include',
        });

        const resp: Response = await response.json();
        console.log(resp)
        if (resp.code == ErrorCode.NoErr) {
            return resp.data.name;
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
            const product: ProductInfo = {
                id: resp.data.id,
                name: resp.data.name,
                picture: resp.data.picture,
                url: resp.data.url,
                price: 0,
                platform_id: resp.data.platform_id,
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
            setHistories(resp.data.history);
            var new_data = [];
            resp.data.history.forEach((item: PriceHistory) => {
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
        setIsLoading(true);
        router.refresh();
    }, []);

    // 构建价格历史图表的数据

    return (
        <div className="min-h-screen text-foreground bg-background">
            {/* Navbar */}
            <Navbar />
            <div className="max-w-4xl mx-auto mt-10 p-4 flex items-start gap-8">
                <div className="w-2/3">
                    <Card>
                        <CardBody>
                            <div className='flex'>
                                <h2 className="w-2/3 text-xl font-bold mb-4">{product?.name}</h2>
                                <Image className='' src={product?.picture} alt={product?.name} width="100%" height="auto" />
                            </div>
                        </CardBody>
                    </Card>

                </div>

                <div className='w-1/3'>
                    <Card className="mb-4 mt-4">
                        <CardBody>
                            <div className='flex'>
                                <h3 className="text-lg font-semibold">{platform}</h3>
                                <p className="text-xl text-primary font-semibold ml-auto">$ {histories.length > 0 ? histories[0].price : 'Unknown'}</p>
                            </div>
                            <Button
                                className="mt-4 font-semibold"
                                as={Link}
                                isExternal
                                href={product ? product.url : ''}
                                color='success'>
                                Buy Now
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <div className="max-w-4xl mx-auto mt-2 p-4">
                <Card>
                    <CardBody>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Price History</h3>
                            <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <Line type="monotone" dataKey="price" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </div>
                    </CardBody>
                </Card >
            </div>

        </div>
    );
}
