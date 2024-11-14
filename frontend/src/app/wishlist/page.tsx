// app/wishlist/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardBody, CardFooter, Image, Button, Input } from '@nextui-org/react';

import Navbar from '@/components/Navbar';
import SearchBox from '@/components/SearchBox';

// 模拟的愿望单商品数据
const mockWishlist = [
    { id: 1, name: "Smartphone XYZ", img: "https://images-na.ssl-images-amazon.com/images/G/01/DiscoTec/2024/LS/Fall/LSFall_Cold_HPQuadCardA_Desktop2x_372x232_outerwear._SY232_CB562560740_.jpg", price: "$499" },
    { id: 2, name: "Laptop ABC", img: "https://images-na.ssl-images-amazon.com/images/G/01/DiscoTec/2024/LS/Fall/LSFall_Cold_HPQuadCardD_Desktop2x_372x232_sweaters._SY232_CB562560740_.jpg", price: "$899" },
    { id: 3, name: "Headphones Pro", img: "https://images-na.ssl-images-amazon.com/images/G/01/DiscoTec/2024/LS/Fall/LSFall_Cold_HPQuadCardB_Desktop2x_372x232_boots._SY232_CB562560740_.jpg", price: "$199" },
    { id: 4, name: "Smartwatch 2.0", img: "https://images-na.ssl-images-amazon.com/images/G/01/DiscoTec/2024/LS/Fall/LSFall_Cold_HPQuadCardC_Desktop2x_372x232_skincare._SY232_CB562560740_.jpg", price: "$129" },
    { id: 5, name: "Camera Pro", img: "https://images-na.ssl-images-amazon.com/images/G/01/DiscoTec/Prime/Adhoc/QuadCardSG/DQC_EN_Grubhub_372x232._SY232_CB570294461_.jpg", price: "$799" },
];

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState(mockWishlist);
    const [searchTerm, setSearchTerm] = useState('');

    // 删除商品
    const handleRemoveItem = (id: number) => {
        setWishlist(wishlist.filter(item => item.id !== id));
    };

    // 清空愿望单
    const handleClearWishlist = () => {
        setWishlist([]);
    };

    // 筛选愿望单
    const filteredWishlist = wishlist.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-4xl mx-auto mt-10 p-4">

                <div className="flex items-center">
                    {/* 搜索框 */}
                    <div className="flex-grow flex justify-start">
                        <SearchBox />
                    </div>

                    {/* 清空愿望单按钮 */}
                    <div className="flex justify-end">
                        <Button color="danger" onClick={handleClearWishlist}>Clear Wishlist</Button>
                    </div>
                </div>


                {/* 须要显示的愿望单商品 */}
                {filteredWishlist.length > 0 ? (
                    <div className='mt-4'>
                        {filteredWishlist.map(item => (
                            <Card key={item.id} className="shadow-md mb-4 bg-default-50">
                                <CardBody className="flex-row gap-4 items-center justify-center"> {/* 水平排列元素 */}
                                    {/* 图片 */}
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={item.img}
                                            alt={item.name}
                                            width="100"
                                            height="auto"
                                            className="rounded-md object-cover"
                                        />
                                    </div>

                                    {/* 商品描述和价格 */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.price}</p>
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
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No items in your wishlist</p>
                )}


            </div>
        </div>
    );
}
