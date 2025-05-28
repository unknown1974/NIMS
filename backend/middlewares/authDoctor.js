import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
      return res.status(401).json({ success: false, message: "No Authorized login again" });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.doctorId = token_decode.id; // cleaner to attach to req directly
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authDoctor;
