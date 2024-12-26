export interface UserLoginReq {
    email: string;
    password: string;
}

export interface UserRegisterReq {
    email: string;
    name: string;
    password: string;
}

export interface UserUpdateInfoReq {
    id: number;
    name: string;
    email: string;
}

export interface UserUpdatePasswordReq {
    id: number;
    old_password: string;
    new_password: string;
}

export interface ProductGetListReq {
    keyword: string;
    page_num: number;
    page_size: number;
}

export interface ProductGetHistoryReq {
    product_id: number;
    start_date: string;
    end_date: string;
}

export interface WishlistAddProductReq {
    id: number;
}

export interface WishlistDeleteProductReq {
    id: number;
}