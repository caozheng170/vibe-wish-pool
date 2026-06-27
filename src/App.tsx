import { Routes, Route, useParams } from 'react-router-dom';
import { SciFiBackground } from './components/layout/SciFiBackground';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './routes/Home';
import { Portfolio } from './routes/Portfolio';
import { ProjectDetail } from './routes/ProjectDetail';
import { WishPool } from './routes/WishPool';
import { WishNew } from './routes/WishNew';
import { WishDetail } from './routes/WishDetail';
import { Login } from './routes/Login';
import { Admin } from './routes/Admin';

function ProjectDetailRoute() {
  const { slug } = useParams<{ slug: string }>();
  return <ProjectDetail slug={slug ?? ''} />;
}

export default function App() {
  return (
    <SciFiBackground>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<ProjectDetailRoute />} />
          <Route path="/wish" element={<WishPool />} />
          <Route path="/wish/new" element={<WishNew />} />
          <Route path="/wish/:id" element={<WishDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </SciFiBackground>
  );
}
