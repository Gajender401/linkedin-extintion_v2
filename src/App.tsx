import { HashRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Template from './pages/template';
import Templates from './pages/templates';
import { useUserAuth } from './context/context';
import Login from './pages/login';
import { useEffect, useRef, useState } from 'react';
import Message from './components/message';
import ReactDOM from 'react-dom';


const Popup = () => {

  const { access, state, setState } = useUserAuth()

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const initialMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 100; // Adjust the scrolling amount as needed
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 100; // Adjust the scrolling amount as needed
    }
  };

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

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const footer = document.querySelector('.msg-form__footer');
          const parrot = document.querySelector('.msg_blue_parrot');
          if (footer && !parrot) {
            const newElement = document.createElement('div');
            newElement.className = 'msg_blue_parrot';

            // Create a container for the Message component
            const messageContainer = document.createElement('div');

            // Render the Message component into the container
            ReactDOM.render(
              <div className="flex-1 text-xl p-2 flex items-center justify-between">
                <div className="flex gap-1 px-1 items-stretch text-blue-600" style={{ opacity: 1 }}>
                  <button
                    disabled
                    className="text-gray-500 focus-visible:outline-none"
                    id="leftBtn"
                    style={{ opacity: 1, transform: 'none' }}
                    onClick={scrollLeft}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rounded-full transition-colors duration-200 ease-in-out">
                      <path d="M15 6l-6 6l6 6"></path>
                    </svg>
                  </button>
                  <div
                    className="flex max-w-[220px] items-center text-ellipsis whitespace-nowrap rounded-full border border-blue-500 font-semibold text-blue-500 transition-colors duration-300 ease-in-out hover:border-blue-600 active:border-blue-700 disabled:border-blue-200 disabled:text-blue-200 dark:border-blue-400 dark:text-blue-200 dark:active:text-blue-100 dark:disabled:border-blue-800 dark:disabled:text-blue-800"
                    ref={scrollContainerRef}
                    style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}
                  >
                    {[...Array(10)].map((_, index) => (
                      <button key={index} type="button" className="inline-block text-xl px-3 py-1 mr-2 text-center bg-blue-200 text-blue-800 rounded-md">
                        Reply "Yes"
                      </button>
                    ))}
                  </div>
                  <button
                    className="text-blue-500 focus-visible:outline-blue-400 dark:text-blue-200 dark:focus-visible:text-blue-300 dark:focus-visible:outline-blue-500 rounded-full outline-none transition-[background-color,outline] duration-300 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-0"
                    id="rightBtn"
                    style={{ opacity: 1, transform: 'none' }}
                    onClick={scrollRight}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rounded-full transition-colors duration-200 ease-in-out hover:bg-blue-100 dark:hover:bg-blue-300/50 bg-transparent">
                      <path d="M9 6l6 6l-6 6"></path>
                    </svg>
                  </button>
                </div>
                <button className=" text-blue-500 hover:border-blue-600 hover:bg-blue-100 focus-visible:ring-blue-400 active:border-blue-700 disabled:border-blue-200 dark:border-blue-400 dark:text-blue-200  dark:hover:bg-blue-300/50 dark:focus-visible:text-blue-300 dark:focus-visible:ring-blue-500 dark:active:bg-blue-300/30 dark:disabled:border-blue-800 gap-1 rounded-full border px-2 py-1 font-semibold ring-0 transition-[background-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring">
                  Create
                </button>
              </div>
              , messageContainer);

            // Append the container's contents to the new element
            if (messageContainer.firstChild) {
              newElement.appendChild(messageContainer.firstChild);
            }

            // Insert the new element before the footer
            footer.parentNode?.insertBefore(newElement, footer);

          }
        }
      }
    });

    // Start observing the changes in the DOM
    observer.observe(document.body, { childList: true, subtree: true });

  }, []);





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
