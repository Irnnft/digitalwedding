"use client"
// FIX: Imported useMemo to fix the exhaustive-deps warning.
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Menu, X, MapPin, Clock, Calendar, Heart, Gift, Copy, ExternalLink, Users, CheckCircle
// FIX: Removed unused 'Home' and 'Banknote' icons.
} from 'lucide-react';
import { Alex_Brush, Cormorant_Garamond, Questrial } from 'next/font/google';

// --- Font Setup ---
const alexBrush = Alex_Brush({
  subsets: ['latin'],
  weight: ['400'],
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['italic', 'normal'],
});
const questrial = Questrial({
  subsets: ['latin'],
  weight: ['400'],
});

// --- Types ---
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95], staggerChildren: 0.2 }}
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] }}
};

// =================================================================
// COVER COMPONENT
// =================================================================
interface CoverProps {
  onOpen: () => void;
}
const Cover: React.FC<CoverProps> = ({ onOpen }) => {
  return (
    <motion.section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
        <motion.p variants={itemVariants} className={`${cormorant.className} text-sky-600 text-lg mb-4`}>The Wedding of</motion.p>
        <motion.h1 variants={itemVariants} className={`${alexBrush.className} text-8xl text-sky-900`}>Feby</motion.h1>
        <motion.p variants={itemVariants} className={`${cormorant.className} text-4xl text-sky-500 my-2`}>&</motion.p>
        <motion.h1 variants={itemVariants} className={`${alexBrush.className} text-8xl text-sky-900 mb-12`}>Fauzi</motion.h1>
        <motion.div variants={itemVariants} className="border-t border-b border-sky-300 py-4 mb-12">
          <p className="text-sky-800 font-semibold tracking-widest text-sm">06 . 09 . 2025</p>
        </motion.div>
        <motion.button onClick={onOpen} className="bg-sky-800 hover:bg-sky-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition-colors" variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button">
          Open Invitation
        </motion.button>
      </motion.div>
    </motion.section>
  );
};

