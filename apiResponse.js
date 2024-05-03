class ApiResponse {
  constructor(code, message, data) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success(data) {
    return new ApiResponse(200, "Success", data);
  }

  static error(code, message) {
    return new ApiResponse(code, message, null);
  }
}

export default ApiResponse;
