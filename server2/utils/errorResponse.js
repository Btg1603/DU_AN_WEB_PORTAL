// utils/errorResponse.js

// Tạo class Error kế thừa từ Error gốc của JavaScript
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;