export const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json(errorMessage("Access denied, token missing!"));

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json(errorMessage("Token expired!"));
    req.user = user;
    next();
  });
};
