class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string = 'Something went wrong',
    public errors: any[] = [],
    stack: string = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default ApiError;
