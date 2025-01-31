"use client"
import React from 'react'
import * as z from 'zod';

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AddressSchema } from "@/schemas";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSucess } from "@/components/form-sucess";
import { addAddress } from '@/actions/addAddress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Props {
    userId: string;
}

const AddressForm = ({ userId }: Props) => {
    const [error, setError] = useState<string | undefined>("");
    const [sucess, setSucess] = useState<string | undefined>("");

    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof AddressSchema>>({
        resolver: zodResolver(AddressSchema),
        defaultValues: {
            street: "",
            barangay: "",
            city: "",
            province: "",
            country: "",
            zipCode: "",
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            window.location.reload();
        }
    }

    const onSubmit = (values: z.infer<typeof AddressSchema>) => {
        setError("");
        setSucess("");

        startTransition(() => {
            addAddress(userId, values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }

                    if (data.success) {
                        setSucess(data.success);
                        setOpen(false);
                        handleOpenChange(false);
                    }
                })
                .catch(() => setError("An error what!"));
        });
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"auth"}>
                    Add Address Line
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0 w-auto bg-transparent border-none">
                <Card>
                    <CardHeader>
                        <p>Add your Address Line</p>
                        <CardDescription>
                            <p>Type the neccessary information in the form below</p>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                                <div className='space-y-4'>

                                    <div className='grid grid-cols-2 gap-4'>
                                        {/* Street */}
                                        <FormField
                                            control={form.control}
                                            name='street'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Street</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder='Fatima St.'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Barangay */}
                                        <FormField
                                            control={form.control}
                                            name='barangay'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Barangay</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder='Barangay 21-C'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>

                                    <div className='grid grid-cols-2 gap-4'>
                                        {/* City */}
                                        <FormField
                                            control={form.control}
                                            name='city'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder='Davao City'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Province */}
                                        <FormField
                                            control={form.control}
                                            name='province'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Province</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder='Davao del Sur'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        {/* Country */}
                                        <FormField
                                            control={form.control}
                                            name='country'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder='Philippines'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Province */}
                                        <FormField
                                            control={form.control}
                                            name='zipCode'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Zip Code</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder='8000'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                </div>
                                <FormError message={error} />
                                <FormSucess message={sucess} />
                                <Button variant={"auth"} disabled={isPending} type="submit" className="w-full">
                                    Add Address Line
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                </Card>
            </DialogContent>
        </Dialog>

    )
}

export default AddressForm