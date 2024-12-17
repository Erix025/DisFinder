interface UserLoginReq {
    email: string;
    password: string;
}

interface UserRegisterReq {
    email: string;
    name: string;
    password: string;
}

interface UserUpdateInfoReq {
    id: number;
    name: string;
    email: string;
}

interface UserUpdatePasswordReq {
    id: number;
    old_password: string;
    new_password: string;
}

interface ProductGetListReq {
    keyword: string;
    page_num: number;
    page_size: number;
}