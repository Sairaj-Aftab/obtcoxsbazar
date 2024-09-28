import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

function initializeAnalytics() {
  if (import.meta.env.MODE === "production") {
    ReactGA.initialize("G-CB1H3PDS5Y");
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    initializeAnalytics();

    // Track page view on route change
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
      title: document.title,
    });
  }, [location]);

  return null;
};

export default GoogleAnalytics;
