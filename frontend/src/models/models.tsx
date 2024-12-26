export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Wishlist {
    id: number;
    name: string;
    picture: string;
    url: string;
}

export interface ProductInfo {
    id: number;
    name: string;
    picture: string;
    url: string;
    price: number;
    platform_id: number;
}

export interface PriceHistory {
    id: number;
    price: number;
    date: string;
    platform: number;
}