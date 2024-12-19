interface User {
    id: number;
    name: string;
    email: string;
}

interface ProductInfo {
    id: number;
    name: string;
    picture: string;
    url: string;
    price: number;
    platform_id: number;
}

interface PriceHistory {
    id: number;
    price: number;
    date: string;
    platform: number;
}