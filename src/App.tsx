import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/main';
import Navbar from './components/navbar';
import Template from './pages/template';
import Templates from './pages/templates';
import { useUserAuth } from './context/context';


const Popup = () => {

  const { access } = useUserAuth()


  return (
    <div className='h-screen w-full'>
      <Navbar />
      <div className=' h-screen w-full' >
        <MemoryRouter>
          <Routes>
            <Route path="/" element={ access ? <Templates /> : <Main /> } />
            <Route path="/template" element={<Template />} />
            <Route path="/templates" element={<Templates />} />
          </Routes>
        </MemoryRouter>
      </div>
    </div>
  );
};

export default Popup;
