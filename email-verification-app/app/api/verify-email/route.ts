// email-verification-app/app/api/verify-email/route.ts

import redis from '@/lib/redis'; // Utilisation de l'alias '@' pour les imports absolus
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'; // Importe NextResponse

const prisma = new PrismaClient();

// Fonction POST pour gérer les requêtes de vérification d'e-mail
export async function POST(req: Request) {
  const { email, code }: { email?: string; code?: string } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ message: 'L\'e-mail et le code sont requis.' }, { status: 400 });
  }

  try {
    const storedCode: string | null = await redis.get(`verification:${email}`);
    console.log(`Code reçu: ${code}, Code stocké dans Redis pour ${email}: ${storedCode}`);

    if (!storedCode || storedCode !== code) {
      return NextResponse.json({ message: 'Code de vérification invalide ou expiré.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { isVerified: true },
    });

    await redis.del(`verification:${email}`);
    console.log(`Code de vérification supprimé de Redis pour ${email}`);

    return NextResponse.json({ message: `Adresse e-mail ${updatedUser.email} vérifiée avec succès !` }, { status: 200 });

  } catch (error: any) {
    console.error('Erreur lors de la vérification de l\'e-mail:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur lors de la vérification.', error: error.message }, { status: 500 });
  } finally {
      await prisma.$disconnect();
  }
}