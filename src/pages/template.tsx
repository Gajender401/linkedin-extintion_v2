import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../@/components/ui/form';
import { Input } from '../@/components/ui/input';
import { Textarea } from '../@/components/ui/textarea';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../@/components/ui/select"
import { FaPlus } from 'react-icons/fa6';
import { cn } from '../@/lib/utils';
import axios from 'axios';
import { useUserAuth } from '../context/context';


const FormSchema = z.object({
    name: z.string().min(1,{
        message: 'name is required.',
    }),
    prompt: z.string().min(1, 'promt is required'),
    words: z.string().min(1, 'words is required'),
    style: z.string().min(1, 'style is required'),
});

const Template = () => {
    const {access} = useUserAuth()
    

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '', 
            prompt: '',
            words: '',
            style: '',
        },
    });


    async function onSubmit(data: z.infer<typeof FormSchema>) {

            let dataNew = JSON.stringify({
              "message": `create message template ${data.prompt}`,
              "words": data.words,
              "tone": data.style,
              "recipient_name": data.name,
            });
        
            let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://bot.kaliper.in/api/kaliper-linked-lists/',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
                'Cookie': 'sonu_session=osi35ll46ie4ow2jtttewanamin8s5k6'
              },
              data: dataNew
            };
        
            axios.request(config)
              .then((response) => {
                window.location.href = `#templates`
                console.log(JSON.stringify(response.data));
              })
    }

    return (
        <main className=' p-5 w-full' >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full text-[#081230] font-normal space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name of template</FormLabel>
                                <FormControl>
                                    <Input className=" text-[#00000099] focus-visible:ring-0" placeholder="Enter the name of the template " {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prompt</FormLabel>
                                <FormControl>
                                    <Textarea className=" text-[#00000099] h-32 focus-visible:ring-0" placeholder="Ex :- Craft a concise sales pitch for [product/service], emphasizing its unique value. Address common objections and propose effective closing strategies." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="words"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of words</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue className=" text-[#00000099] focus-visible:ring-0" placeholder="Choose no. of words" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="50 words">50</SelectItem>

                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Conversation style</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose conversation style" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem className=" text-[#00000099] focus-visible:ring-0" value="polite">polite</SelectItem>

                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                        <button className={cn(
                            " m-auto py-2 rounded-md text-white items-center flex flex-row gap-1 px-14 ",
                            "bg-customBlue hover:bg-customBlueHover"
                        )} >
                            <FaPlus />
                            <p >Save template</p>
                        </button>

                </form>
            </Form>
        </main>
    )
}

export default Template