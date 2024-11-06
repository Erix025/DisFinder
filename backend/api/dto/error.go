package dto

import "disfinder-backend/utils/stacktrace"

const (
	NoErr           stacktrace.ErrorCode = iota // No error
	BadRequest    stacktrace.ErrorCode = 400
	InternalError stacktrace.ErrorCode = 500
)
