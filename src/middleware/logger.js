export function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `${req.method} ${req.url} - ${req.ip} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
}