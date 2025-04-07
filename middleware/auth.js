const jwt = require("jsonwebtoken"); // on import la libraire de Token JWT qui va permettre de déchiffrer et vérifier le token JWT
const secretKey = "your_secret_key"; // c'est mieux de la faire en .env pour + de sécurité

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken; //ici on recupere le cookie nommée "accesToken" où on l'a definit au login
  // s'il n'y a pas alors message d'erreur
  if (!token) {
    return res
      .status(401)
      .send({ message: "Access token is missing or invalid" });
  }
  // la methode jwt.verifi() decode le token et vérifie s'il a été signé avec la bonne clé
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Invalid token" }); // si erreur alors envoie message d'erreur
    }
    req.user = user; // on ajoute les infos décodés dans req.user
    next(); // puis next nous rediriger à la route suivante
  });
};
module.exports = authenticateToken; // on export authenticateToken
