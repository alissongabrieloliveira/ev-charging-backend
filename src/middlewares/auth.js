const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Busca o header de autorização na requisição
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
    }

    // 2. O padrão esperado é "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Erro no formato do token.' });
    }

    const [scheme, token] = parts;

    // 3. Verifica se a palavra Bearer está escrita corretamente
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token mal formatado.' });
    }

    // 4. Valida a assinatura e a validade do token
    jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }

        // Injeta o ID do usuário logado na requisição (req)
        // Assim, qualquer controller que vier depois desse middleware saberá quem é o usuário
        req.userId = decoded.id;

        // Libera a requisição para continuar até o Controller
        return next();
    });
};