import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import NavBar from "./navBar/index.jsx";
import Home from "./Home/index.jsx";
import Devis from "./Devis/index.jsx";
import Contact from "./Contact/index.jsx";
import MentionsLegales from "./MentionsLegales/index.jsx";
import PolitiqueConfidentialite from "./PolitiqueConfidentialite/index.jsx";
import ConditionsUtilisation from "./ConditionsUtilisation/index.jsx";
import Connexion from "./Connexion/index.jsx";
import TableauDeBord from "./Dashboard/TableauDeBord/index.jsx";
import NotreEntreprise from "./Dashboard/notreEntreprise/index.jsx";
import Clients from "./Dashboard/Clients/index.jsx";
import NosDevis from "./Dashboard/NosDevis/index.jsx";
import ListeCommissionnaire from "./Dashboard/listeCommissionnaire/index.jsx";
import Factures from "./Dashboard/Factures/index.jsx";
import Transport from "./Dashboard/Transport/index.jsx";
import Messagerie from "./Dashboard/Messagerie/index.jsx";
import Utilisateurs from "./Dashboard/Utilisateurs/index.jsx";
import ConditionsTransport from "./Dashboard/ConditionsTransport/index.jsx";
import Footer from "./footer/index.jsx";
import PrivateRoute from "./PrivateRoute";
import NotFound from "./NotFound";
import ApiTest from "./components/ApiTest";

export default function App() {
  const location = useLocation();

  // Effet pour remonter en haut de la page à chaque changement de route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Définir les routes du dashboard
  const dashboardRoutes = [
    "/dashboard/full",
    "/NotreEntreprise",
    "/clients",
    "/listeCommissionnaire",
    "/nosDevis",
    "/factures",
    "/transport",
    "/messagerie",
    "/utilisateurs",
    "/dashboard/conditions-transport",
  ];

  // Vérifier si l'URL actuelle correspond à une page du Dashboard
  const isDashboardPage = dashboardRoutes.includes(location.pathname);

  return (
    <>
      {/* Barre de navigation - masquée sur les pages du dashboard */}
      {!isDashboardPage && <NavBar />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devis" element={<Devis />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
        <Route path="/connexion" element={<Connexion />} />

        {/* Routes protégées du dashboard */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/full" element={<TableauDeBord />} />
          <Route path="/NotreEntreprise" element={<NotreEntreprise />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/listeCommissionnaire" element={<ListeCommissionnaire />} />
          <Route path="/nosDevis" element={<NosDevis />} />
          <Route path="/factures" element={<Factures />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/messagerie" element={<Messagerie />} />
          <Route path="/utilisateurs" element={<Utilisateurs />} />
          <Route path="/dashboard/conditions-transport" element={<ConditionsTransport />} />
        </Route>

        {/* Route de test temporaire pour diagnostiquer l'API */}
        <Route path="/api-test" element={<ApiTest />} />

        {/* Page 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Masquer le Footer sur les pages du Dashboard */}
      {!isDashboardPage && <Footer />}
    </>
  );
}
