import { HashRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Template from './pages/template';
import Templates from './pages/templates';
import { useUserAuth } from './context/context';
import Login from './pages/login';
import { useRef, useState } from 'react';

const Popup = () => {

  const { access, state, setState } = useUserAuth()

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const initialMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (divRef.current) {
      initialMousePosition.current = { x: event.clientX, y: event.clientY };

      const handleMouseMove = (event: MouseEvent) => {
          const deltaX = event.clientX - initialMousePosition.current.x;
          const deltaY = event.clientY - initialMousePosition.current.y;
          setPosition(prevPosition => ({
            x: prevPosition.x - deltaX,
            y: prevPosition.y - deltaY
          }));
          initialMousePosition.current = { x: event.clientX, y: event.clientY };
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };


  return (
    <div className='h-screen w-full'>
      {state ?
        <div
          ref={divRef}
          style={{
            bottom: `${position.y}px`,
            right: `${position.x}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          className='main' >
          <Navbar />
          <HashRouter>
            <Routes>
              <Route path="/" element={access ? <Login /> : <Login />} />
              <Route path="/template" element={<Template />} />
              <Route path="/templates" element={<Templates />} />
            </Routes>
          </HashRouter>
        </div>
        :
        <div
          ref={divRef}
          style={{
            bottom: `${position.y}px`,
            right: `${position.x}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          onClick={() => setState(true)} className='w-[130px] h-[130px] font-extrabold shadow-lg box rounded-full p-[10px]' >
          blue
          <span className='text-[#0A66C2]' >
            parrot
          </span>

        </div>
      }

    </div>
  );
};

export default Popup;
