import Navbar from './components/navbar';
import { useUserAuth } from './context/context';
import Login from './pages/login';
import { useEffect, useRef, useState } from 'react';
// import Message from './components/message';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "./@/lib/utils"
import { Button } from "./@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./@/components/ui/popover"

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
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

interface Template {
  id: string;
  name: string;
  content: string;
  user: string;
}

const Popup = () => {

  const { access, state, setState } = useUserAuth()

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const initialMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const divRef = useRef<HTMLDivElement>(null);
  const [templates, setTemplates] = useState<Template[]>([])
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  async function getTemplates(tokken: string) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://bot.kaliper.in/api/api/templates/',
      headers: {
        'Authorization': `Bearer ${tokken}`
      }
    };

    await axios.request(config)
      .then((response: any) => {
        setTemplates(response.data)
        console.log(templates,response.data);
      })

  }


  useEffect(() => {
    if (access) {
      getTemplates(access)
    }
  }, [access])


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
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {value
                      ? frameworks.find((framework) => framework.value === value)?.label
                      : "Select framework..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandEmpty>No framework found.</CommandEmpty>
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
                </PopoverContent>
              </Popover>
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
