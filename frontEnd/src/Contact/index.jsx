import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, UserIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { getCompanyInfo } from '../Dashboard/api/apiService';
import Button from '../Dashboard/UI/Button';
import axios from 'axios';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    getCompanyInfo()
      .then(res => {
        // On prend le premier résultat (la fiche unique)
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCompany(res.data[0]);
        }
      })
      .catch(() => setCompany(null));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    
    try {
      // Envoyer le message au backend
      const response = await axios.post('http://localhost:5000/api/receivedMessage/add', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        date: new Date().toISOString()
      });

      if (response.status === 201 || response.status === 200) {
        setStatus('Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setStatus('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-2 sm:px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10">
        {/* Bloc coordonnées */}
        <div className="flex-1 flex flex-col gap-6 sm:gap-8 justify-center">
          <div className="mb-2 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{company ? company.name : '...'}</h2>
            <p className="text-sm sm:text-base text-gray-600">Nous sommes à votre écoute pour toute question ou demande de devis.</p>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-800">{company ? `${company.address}${company.city ? ', ' + company.city : ''}${company.postal_code ? ' ' + company.postal_code : ''}${company.country ? ', ' + company.country : ''}` : '...'}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
              <a href={company ? `tel:${company.phone}` : undefined} className="text-sm sm:text-base text-gray-800 hover:text-green-700 transition-colors">{company ? company.phone : '...'}</a>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <EnvelopeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 flex-shrink-0" />
              <a href={company ? `mailto:${company.email}` : undefined} className="text-sm sm:text-base text-gray-800 hover:text-purple-700 transition-colors">{company ? company.email : '...'}</a>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="flex-1 bg-gray-50 rounded-xl p-4 sm:p-6 shadow-inner border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 absolute left-2 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-8 sm:pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm sm:text-base"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <div className="relative">
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 absolute left-2 top-2.5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-8 sm:pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-400 text-sm sm:text-base"
                    placeholder="Votre téléphone"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 absolute left-2 top-2.5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 sm:pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm sm:text-base"
                  placeholder="Votre email"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <div className="relative">
                <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5 absolute left-2 top-2.5 text-gray-400" />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full pl-8 sm:pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm sm:text-base"
                  placeholder="Votre message..."
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2 sm:py-3 font-semibold shadow-lg disabled:opacity-60 bg-gray-900 text-white hover:bg-gray-800 text-sm sm:text-base"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
            {status && (
              <div className="mt-2 text-center text-green-600 font-medium text-sm sm:text-base">{status}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
