exports.sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({ success: true, message, ...data });
};

exports.sendError = (res, statusCode = 500, message = 'Something went wrong') => {
  return res.status(statusCode).json({ success: false, message });
};

exports.getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
