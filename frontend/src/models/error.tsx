export enum ErrorCode {
    NoErr = 200, // No error
    ErrEmailExist = 2, // 邮箱已被使用
    ErrPassword = 3, // 密码错误
    ErrUserNotFound = 4, // 用户不存在
    ErrNotLogin = 5, // 用户未登录
    ErrPrivilege = 6, // 权限不存在
    ErrPlatformNotFound = 7, // 平台不存在
    ErrProductNotFound = 8, // 产品不存在
    ErrProductExist = 9, // 产品已存在
    ErrSearchOutOfRange = 10, // 搜索范围超出限制
    ErrInvalidPage = 11, // 页码错误
    ErrEmptyWishlist = 12, // 心愿单为空
    ErrInvalidRequest = 13, // 参数错误
    BadRequest = 400,
    InternalError = 500,
}