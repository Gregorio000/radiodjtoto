import { Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Schedule } from './pages/Schedule';
import { NotFound } from './pages/NotFound';

/** Definizione delle rotte dell'applicazione. */
export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/palinsesto" element={<Schedule />} />
        <Route path="/chi-siamo" element={<About />} />
        <Route path="/contatti" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
