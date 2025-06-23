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
    <div className='flex items-center justify-center min-h-screen bg-[#0d1117]/80 p-4'>
      <div className='container  p-0 max-w-[600px] text-center rounded-2xl bg-[#0d1117] shadow-inner shadow-black/80 relative overflow-hidden'>
    {/* Effet de profondeur enfoncée */}
    <div className='absolute inset-0 rounded-2xl shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),inset_0_-4px_8px_rgba(0,0,0,0.4)] pointer-events-none'></div>
    
    <div className='bg-gradient-to-r from-[#1f6feb] to-[#388bfd] p-6 rounded-t-2xl relative z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]'>
      <h1 className='text-4xl font-semibold py-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f0f6fc] to-[#c9d1d9]'>
        Inscription
      </h1>
    </div>
    
    <div className='p-6 relative z-10 bg-[#0d1117] shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] rounded-b-2xl'>
      {!showVerificationForm ? (
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='text-left'>
            <label htmlFor="email" className='block text-[#f0f6fc] font-medium mb-2'>
              Adresse E-mail :
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full p-3 bg-[#21262d] border border-[#30363d] rounded-lg text-[#f0f6fc] placeholder-[#7d8590] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]'
              placeholder='votre@email.com'
            />
          </div>
          <button 
            type="submit" 
            className='w-full bg-[#1f6feb] hover:bg-[#388bfd] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-[0_2px_8px_rgba(31,111,235,0.3)] hover:shadow-[0_4px_12px_rgba(31,111,235,0.4)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:transform active:translate-y-[1px]'
          >
            S'inscrire et Envoyer Code
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className='space-y-4'>
          <p className='text-[#f0f6fc] mb-4'>
            Un code de vérification a été envoyé à <strong className='text-[#388bfd]'>{email}</strong>.
          </p>
          <div className='text-left'>
            <label htmlFor="verificationCode" className='block text-[#f0f6fc] font-medium mb-2'>
              Entrez le code de vérification :
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className='w-full p-3 bg-[#21262d] border border-[#30363d] rounded-lg text-[#f0f6fc] placeholder-[#7d8590] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent transition-all duration-200 text-center tracking-widest shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]'
              placeholder='000000'
              maxLength={6}
            />
          </div>
          <button 
            type="submit" 
            className='w-full bg-[#1f6feb] hover:bg-[#388bfd] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-[0_2px_8px_rgba(31,111,235,0.3)] hover:shadow-[0_4px_12px_rgba(31,111,235,0.4)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:transform active:translate-y-[1px]'
          >
            Vérifier mon E-mail
          </button>
        </form>
      )}
      
      {message && (
        <div className={`mt-6 p-3 rounded-lg border shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)] ${
          message.includes('Erreur') 
            ? 'bg-[#21262d] border-[#f85149] text-[#f85149]' 
            : 'bg-[#21262d] border-[#388bfd] text-[#388bfd]'
        }`}>
          {message}
        </div>
      )}
    </div>
  </div>
  </div>
  );
}