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
