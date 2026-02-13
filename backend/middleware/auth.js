const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Obter token do header Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Validar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');

    // Adicionar informações do usuário ao request
    req.userId = decoded.id;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Erro ao validar token:', error);
    res.status(401).json({ message: 'Token inválido ou expirado', error: error.message });
  }
};

const isOwner = (req, res, next) => {
  if (req.user?.role !== 'owner' && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Apenas proprietários podem acessar este recurso' });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Apenas admins podem acessar este recurso' });
  }
  next();
};

module.exports = { auth, isOwner, isAdmin };
