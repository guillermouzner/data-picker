"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {CalendarIcon} from "@radix-ui/react-icons";
import {format} from "date-fns";
import {useForm} from "react-hook-form";
import * as z from "zod";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {toast} from "@/components/ui/use-toast";

const FormSchema = z.object({
  start: z.date({
    required_error: "Fecha de inicio requerida",
  }),
  end: z.date({
    required_error: "Fecha final requerida",
  }),
});

export function DatePickerForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const startDate = form.watch("start"); // Observa el valor del campo "start"

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Set 'dob' to midnight
    data.start.setUTCHours(0, 0, 0, 0);
    // Set 'end' to one minute before midnight of the next day
    data.end.setUTCHours(23, 59, 59, 999);

    if (data.end < data.start) {
      form.setError("end", {
        type: "manual",
        message: "Seleccione una fecha valida",
      });

      return;
    }

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col md:flex-row items-center gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row gap-8">
          <FormField
            control={form.control}
            name="start"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <FormLabel>Desde</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        variant={"outline"}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      initialFocus
                      disabled={(date) => date > new Date() || date < new Date("2022-01-01")}
                      mode="single"
                      selected={field.value}
                      // @ts-ignore
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <FormLabel>Hasta</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        variant={"outline"}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      initialFocus
                      disabled={(date) => date > new Date() || date < startDate}
                      mode="single"
                      selected={field.value}
                      // @ts-ignore
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mb-2" type="submit">
          Buscar
        </Button>
      </form>
    </Form>
  );
}
