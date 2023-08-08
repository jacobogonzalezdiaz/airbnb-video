"use client";

import useRentModal from "@/app/hooks/useRentModal";

import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const router = useRouter();
    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);

    const{
        register,
        handleSubmit,
        setValue,
        watch,
        formState:{
            errors,
        },
        reset
    } = useForm<FieldValues>({
        defaultValues:{
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: ''
        }
    });

    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount')
    const roomCount = watch('roomCount')
    const bathroomCount = watch ('bathroomCount')
    const imageSrc = watch('imageSrc');

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }),  [location]);

    const setCustomValue = (id: string, value: any) =>{
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    const onBack = () => {
        setStep((value) => value - 1);
    };

    const onNext = () =>{
        setStep((value) => value + 1);
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if(step !== STEPS.PRICE) {
            return onNext();
        }
        setIsLoading(true);
        axios.post('/api/listings', data)
        .then(() =>{
            toast.success('Lista Creada');
            router.refresh();
            reset();
            setStep(STEPS.CATEGORY);
            rentModal.onClose();
        })
        .catch(() => {
            toast.error('Algo malo paso')
        }).finally(()=>{
            setIsLoading(false);
        })
    }

    const actionLabel = useMemo(() =>{
        if(step === STEPS.PRICE) {
            return 'Crear';
        }

        return 'Siguiente'
    }, [step]);

    const secondaryActionLabel =  useMemo(() =>{
        if(step === STEPS.CATEGORY){
            return undefined;
        }
        return'Volver';
    },[step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading  
            title="¿Cuál de estos describe mejor tu lugar?" 
            subtitle="Elige una categoría"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) =>(
                    <div key={item.label} className="col-span-1">
                        <CategoryInput 
                        onClick={(category)=> setCustomValue('category', category)} 
                        selected={category === item.label} 
                        label={item.label}
                        icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    if(step === STEPS.LOCATION){
        bodyContent =(
            <div className="flex flex-col gap-8">
                <Heading
                title="¿Dónde está ubicado tu lugar?"
                subtitle="¡Ayuda a los invitados a encontrarte!"
                />
                <CountrySelect
                value={location}
                onChange={(value) => setCustomValue('location', value)}
                />
                <Map center={location?.latlng} />
            </div>
        )
    }

    if(step === STEPS.INFO){
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                title="Comparte algunos conceptos básicos sobre tu lugar"
                subtitle="¿Qué comodidades tienes?"
                />
                <hr />
                <Counter
                    title='Invitados'
                    subtitle='¿Cuantos Invitados Permites?'
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                 <hr />
                <Counter
                    title='Habitaciones'
                    subtitle='¿Cuantos Habitaciones Necesitas?'
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                 <hr />
                <Counter
                    title='Baños'
                    subtitle='¿Cuantos Baños Necesitas?'
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />
            </div>
        ) 
    }

    if(step === STEPS.IMAGES){
        bodyContent =(
            <div className="flex flex-col gap-8">
                <Heading 
                title="Anañir foto de tus sitios"
                subtitle="Mostrar a las invitados cómo se ve tu lugar¡¡"
                />
                <ImageUpload
                value={imageSrc}
                onChange={(value) => setCustomValue('imageSrc',value)}
                />
            </div>
        )
    }

    if(step === STEPS.DESCRIPTION){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                title='¿Cómo describirías tu lugar?'
                subtitle='lo mejor es lo breve y lo dulce...'
                />
                <Input 
                id="Titulo"
                label="title"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                />
                <hr />
                <Input 
                id="description"
                label="Descripcion"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                />
               
            </div>
        )
    }

    if(step === STEPS.PRICE){
        bodyContent =(
            <div className="flex flex-col gap-8">
                <Heading
                title="Ahora fije su precio"
                subtitle="¿Cuánto cobra por noche?"
                />
                 <Input 
                id="price"
                label="Precio"
                formatPrice
                type="number"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                />
            </div>
        )
    }onSubmit

    return ( 
        <Modal  
        isOpen={rentModal.isOpen} 
        onClose={rentModal.onClose} 
        onSubmit={handleSubmit(onSubmit)} 
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
        title="AirBnB tu Casa"
        body={bodyContent}
        />
     );
}
 
export default RentModal;