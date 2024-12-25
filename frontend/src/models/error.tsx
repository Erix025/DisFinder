export enum ErrorCode {
    NoErr = 200, // No error
    ErrEmailExist = 1, // 邮箱已被使用
    ErrPassword = 2, // 密码错误
    ErrUserNotFound = 3, // 用户不存在
    ErrNotLogin = 4, // 用户未登录
    ErrPrivilege = 5, // 权限不存在
    ErrPlatformNotFound = 6, // 平台不存在
    ErrProductNotFound = 7, // 产品不存在
    ErrProductExist = 8, // 产品已存在
    ErrSearchOutOfRange = 9, // 搜索范围超出限制
    ErrInvalidPage = 10, // 页码错误
    ErrEmptyWishlist = 11, // 心愿单为空
    ErrInvalidRequest = 12, // 参数错误
    BadRequest = 400,
    InternalError = 500,
}