// ==================================================================
// MAIN CONTENT COMPONENT
// ==================================================================
interface MainContentProps {
  navItems: NavItem[];
  activeSection: string;
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
  scrollToSection: (sectionId: string) => void;
  copyToClipboard: (text: string, message: string) => void;
  showNotification: boolean;
  notificationMessage: string;
}
const MainContent: React.FC<MainContentProps> = ({
  navItems, // FIX: This prop is now correctly used below.
  activeSection,
  isNavOpen,
  setIsNavOpen,
  scrollToSection,
  copyToClipboard,
  showNotification,
  notificationMessage
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8, ease: "easeInOut", delay: 0.5 } }}
    >
      {/* Navigation */}
      <motion.div className="fixed top-5 right-5 z-50" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, duration: 0.5, type: "spring" }}>
        <motion.button className="w-12 h-12 bg-sky-800 rounded-full shadow-lg flex items-center justify-center text-white" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setIsNavOpen(!isNavOpen)} type="button" aria-label="Toggle navigation menu">
          <AnimatePresence mode="wait">{isNavOpen ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={20} /></motion.div> : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu size={20} /></motion.div>}</AnimatePresence>
        </motion.button>
        <AnimatePresence>
          {isNavOpen && (
            <motion.div className="absolute top-14 right-0 bg-white/95 backdrop-blur-md rounded-lg p-2 shadow-lg border border-sky-200" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {/* FIX: Removed the hardcoded 'mainNavItems' and now uses the 'navItems' prop */ }
              {navItems.map((item, index) => (
                <motion.button key={item.id} className={`w-full px-3 py-2.5 text-left rounded-md mb-1 last:mb-0 transition-colors flex items-center gap-3 text-sm ${activeSection === item.id ? 'bg-sky-100 text-sky-800 font-semibold' : 'text-sky-600 hover:bg-sky-100'}`} onClick={() => scrollToSection(item.id)} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} type="button">{item.icon}<span>{item.label}</span></motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
            <CheckCircle size={18} /><span className="text-sm font-medium">{notificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Couple Section */}
      <section id="couple" className="min-h-screen bg-white px-8 py-20 text-center">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <motion.div className="mb-12" variants={itemVariants}>
            <h2 className={`${cormorant.className} text-5xl text-sky-900 font-bold mb-4`}>The Couple</h2>
            <p className="text-sky-600 max-w-sm mx-auto leading-relaxed">Dengan rahmat Allah SWT, kami menyatukan cinta dalam ikatan suci pernikahan.</p>
        </motion.div>
        <motion.div
            variants={itemVariants}
            className="text-center bg-sky-100/50 p-6 rounded-xl border border-sky-200/80 mb-12"
        >
            <p dir="rtl" className="text-2xl font-serif text-sky-800 leading-loose">
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ
            </p>
            {/* FIX: Replaced quotes with &quot; to fix the react/no-unescaped-entities error */}
            <p className="font-serif-display italic text-slate-600 mt-6 text-sm leading-relaxed">
              &quot;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.&quot;
            </p>
            <p className="mt-4 font-sans font-semibold text-sky-700">
            (QS. Ar-Rum: 21)
            </p>
        </motion.div>

        <motion.div className="space-y-10" variants={itemVariants}>
            <div>
            <h3 className={`${alexBrush.className} text-5xl text-sky-900`}>Feby Wulandari</h3>
            <p className={`${cormorant.className} text-sky-600 text-lg mt-1`}>Putri dari Bapak Marimin & Ibu Sumirahayu</p>
            </div>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <Heart className="w-6 h-6 text-sky-400 mx-auto" />
            </motion.div>
            <div>
            
            <h3 className={`${alexBrush.className} text-5xl text-sky-900`}>Rahmat Fauzi</h3>
            <p className={`${cormorant.className} text-sky-600 text-lg mt-1`}>Putra dari Bapak Yusril & Ibu Yurnita</p>
            </div>
        </motion.div>
        </motion.div>
      </section>

      {/* Event Section */}
      <section id="event" className="min-h-screen bg-sky-50 px-8 py-20 text-center">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <motion.div className="mb-12" variants={itemVariants}>
            <h2 className={`${cormorant.className} text-5xl text-sky-900 font-bold mb-4`}>The Event</h2>
            <p className="text-sky-600 max-w-sm mx-auto leading-relaxed">Kami mengundang Anda untuk hadir dan memberikan doa restu pada hari bahagia kami.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg border border-sky-200 shadow-sm">
            <div className="flex flex-col items-center">
                <div className="text-center">
                <p className="font-semibold text-sky-800 text-xl tracking-wider">SABTU, 6 SEPTEMBER 2025</p>
                </div>
                <div className="w-px h-10 bg-sky-200 my-6"></div>
                <div className="grid grid-cols-1 gap-8 text-center w-full">
                <div>
                    <h3 className={`${cormorant.className} text-3xl text-sky-700 font-bold mb-1`}>Akad Nikah</h3>
                    <p className="font-semibold text-sky-600"><Clock size={14} className="inline mr-1" /> 09:00 WIB</p>
                </div>
                <div>
                    <h3 className={`${cormorant.className} text-3xl text-sky-700 font-bold mb-1`}>Resepsi</h3>
                    <p className="font-semibold text-sky-600"><Clock size={14} className="inline mr-1" /> 09:00 WIB</p>
                </div>
                </div>
                <div className="w-px h-10 bg-sky-200 my-6"></div>
                <div>
                <p className="font-semibold text-sky-700">Bertempat di Kediaman Mempelai Wanita</p>
                <p className="text-sm text-sky-500 mt-1">SP 2 Blok A Suka Makmur, Kec. Gunung Sahilan</p>
                </div>
            </div>
            </motion.div>
        </motion.div>
      </section>

      {/* Gift Section */}
      <section id="gift" className="min-h-screen bg-white px-8 py-20">
         <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className={`${cormorant.className} text-5xl text-sky-900 font-bold mb-4`}>Wedding Gift</h2>
            <p className="text-sky-600 max-w-sm mx-auto leading-relaxed">Doa restu Anda adalah hadiah terindah. Namun jika ingin memberikan tanda kasih, kami sediakan fasilitas berikut.</p>
            </motion.div>
            <motion.div className="space-y-4" variants={itemVariants}>
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 text-center">
                <Gift size={32} className="mx-auto text-sky-500 mb-3" />
                <h3 className="text-lg font-semibold text-sky-700">ShopeePay</h3>
                <p className="text-sm text-sky-500 mb-3">a.n. Feby Wulandari</p>
                <p className="font-semibold text-sky-800 text-lg tracking-wider mb-4">081266022909</p>
                <button onClick={() => copyToClipboard('081266022909', 'Nomor ShopeePay disalin!')} className="bg-sky-800 text-white w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-sky-700 transition-colors">
                <Copy size={16} /> Salin Nomor
                </button>
            </div>
            </motion.div>
        </motion.div>
      </section>

      {/* Location Section */}
      <section id="location" className="min-h-screen bg-sky-50 px-8 py-20">
         <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <motion.div className="text-center mb-12" variants={itemVariants}>
                <h2 className={`${cormorant.className} text-5xl text-sky-900 font-bold mb-4`}>Location</h2>
                <p className="text-sky-600 max-w-sm mx-auto leading-relaxed">Gunakan peta untuk mempermudah perjalanan Anda menuju lokasi acara.</p>
            </motion.div>
            <motion.div className="bg-white rounded-lg p-6 shadow-sm border border-sky-200" variants={itemVariants}>
                <div className="aspect-w-16 aspect-h-9 bg-sky-200 rounded-md mb-6 overflow-hidden">
                   <iframe
                     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.81734273099!2d101.37386331535705!3d0.3204919632843478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d3b8f158f8f8b9%3A0x8f8c8d8f8d8f8d8!2sSuka%20Makmur%2C%20Gunung%20Sahilan%2C%20Kampar%20Regency%2C%20Riau!5e0!3m2!1sen!2sid!4v1662456789012!5m2!1sen!2sid"
                     width="100%"
                     height="100%"
                     style={{ border: 0 }}
                     allowFullScreen={true}
                     loading="lazy"
                     referrerPolicy="no-referrer-when-downgrade"
                   ></iframe>
                </div>
                <div className="text-center mb-6">
                    <p className="font-semibold text-sky-800">Kediaman Mempelai Wanita</p>
                    <p className="text-sm text-sky-500 mt-1">SP 2 Blok A Suka Makmur, Kec. Gunung Sahilan, Kab. Kampar - Riau</p>
                </div>
                <motion.button onClick={() => window.open('https://goo.gl/maps/9EpSuiYRHa3aSx6a7?g_st=aw', '_blank')} className="w-full bg-sky-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-sky-700 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <ExternalLink size={16} /> Buka Google Maps
                </motion.button>
            </motion.div>
         </motion.div>

        {/* Footer */}
        <motion.div className="text-center mt-20 pt-10 border-t border-sky-200" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={itemVariants}>
            <p className={`${cormorant.className} italic text-sky-600 max-w-md mx-auto mb-6`}>Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>
            <h3 className={`${alexBrush.className} text-5xl text-sky-800`}>Feby & Fauzi</h3>
        </motion.div>
      </section>
    </motion.div>
  );
};

// =================================================================
// PARENT COMPONENT
// =================================================================
const WeddingInvitation: React.FC = () => {
  const [isInvitationOpen, setIsInvitationOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('couple');
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  // FIX: Wrapped navItems in useMemo to prevent re-creation on every render.
  const navItems: NavItem[] = useMemo(() => [
    { id: 'couple', label: 'The Couple', icon: <Users className="w-4 h-4" /> },
    { id: 'event', label: 'The Event', icon: <Calendar className="w-4 h-4" /> },
    { id: 'gift', label: 'Wedding Gift', icon: <Gift className="w-4 h-4" /> },
    { id: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
  ], []);

  const handleOpenInvitation = () => {
    setIsInvitationOpen(true);
  };

  const scrollToSection = (sectionId: string): void => {
    setActiveSection(sectionId);
    setIsNavOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const copyToClipboard = async (text: string, successMessage: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      showNotificationMessage(successMessage);
    } catch (_err) { // FIX: Prefixed 'err' with an underscore as it's not being used.
      showNotificationMessage('Gagal menyalin ke clipboard');
    }
  };

  const showNotificationMessage = (message: string): void => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  useEffect(() => {
    if (!isInvitationOpen) return;
    const handleScroll = (): void => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInvitationOpen, navItems]);

  return (
    <div className={`w-full max-w-md mx-auto bg-sky-50 shadow-xl min-h-screen relative ${questrial.className}`}>
      <AnimatePresence mode="wait">
        {
          !isInvitationOpen ? (
            <Cover key="cover" onOpen={handleOpenInvitation} />
          ) : (
            <MainContent
              key="main-content"
              navItems={navItems}
              activeSection={activeSection}
              isNavOpen={isNavOpen}
              setIsNavOpen={setIsNavOpen}
              scrollToSection={scrollToSection}
              copyToClipboard={copyToClipboard}
              showNotification={showNotification}
              notificationMessage={notificationMessage}
            />
          )
        }
      </AnimatePresence>
    </div>
  );
};

export default WeddingInvitation;