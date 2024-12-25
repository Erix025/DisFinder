interface Response {
    code: number;
    msg: string;
    data: any;
}

interface UserGetInfoResp {
    id: number;
    name: string;
    email: string;
}

interface ProductGetListResp {
    products: ProductInfo[];
    total: number;
}

interface ProductGetInfoResp {
    id: number;
    name: string;
    picture: string;
    url: string;
}

interface PlatformGetNameResp {
    id: number;
    name: string;
}

interface ProductGetHistoryResp {
    history: PriceHistory[];
}