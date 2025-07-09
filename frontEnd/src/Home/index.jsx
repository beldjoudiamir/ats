import { useState, useEffect } from "react";
import { TruckIcon, ShieldCheckIcon, ClockIcon, GlobeAltIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, UserGroupIcon, ChartBarIcon, ArrowRightIcon, StarIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const sliderImages = [
  "/slider/pexels-yu-han-huang-1778395-32672761.jpg",
  "/slider/pexels-marcin-jozwiak-199600-2800121.jpg",
  "/slider/pexels-rdne-8783548.jpg"
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(true);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les informations de l'entreprise
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/myCompanyInfo");
        if (response.data && response.data.length > 0) {
          setCompanyInfo(response.data[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'entreprise:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  // Slider automatique (toutes les 5s) avec effet zoom
  useEffect(() => {
    setZoom(false);
    const timer1 = setTimeout(() => setZoom(true), 100);
    const timer2 = setInterval(() => {
      setZoom(false);
      setTimeout(() => setCurrent((c) => (c + 1) % sliderImages.length), 200);
    }, 5000);
    return () => {
      clearTimeout(timer1);
      clearInterval(timer2);
    };
  }, []);

  const goTo = (idx) => {
    setZoom(false);
    setTimeout(() => {
      setCurrent(idx);
      setZoom(true);
    }, 200);
  };

  const formatAddress = () => {
    if (!companyInfo) return "Adresse non renseignée";
    
    const parts = [
      companyInfo.address,
      companyInfo.postal_code,
      companyInfo.city,
      companyInfo.country
    ].filter(part => part && part.trim());
    
    return parts.length > 0 ? parts.join(", ") : "Adresse non renseignée";
  };

  if (loading) {
    return <Loader size="large" color="gray" />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION AVEC SLIDER */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={sliderImages[current]}
            alt={`slide-${current}`}
            className={`w-full h-full object-cover transition-all duration-1000 ${zoom ? 'scale-110' : 'scale-100'} filter brightness-40`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        </div>
        
        {/* Contenu central */}
        <div className="relative z-10 text-center text-white px-2 sm:px-4 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
            {companyInfo?.name || ''}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-2">
            {companyInfo?.description || ""}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <Link
              to="/devis"
              className="bg-gradient-to-r from-gray-100 via-white to-gray-50 hover:from-gray-200 hover:via-gray-100 hover:to-gray-200 text-gray-800 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Demander un devis
            </Link>
            <button 
              onClick={() => {
                document.getElementById('services-section').scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105"
            >
              Nos services
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white rotate-90" />
        </div>
      </section>

      {/* SECTION SERVICES MODERNE */}
      <section id="services-section" className="py-12 sm:py-16 lg:py-20 px-2 sm:px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              Nos Solutions Logistiques
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Des services sur mesure pour répondre à tous vos besoins de transport
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: TruckIcon,
                title: "Transport Express",
                description: "Livraisons rapides et sécurisées dans toute l'Europe",
                features: ["24/48h", "Suivi GPS", "Assurance complète"],
                color: "blue"
              },
              {
                icon: ShieldCheckIcon,
                title: "Transport Sécurisé",
                description: "Protection maximale de vos marchandises",
                features: ["Surveillance 24h", "Conteneurs sécurisés", "Personnel qualifié"],
                color: "green"
              },
              {
                icon: GlobeAltIcon,
                title: "Transport International",
                description: "Solutions logistiques à l'échelle mondiale",
                features: ["Douanes", "Documentation", "Suivi temps réel"],
                color: "purple"
              },
              {
                icon: ClockIcon,
                title: "Logistique Juste-à-temps",
                description: "Optimisation des délais et des coûts",
                features: ["Planification", "Optimisation", "Flexibilité"],
                color: "orange"
              }
            ].map((service, index) => (
              <div key={index} className="group relative bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 border border-gray-200">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-${service.color}-50 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${service.color}-600`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  {service.description}
                </p>
                <ul className="space-y-1 sm:space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs sm:text-sm text-gray-500">
                      <CheckCircleIcon className={`w-3 h-3 sm:w-4 sm:h-4 text-${service.color}-400 mr-2`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION À PROPOS AVEC DESIGN MODERNE */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Pourquoi choisir {companyInfo?.name || ''} ?
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-900">Excellence opérationnelle</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {companyInfo?.industry && `Spécialisée dans ${companyInfo.industry}, `}notre expertise garantit des solutions logistiques optimales.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-900">Équipe expérimentée</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Plus de 15 ans d'expérience avec une équipe de professionnels qualifiés.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-900">Innovation continue</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Technologies de pointe pour optimiser vos processus logistiques.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/img/pexels-bastien-neves-2459695-4081978.jpg"
                alt="Équipe professionnelle"
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white text-gray-900 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">98%</div>
                <div className="text-xs sm:text-sm text-gray-600">Satisfaction client</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION STATISTIQUES */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { number: "10+", label: "Années d'expérience" },
              { number: "2000+", label: "Livraisons par an" },
              { number: "92%", label: "Satisfaction client" },
              { number: "24/7", label: "Support disponible" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION CONTACT MODERNE */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
            Prêt à transformer votre logistique ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour discuter de vos besoins et obtenir un devis personnalisé.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {companyInfo?.phone && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PhoneIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Téléphone</h3>
                  <a 
                    href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                    className="text-gray-200 hover:text-white transition-colors duration-300 text-lg font-medium"
                  >
                    {companyInfo.phone}
                  </a>
                  <p className="text-gray-300 text-sm mt-2">Appelez-nous directement</p>
                </div>
              </div>
            )}
            
            {companyInfo?.email && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <EnvelopeIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Email</h3>
                  <a 
                    href={`mailto:${companyInfo.email}`}
                    className="text-gray-200 hover:text-white transition-colors duration-300 text-lg font-medium"
                  >
                    {companyInfo.email}
                  </a>
                  <p className="text-gray-300 text-sm mt-2">Envoyez-nous un message</p>
                </div>
              </div>
            )}
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Adresse</h3>
                <div className="text-gray-200 text-lg font-medium">
                  {formatAddress()}
                </div>
                <p className="text-gray-300 text-sm mt-2">Venez nous rencontrer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


