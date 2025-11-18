import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import "@fortawesome/fontawesome-free/css/all.min.css";


import {
  NotFoundPage,
  Hero,
  Navbar,
  Theme,
  About,
  ReasonsToAttend,
  Footer,
  PrivacyPolicy,
  NoRefundPolicy,
  TermsAndConditions,
  TicketSection,
  HeroPhone,
  ThreeDViewer,
  Form,
  PeopleSection,
  SeatReservationForm,
  StudentRegForm,
  PeopleSectionPhone,
  VideoSection,
  Test,
  ContactUs,
  FeedbackForm,
} from "./components/index";
import "./App.css";

const isPhone = window.innerWidth >= 800;
function TrackPageViews() {



  return null;
}

function SectionWrapper({ children, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { triggerOnce: true, threshold: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <TrackPageViews /> {/* Page views will be tracked on navigation */}
      <Routes>
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <div className="mt-8">
                <ContactUs />
              </div>
              <Footer />
            </>
          }
        />
        <Route path="*" element={<NotFoundPage />} />

        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/policy" element={<PrivacyPolicy />} />
        <Route path="/refund" element={<NoRefundPolicy />} />
        <Route path="/term" element={<TermsAndConditions />} />

        
        <Route
          path="/"
          element={
            <div id="Home">
              {false ? (
                <Hero />
              ) : (
                <>
                  <Navbar /> <HeroPhone />
                </>
              )}
              <div className="page-container">
                <SectionWrapper className="trailer-section">
                  <VideoSection
                    videoUrl="https://storage.googleapis.com/maiu/trailer_final.mp4"
                    thumbnail="/images/thumbnail1.jpg"
                  />
                </SectionWrapper>

                <SectionWrapper className="theme-section">
                  <Theme />
                </SectionWrapper>
                <SectionWrapper className="ticket-sections">
                  <TicketSection />
                </SectionWrapper>
                <SectionWrapper className="about-section" id="about">
                  <About id="about" />
                </SectionWrapper>
              </div>
              <SectionWrapper className="speaker-section mt-32">
                <Test id="speaker" />
              </SectionWrapper>
              <SectionWrapper className="reasons-section">
                <ReasonsToAttend />
              </SectionWrapper>
              {/* <SectionWrapper className="sponsor-section"> */}
              <SectionWrapper className="">
                <div id="contact footer">
                  <Footer />
                </div>
              </SectionWrapper>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const ComingSoon = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center">
    <ThreeDViewer modelPath="/model/logo.glb" />
    <motion.img
      src="/logo_wl.webp"
      alt="TEDxNERIST Logo"
      className="w-60 mb-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    />
    <motion.h2
      className="text-3xl mt-2"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
    >
      Lighthouse Apus
    </motion.h2>
    <motion.p
      className="text-lg mt-2 italic"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5 }}
    >
      "The Indomitable Spirit"
    </motion.p>
    <motion.p
      className="text-lg mt-4 font-semibold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
    >
      🎟️ Ticket Booking Coming Soon!
    </motion.p>
  </div>
);

export default App;
