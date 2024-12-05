package dto

import "disfinder-backend/utils/stacktrace"

const (
	NoErr           stacktrace.ErrorCode = iota // No error
	ErrEmailExist                               // 邮箱已被使用
	ErrPassword                                 // 密码错误
	ErrUserNotFound                             // 用户不存在

	ErrNotLogin  // 用户未登录
	ErrPrivilege // 权限不存在

	ErrPlatformNotFound // 平台不存在
	ErrProductNotFound  // 产品不存在
	ErrProductExist     // 产品已存在

	ErrSearchOutOfRange // 搜索范围超出限制

	ErrInvalidRequest // 参数错误

	BadRequest    stacktrace.ErrorCode = 400
	InternalError stacktrace.ErrorCode = 500
)
