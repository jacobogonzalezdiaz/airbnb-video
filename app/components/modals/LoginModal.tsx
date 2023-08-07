"use client"

import axios from 'axios';
import {signIn} from 'next-auth/react';
import { AiFillGithub } from 'react-icons/ai';
import {FcGoogle} from 'react-icons/fc';
import { useCallback,useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import Button from '../Button';
import useLoginModal from '@/app/hooks/useLoginModal';
import { useRouter } from 'next/navigation';

const LoginModal = () => {
    const router = useRouter();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const{
        register,
        handleSubmit,
        formState:{
            errors,

        }
    } = useForm<FieldValues>({
        defaultValues:{
            email: '',
            password: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) =>{
        setIsLoading(true);

        signIn('credentials',{
            ...data,
            redirect: false
        })
        .then((callback) =>{
            setIsLoading(false);

            if(callback?.ok){
                toast.success('Conectado');
                router.refresh();
                loginModal.onClose();
            }

            if(callback?.error){
                toast.error(callback.error);
            }
        })
    }

    const bodyContent = ( 
        <div className='flex flex-col gap-4'>
            <Heading
                title='Bienvenidos de nuevo'
                subtitle='Ingrese a su cuenta'
            />
            <Input
            id="email"
            label="Correo Electronico"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            />
             <Input
            id="password"
            label="Contraseña"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-4'>
            <hr />
            <Button
             outline
             label='Continua con Google'
             icon={FcGoogle}
             onClick={() =>signIn('google')}
             />
              <Button
             outline
             label='Continua con Github'
             icon={AiFillGithub}
             onClick={() =>signIn('github')}
             />
             <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className=' justify-center flex flex-row items-center gap-2'>
                    <div>
                        Ya tienes una cuenta?
                    </div>
                    <div className=' text-neutral-800 cursor-pointer hover:underline' onClick={registerModal.onClose}>
                        Login
                    </div>
                </div>
             </div>
        </div>
    )

    return ( 
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title='Login'
            actionLabel='Continuar'
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
            />
  );
}
 
export default LoginModal;