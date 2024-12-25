// app/wishlist/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, Image, Button, Pagination } from '@nextui-org/react';

import { WishlistDeleteProductReq } from '@/models/request';
import { Response, WishlistGetResp } from '@/models/response';
import { Wishlist } from '@/models/models';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

import { ErrorCode } from '@/models/error';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function WishlistPage() {
    const router = useRouter();
    const [wishlist, setWishlist] = useState<Wishlist[]>([]);
    const [page_num, setPageNum] = useState(1);
    const [page_size] = useState(20);
    const [total, setTotal] = useState(0);

    const handlePageChange = (prev: number) => {
        setPageNum(prev);
    };

    const handleCardClick = (id: number) => {
        router.push(`/product/${id}`);
    };

    // 删除商品
    const handleRemoveItem = (id: number) => {
        const fetchRemoveItem = async () => {
            const req: WishlistDeleteProductReq = {
                id: id,
            };
            const response = await fetch(`${apiUrl}/api/wishlist/delete`, {
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
                alert('Remove success');
                fetchWishlist();
            } else {
                console.error(resp.msg);
            }
        };
        fetchRemoveItem();
    };

    // 清空愿望单
    const handleClearWishlist = () => {
        // pop up a confirm dialog
        if (!confirm('Are you sure to clear wishlist?')) {
            return;
        }
        const fetchClearWishlist = async () => {
            const response = await fetch(`${apiUrl}/api/wishlist/clear`, {
                method: 'POST',
                credentials: 'include',
            });

            const resp: Response = await response.json();
            console.log(resp)
            if (resp.code == ErrorCode.NoErr) {
                fetchWishlist();
            } else {
                console.error(resp.msg);
            }
        }
        fetchClearWishlist();
    };

    const fetchWishlist = async () => {
        const response = await fetch(`${apiUrl}/api/wishlist?page_num=${page_num - 1}&page_size=${page_size}`, {
            method: 'GET',
            credentials: 'include',
        });

        const resp: Response = await response.json();
        console.log(resp)
        if (resp.code == ErrorCode.NoErr) {
            const data = resp.data as WishlistGetResp;
            setWishlist(data.products);
            setTotal(data.total);
        } else if (resp.code == ErrorCode.ErrNotLogin) {
            alert('Please login first');
            router.push('/auth');
        } else if (resp.code == ErrorCode.ErrEmptyWishlist) {
            setWishlist([]);
            setTotal(0);
        } else {
            console.error(resp.msg);
        }
    }

    useEffect(() => {
        fetchWishlist();
    }, [page_num, page_size]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-4xl mx-auto mt-10 p-4">

                <div className="flex items-center">
                    {/* 清空愿望单按钮 */}
                    <div className="flex justify-end">
                        <Button color="danger" onClick={handleClearWishlist}>Clear Wishlist</Button>
                    </div>
                </div>


                {/* 须要显示的愿望单商品 */}
                {total > 0 ? (
                    <div className='mt-4'>
                        {wishlist.map(item => (
                            <Card key={item.id} className="shadow-md mb-4 bg-default-50" isPressable onPress={() => handleCardClick(item.id)} >
                                <CardBody className="flex-row gap-4 items-center justify-center"> {/* 水平排列元素 */}
                                    {/* 图片 */}
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={item.picture}
                                            alt={item.name}
                                            width="100"
                                            height="auto"
                                            className="rounded-md object-cover"
                                        />
                                    </div>

                                    {/* 商品描述和价格 */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        {/* <p className="text-sm text-gray-500">{item.price}</p> */}
                                    </div>

                                    {/* 删除按钮 */}
                                    <div className="ml-4">
                                        <Button
                                            color="danger"
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                        <div className='mx-auto mt-8'>
                            <Pagination showControls total={Math.ceil(total / page_size)} page={page_num} onChange={handlePageChange} size='lg' />
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No items in your wishlist</p>
                )}


            </div>
        </div >
    );
}
