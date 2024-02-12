import Navbar from './components/navbar';
import { useUserAuth } from './context/context';
import Login from './pages/login';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "./@/lib/utils"
import { Button } from "./@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
} from "./@/components/ui/command"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  }
]

const Popup = () => {

  const { state, setState } = useUserAuth()

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const initialMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [open, setOpen] = useState(true)
  const [value, setValue] = useState("")
  const divRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 200;
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 200;
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
              <div className="flex-1 text-xl p-2 relative flex items-center justify-between">
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[150px] popover_trigger justify-between"
                  >
                    Templates
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                <div className={`popover w-[200px] bottom-14 border bg-slate-200 absolute p-0 ${open?'':'hidden'}`} >
                    <Command>
                      <CommandGroup>
                        {frameworks.map((framework) => (
                          <CommandItem
                            key={framework.value}
                            value={framework.value}
                            onSelect={(currentValue) => {
                              setValue(currentValue === value ? "" : currentValue)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === framework.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {framework.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                </div>

                <div className="flex gap-1 px-1 items-stretch text-blue-600" style={{ opacity: 1 }}>
                  <button
                    className="text-blue-500 bp-btn-left focus-visible:outline-blue-400 dark:text-blue-200 dark:focus-visible:text-blue-300 dark:focus-visible:outline-blue-500 rounded-full outline-none transition-[background-color,outline] duration-300 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-0"
                    style={{ opacity: 1, transform: 'none' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rounded-full transition-colors duration-200 ease-in-out">
                      <path d="M15 6l-6 6l6 6"></path>
                    </svg>
                  </button>
                  <div
                    className="flex max-w-[150px] items-center text-ellipsis whitespace-nowrap rounded-full border border-blue-500 font-semibold text-blue-500 transition-colors duration-300 ease-in-out hover:border-blue-600 active:border-blue-700 disabled:border-blue-200 disabled:text-blue-200 dark:border-blue-400 dark:text-blue-200 dark:active:text-blue-100 dark:disabled:border-blue-800 dark:disabled:text-blue-800"
                    ref={scrollContainerRef}
                    style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}
                  >
                    {[...Array(10)].map((_, index) => (
                      <button key={index} type="button" className="inline-block reply_btn text-xl px-3 py-1 mr-2 text-center bg-blue-200 text-blue-800 rounded-md">
                        Reply "Yes"
                      </button>
                    ))}
                  </div>
                  <button
                    className="text-blue-500 bp-btn-right focus-visible:outline-blue-400 dark:text-blue-200 dark:focus-visible:text-blue-300 dark:focus-visible:outline-blue-500 rounded-full outline-none transition-[background-color,outline] duration-300 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-0"
                    style={{ opacity: 1, transform: 'none' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rounded-full transition-colors duration-200 ease-in-out hover:bg-blue-100 dark:hover:bg-blue-300/50 bg-transparent">
                      <path d="M9 6l6 6l-6 6"></path>
                    </svg>
                  </button>
                </div>

                <button className=" text-blue-500 create_btn hover:border-blue-600 hover:bg-blue-100 focus-visible:ring-blue-400 active:border-blue-700 disabled:border-blue-200 dark:border-blue-400 dark:text-blue-200  dark:hover:bg-blue-300/50 dark:focus-visible:text-blue-300 dark:focus-visible:ring-blue-500 dark:active:bg-blue-300/30 dark:disabled:border-blue-800 gap-1 rounded-full border px-2 py-1 font-semibold ring-0 transition-[background-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring">
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

            const bp_btn_left = newElement.querySelector('.bp-btn-left');
            if (bp_btn_left) {
              bp_btn_left.addEventListener('click', scrollLeft);
            }

            const bp_btn_right = newElement.querySelector('.bp-btn-right');
            if (bp_btn_right) {
              bp_btn_right.addEventListener('click', scrollRight);
            }

            const popover = newElement.querySelector('.popover');
            if (popover) {
              popover.addEventListener('click', scrollRight);
            }

            const popover_trigger = newElement.querySelector('.popover_trigger');
            if (popover_trigger) {
              popover_trigger.addEventListener('click', ()=>setOpen(false));
            }

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
          <Login />
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

