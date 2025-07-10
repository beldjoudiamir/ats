import React, { useState, useEffect } from 'react';
import { 
  ChevronRightIcon, 
  CheckIcon,
  DocumentTextIcon,
  UserIcon,
  TruckIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  CubeIcon,
  ScaleIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import API_BASE_URL from '../config/api.js';

const Devis = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Informations client
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientCity: '',
    clientZipCode: '',
    clientCountry: '',
    clientTaxID: '',
    
    // Informations transport
    departureAddress: '',
    departureCity: '',
    departureZipCode: '',
    departureCountry: '',
    departureDate: '',
    departureTime: '',
    
    arrivalAddress: '',
    arrivalCity: '',
    arrivalZipCode: '',
    arrivalCountry: '',
    arrivalDate: '',
    arrivalTime: '',
    
    // Informations marchandise
    merchandiseType: '',
    weight: '',
    volume: '',
    quantity: '',
    specialRequirements: '',
    
    // Informations tarifaires
    basePrice: '',
    additionalServices: [],
    totalPrice: '',
    paymentTerms: '',
    validityPeriod: ''
  });

  const [selectedClient, setSelectedClient] = useState('');
  const [selectedTransportType, setSelectedTransportType] = useState('');
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState('');

  // Données pour les menus déroulants
  const clients = [
    { id: 1, name: 'Entreprise ABC', email: 'contact@abc.com' },
    { id: 2, name: 'Société XYZ', email: 'info@xyz.com' },
    { id: 3, name: 'Transport Plus', email: 'contact@transportplus.com' }
  ];

  const transportTypes = [
    'Transport routier',
    'Transport maritime',
    'Transport aérien',
    'Transport multimodal',
    'Express'
  ];

  const paymentTerms = [
    'Paiement à 30 jours',
    'Paiement à 60 jours',
    'Paiement comptant',
    'Paiement à réception',
    'Paiement en plusieurs fois'
  ];

  const additionalServicesOptions = [
    'Assurance transport',
    'Emballage spécial',
    'Livraison express',
    'Suivi GPS',
    'Manutention spéciale',
    'Stockage temporaire'
  ];

  const steps = [
    { 
      id: 1, 
      name: 'Client', 
      icon: BuildingOfficeIcon, 
      description: 'Sélectionnez ou créez un client',
      color: 'bg-amber-500'
    },
    { 
      id: 2, 
      name: 'Transport', 
      icon: TruckIcon, 
      description: 'Adresses de départ et arrivée',
      color: 'bg-blue-500'
    },
    { 
      id: 3, 
      name: 'Marchandise', 
      icon: CubeIcon, 
      description: 'Type et caractéristiques',
      color: 'bg-green-500'
    },
    { 
      id: 4, 
      name: 'Services additionnels', 
      icon: ScaleIcon, 
      description: 'Services et options',
      color: 'bg-purple-500'
    },
    { 
      id: 5, 
      name: 'Validation', 
      icon: DocumentTextIcon, 
      description: 'Récapitulatif et envoi',
      color: 'bg-emerald-500'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter(s => s !== service)
        : [...prev.additionalServices, service]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateTotal = () => {
    let total = parseFloat(formData.basePrice) || 0;
    total += formData.additionalServices.length * 50; // 50€ par service additionnel
    return total;
  };

  // Fonction pour envoyer la demande de devis à la messagerie
  const submitDevisRequest = async () => {
    setIsSubmitting(true);
    try {
      // Préparer le message détaillé
      const messageContent = `
DEMANDE DE DEVIS - TRANSPORT

INFORMATIONS CLIENT :
Nom : ${formData.clientName || 'Non renseigné'}
Email : ${formData.clientEmail || 'Non renseigné'}
Téléphone : ${formData.clientPhone || 'Non renseigné'}
Adresse : ${formData.clientAddress || 'Non renseigné'}, ${formData.clientCity || ''} ${formData.clientZipCode || ''}, ${formData.clientCountry || ''}

INFORMATIONS TRANSPORT :
Type de transport : ${selectedTransportType || 'Non sélectionné'}
Adresse de départ : ${formData.departureAddress || 'Non renseigné'}, ${formData.departureCity || ''} ${formData.departureZipCode || ''}, ${formData.departureCountry || ''}
Date de départ : ${formData.departureDate || 'Non renseigné'} à ${formData.departureTime || 'Non renseigné'}
Adresse d'arrivée : ${formData.arrivalAddress || 'Non renseigné'}, ${formData.arrivalCity || ''} ${formData.arrivalZipCode || ''}, ${formData.arrivalCountry || ''}
Date d'arrivée : ${formData.arrivalDate || 'Non renseigné'} à ${formData.arrivalTime || 'Non renseigné'}

INFORMATIONS MARCHANDISE :
Type de marchandise : ${formData.merchandiseType || 'Non renseigné'}
Poids : ${formData.weight || '0'} kg
Volume : ${formData.volume || '0'} m³
Quantité : ${formData.quantity || '0'}
Exigences spéciales : ${formData.specialRequirements || 'Aucune'}

SERVICES ADDITIONNELS :
${formData.additionalServices.length > 0 ? formData.additionalServices.map(service => `- ${service}`).join('\n') : 'Aucun service additionnel sélectionné'}

INFORMATIONS TARIFAIRES :
Prix de base : ${formData.basePrice || '0'} €
Conditions de paiement : ${selectedPaymentTerms || 'Non sélectionné'}
Période de validité : ${formData.validityPeriod || 'Non renseigné'}

ESTIMATION TOTALE : ${calculateTotal()} €

Cette demande a été envoyée depuis le formulaire de devis du site web.
      `.trim();

      // Envoyer à la messagerie
      const response = await axios.post(`${API_BASE_URL}/api/receivedMessage/add`, {
        name: formData.clientName || 'Demande de devis',
        email: formData.clientEmail || 'contact@ats-transport.com',
        phone: formData.clientPhone || '',
        message: messageContent,
        date: new Date().toISOString()
      });

      if (response.data.success) {
        setSubmitSuccess(true);
        // Réinitialiser le formulaire après 3 secondes
        setTimeout(() => {
          setFormData({
            clientName: '',
            clientEmail: '',
            clientPhone: '',
            clientAddress: '',
            clientCity: '',
            clientZipCode: '',
            clientCountry: '',
            clientTaxID: '',
            departureAddress: '',
            departureCity: '',
            departureZipCode: '',
            departureCountry: '',
            departureDate: '',
            departureTime: '',
            arrivalAddress: '',
            arrivalCity: '',
            arrivalZipCode: '',
            arrivalCountry: '',
            arrivalDate: '',
            arrivalTime: '',
            merchandiseType: '',
            weight: '',
            volume: '',
            quantity: '',
            specialRequirements: '',
            basePrice: '',
            additionalServices: [],
            totalPrice: '',
            paymentTerms: '',
            validityPeriod: ''
          });
          setSelectedClient('');
          setSelectedTransportType('');
          setSelectedPaymentTerms('');
          setCurrentStep(1);
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande de devis:', error);
      alert('Erreur lors de l\'envoi de votre demande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Créer un nouveau client</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="email@entreprise.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de TVA</label>
                  <input
                    type="text"
                    value={formData.clientTaxID}
                    onChange={(e) => handleInputChange('clientTaxID', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="FR12345678901"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={formData.clientAddress}
                    onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="123 Rue de la Paix"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={formData.clientCity}
                    onChange={(e) => handleInputChange('clientCity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    value={formData.clientZipCode}
                    onChange={(e) => handleInputChange('clientZipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="75001"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de transport
              </label>
              <select
                value={selectedTransportType}
                onChange={(e) => setSelectedTransportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
              >
                <option value="">Sélectionnez le type de transport</option>
                {transportTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Adresse de départ */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  Adresse de départ
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={formData.departureAddress}
                      onChange={(e) => handleInputChange('departureAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                      placeholder="Adresse de départ"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                      <input
                        type="text"
                        value={formData.departureCity}
                        onChange={(e) => handleInputChange('departureCity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                        placeholder="Ville"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                      <input
                        type="text"
                        value={formData.departureZipCode}
                        onChange={(e) => handleInputChange('departureZipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                        placeholder="Code postal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                    <input
                      type="text"
                      value={formData.departureCountry}
                      onChange={(e) => handleInputChange('departureCountry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                      placeholder="France"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de départ</label>
                      <input
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => handleInputChange('departureDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure de départ</label>
                      <input
                        type="time"
                        value={formData.departureTime}
                        onChange={(e) => handleInputChange('departureTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Adresse d'arrivée */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-4 flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  Adresse d'arrivée
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={formData.arrivalAddress}
                      onChange={(e) => handleInputChange('arrivalAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                      placeholder="Adresse d'arrivée"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                      <input
                        type="text"
                        value={formData.arrivalCity}
                        onChange={(e) => handleInputChange('arrivalCity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                        placeholder="Ville"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                      <input
                        type="text"
                        value={formData.arrivalZipCode}
                        onChange={(e) => handleInputChange('arrivalZipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                        placeholder="Code postal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                    <input
                      type="text"
                      value={formData.arrivalCountry}
                      onChange={(e) => handleInputChange('arrivalCountry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                      placeholder="France"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date d'arrivée</label>
                      <input
                        type="date"
                        value={formData.arrivalDate}
                        onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure d'arrivée</label>
                      <input
                        type="time"
                        value={formData.arrivalTime}
                        onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-orange-900 mb-4 flex items-center">
                <CubeIcon className="w-5 h-5 mr-2" />
                Informations sur la marchandise
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de marchandise</label>
                  <input
                    type="text"
                    value={formData.merchandiseType}
                    onChange={(e) => handleInputChange('merchandiseType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="Ex: Électronique, Textile, Alimentaire..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Volume (m³)</label>
                  <input
                    type="number"
                    value={formData.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exigences spéciales</label>
                  <textarea
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors duration-200"
                    placeholder="Température contrôlée, Fragile, Urgent..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center">
                <ScaleIcon className="w-5 h-5 mr-2" />
                Services additionnels
              </h3>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Sélectionnez les services additionnels</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {additionalServicesOptions.map(service => (
                    <label key={service} className="flex items-center space-x-3 cursor-pointer p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={formData.additionalServices.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckIcon className="h-12 w-12 text-green-500 mr-3" />
                  <h3 className="text-xl font-medium text-green-800">Demande envoyée avec succès !</h3>
                </div>
                <p className="text-green-700 mb-4">
                  Votre demande de devis a été envoyée à notre équipe. Nous vous répondrons dans les plus brefs délais.
                </p>
                <p className="text-sm text-green-600">
                  Vous recevrez une confirmation par email à l'adresse : {formData.clientEmail}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="w-5 h-5 mr-2" />
                  Récapitulatif de votre demande de devis
                </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations client */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-3">Informations client</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nom :</span> {formData.clientName || 'Non renseigné'}</p>
                    <p><span className="font-medium">Email :</span> {formData.clientEmail || 'Non renseigné'}</p>
                    <p><span className="font-medium">Téléphone :</span> {formData.clientPhone || 'Non renseigné'}</p>
                    <p><span className="font-medium">Adresse :</span> {formData.clientAddress || 'Non renseigné'}</p>
                  </div>
                </div>

                {/* Informations transport */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-3">Transport</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Type :</span> {selectedTransportType || 'Non sélectionné'}</p>
                    <p><span className="font-medium">Départ :</span> {formData.departureAddress || 'Non renseigné'}</p>
                    <p><span className="font-medium">Arrivée :</span> {formData.arrivalAddress || 'Non renseigné'}</p>
                    <p><span className="font-medium">Date départ :</span> {formData.departureDate || 'Non renseigné'}</p>
                  </div>
                </div>

                {/* Marchandise */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-3">Marchandise</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Type :</span> {formData.merchandiseType || 'Non renseigné'}</p>
                    <p><span className="font-medium">Poids :</span> {formData.weight || '0'} kg</p>
                    <p><span className="font-medium">Volume :</span> {formData.volume || '0'} m³</p>
                    <p><span className="font-medium">Quantité :</span> {formData.quantity || '0'}</p>
                  </div>
                </div>

                {/* Services additionnels */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-3">Services additionnels</h4>
                  <div className="space-y-2 text-sm">
                    {formData.additionalServices.length > 0 ? (
                      formData.additionalServices.map((service, index) => (
                        <p key={index}><span className="font-medium">•</span> {service}</p>
                      ))
                    ) : (
                      <p className="text-gray-500">Aucun service additionnel sélectionné</p>
                    )}
                    <p className="font-medium text-gray-600 mt-3">
                      Total : {formData.additionalServices.length} service(s) sélectionné(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={submitDevisRequest}
                  disabled={isSubmitting}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                </button>
              </div>
            </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Demande de devis</h1>
          <p className="text-gray-600 text-lg">Suivez les étapes pour demander votre devis de transport</p>
        </div>

        {/* Steps indicator - Amélioré */}
        <div className="mb-12">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-4 lg:space-x-8">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="relative flex-1">

                  
                  {/* Cercle du step */}
                  <div className="relative flex flex-col items-center">
                    <div 
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        step.id < currentStep
                          ? 'bg-gray-400 border-gray-400'
                          : step.id === currentStep
                          ? `${step.color} border-gray-400 ring-4 ring-gray-100`
                          : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      ) : step.id === currentStep ? (
                        React.createElement(step.icon, { className: "h-6 w-6 text-white", "aria-hidden": "true" })
                      ) : (
                        React.createElement(step.icon, { className: "h-6 w-6 text-gray-400", "aria-hidden": "true" })
                      )}
                    </div>
                    
                    {/* Label du step */}
                    <div className="mt-3 text-center">
                      <span 
                        className={`text-sm font-semibold transition-colors duration-300 ${
                          step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {step.name}
                      </span>
                      <p 
                        className={`text-xs mt-1 transition-colors duration-300 ${
                          step.id === currentStep ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-xl p-8 border border-gray-100">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg ${steps[currentStep - 1].color} mr-4`}>
                {React.createElement(steps[currentStep - 1].icon, { className: "h-8 w-8 text-white" })}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {steps[currentStep - 1].name}
                </h2>
                <p className="text-gray-600">{steps[currentStep - 1].description}</p>
              </div>
            </div>
          </div>

          {renderStepContent()}

          {/* Navigation buttons - Améliorés */}
          <div className="flex justify-between mt-10 pt-8 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center ${
                currentStep === 1 || isSubmitting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-600 hover:border-gray-700 transform hover:-translate-y-0.5'
              }`}
            >
              <ChevronRightIcon className="h-4 w-4 mr-2 rotate-180" />
              Précédent
            </button>
            
            <button
              onClick={nextStep}
              disabled={currentStep === steps.length || isSubmitting}
              className={`px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center ${
                currentStep === steps.length || isSubmitting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700 transform hover:-translate-y-0.5'
              }`}
            >
              {currentStep === steps.length ? 'Terminé' : 'Suivant'}
              {currentStep !== steps.length && <ChevronRightIcon className="ml-2 h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devis;