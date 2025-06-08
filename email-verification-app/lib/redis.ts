// email-verification-app/lib/redis.ts

import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  // En TypeScript, il est bon de rendre l'erreur plus explicite
  throw new Error('REDIS_URL n\'est pas défini dans les variables d\'environnement. Veuillez le définir dans votre fichier .env');
}

// Assurez-vous que le client Redis est bien typé
const redis: Redis = new Redis(redisUrl);

redis.on('error', (err: Error) => { // Spécifiez le type de l'erreur
  console.error('Erreur de connexion Redis :', err);
});

redis.on('connect', () => {
  console.log('Connexion Redis établie avec succès !');
});

export default redis;