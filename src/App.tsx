import { HashRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/main';
import Navbar from './components/navbar';
import Template from './pages/template';
import Templates from './pages/templates';


const Popup = () => {

  return (
    <div className='h-screen w-full'>
      <Navbar />
      <div className='p-5 h-screen w-full' >
      <HashRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/template" element={<Template />} />
          <Route path="/templates" element={<Templates />} />
        </Routes>
      </HashRouter>
      </div>
    </div>
  );
};

export default Popup;
