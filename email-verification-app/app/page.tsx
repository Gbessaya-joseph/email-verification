"use client";

import { useState, FormEvent } from 'react'; // Importe FormEvent pour typer l'événement du formulaire

export default function Home() {
  const [email, setEmail] = useState<string>(''); // Spécifie que 'email' est une chaîne
  const [message, setMessage] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [showVerificationForm, setShowVerificationForm] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => { // Type l'événement du formulaire
    e.preventDefault();
    setMessage('Envoi de l\'e-mail de vérification...');

    try {
      const response = await fetch('/api/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const text = await response.text(); // Pour afficher la vraie réponse (souvent du HTML)
        console.error("Erreur API:", text);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: { message: string } = await response.json(); // Typage simple de la réponse

      if (response.ok) {
        setMessage(data.message);
        setShowVerificationForm(true);
      } else {
        setMessage(`Erreur : ${data.message || 'Impossible d\'envoyer l\'e-mail.'}`);
      }
    } catch (error: any) { // Typage de l'erreur
      console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
      setMessage('Erreur réseau ou interne.');
    }
  };

  const handleVerifyCode = async (e: FormEvent) => { // Type l'événement du formulaire
    e.preventDefault();
    setMessage('Vérification du code...');

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      
      if (!response.ok) {
        const text = await response.text(); // Pour afficher la vraie réponse (souvent du HTML)
        console.error("Erreur API:", text);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: { message: string } = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Ici, vous pourriez rediriger l'utilisateur ou mettre à jour l'UI
      } else {
        setMessage(`Erreur de vérification : ${data.message || 'Code invalide.'}`);
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification du code:', error);
      setMessage('Erreur réseau ou interne.');
    }
  };

  return (
    <div className='container m-auto p-4 max-w-[600px] text-center rounded-2xl bg-background'>
      <div className='bg-gradient-to-b from-blue-500 to-blue-300 p-4 rounded-t-2xl'>
        <h1 className='text-3xl'>Inscription et Vérification d'E-mail</h1>
      </div>
      {!showVerificationForm ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Adresse E-mail :</label>
          <br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '8px', margin: '5px 0', width: '300px' }}
          />
          <br />
          <button type="submit" style={{ padding: '10px 15px', marginTop: '10px' }}>
            S'inscrire et Envoyer Code
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <p>Un code de vérification a été envoyé à <strong>{email}</strong>.</p>
          <label htmlFor="verificationCode">Entrez le code de vérification :</label>
          <br />
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            style={{ padding: '8px', margin: '5px 0', width: '200px' }}
            className='border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <br />
          <button type="submit" className='p-2 mt-2 '>
            Vérifier mon E-mail
          </button>
        </form>
      )}

      {message && <p style={{ marginTop: '20px', color: message.includes('Erreur') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}