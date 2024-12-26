import { PriceHistory, ProductInfo, Wishlist } from './models';
export interface Response {
    code: number;
    msg: string;
    data: unknown;
}

export interface UserGetInfoResp {
    id: number;
    name: string;
    email: string;
}

export interface ProductGetListResp {
    products: ProductInfo[];
    total: number;
}

export interface ProductGetInfoResp {
    id: number;
    name: string;
    picture: string;
    url: string;
    platform_id: number;
}

export interface PlatformGetNameResp {
    id: number;
    name: string;
}

export interface ProductGetHistoryResp {
    history: PriceHistory[];
}

export interface WishlistGetResp {
    products: Wishlist[];
    total: number;
}