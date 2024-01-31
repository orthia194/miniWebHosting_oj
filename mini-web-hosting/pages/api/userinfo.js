import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;

  // 헤더에서 토큰 추출
  const token = authHeader && authHeader.split(' ')[1];

  // 토큰이 없으면 에러 응답
  if (!token) {
    return res.status(401).json({ message: '인증되지 않은 요청' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ username: decoded.username });
  } catch (error) {
    console.error('토큰 검증 실패:', error.message);
    return res.status(401).json({ message: '토큰 검증 실패' });
  }
  
}
