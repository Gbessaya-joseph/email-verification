// email-verification-app/app/api/send-verification-email/route.ts

import redis from '@/lib/redis'; // Utilisation de l'alias '@' pour les imports absolus
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'; // Importe NextResponse pour les réponses JSON

const prisma = new PrismaClient();

// Fonction POST pour gérer les requêtes d'envoi d'e-mail de vérification
export async function POST(req: Request) {
  // Le corps de la requête est lu via req.json()
  const { email }: { email?: string } = await req.json();

  if (!email) {
    return NextResponse.json({ message: 'L\'adresse e-mail est requise.' }, { status: 400 });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email: email },
      });
      console.log(`Nouvel utilisateur créé: ${user.email}`);
    } else if (user.isVerified) {
      return NextResponse.json({ message: 'Cet e-mail est déjà vérifié.' }, { status: 200 });
    }

    const verificationCode: string = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.setex(`verification:${email}`, 900, verificationCode); // 15 minutes
    console.log(`Code de vérification ${verificationCode} stocké dans Redis pour ${email}`);

    const N8N_WEBHOOK_URL: string | undefined = process.env.N8N_WEBHOOK_URL;

    if (!N8N_WEBHOOK_URL) {
      throw new Error('N8N_WEBHOOK_URL n\'est pas défini dans les variables d\'environnement.');
    }

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, verificationCode: verificationCode }),
    });

    const n8nData: any = await n8nResponse.json();

    if (n8nResponse.ok) {
      return NextResponse.json({ message: 'E-mail de vérification envoyé avec succès.', n8nResponse: n8nData }, { status: 200 });
    } else {
      console.error('Erreur de n8n:', n8nData);
      return NextResponse.json({ message: n8nData.message || 'Échec de l\'envoi de l\'e-mail via n8n.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Erreur lors du processus d\'envoi de vérification:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur lors de l\'envoi de l\'e-mail.', error: error.message }, { status: 500 });
  } finally {
      await prisma.$disconnect();
  }
}