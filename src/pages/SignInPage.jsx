import React, { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthenticationPage from './AuthenticationPage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Field } from '../components/field';
import { Label } from '../components/label';
import { Input } from '../components/input';
import Button from '../components/button/Button';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';
import InputPasswordToggle from '../components/input/InputPasswordToggle';

const schema = yup.object({
    email: yup.string()
        .email('Email is not valid')
        .required('Email must be required!'),
    password: yup.string()
        .required('Password must be required!')
        .min(8, "Password must not be less than 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
            { message: "Password has least one uppercase letter, one lowercase letter, one number and one special character" })
    ,
});

const SignInPage = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const { handleSubmit, formState: { errors, isSubmitting, isValid }, reset, setFocus, control }
        = useForm({
            resolver: yupResolver(schema),
            mode: 'onChange',
        });

    useEffect(() => {
        document.title = 'Login Page';
        setFocus("email");
        if (userInfo?.email) {
            navigate('/');
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

    useEffect(() => {
        if (errors && isSubmitting) {
            const arrErrors = Object.values(errors);
            if (arrErrors.length > 0)
                toast.error(arrErrors[0]?.message);
        }
    }, [errors, isSubmitting]);

    const onSubmit = async (values) => {
        try {
            await signInWithEmailAndPassword(auth, values?.email, values?.password);
            reset({ email: '', password: '' });
            toast.success('Sign in success');
            navigate('/');
        } catch (error) {
            toast.error(error?.message);
            return;
        }
    }

    return (
        <AuthenticationPage>
            <form className='form' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Field>
                    <Label className='label' htmlFor='email'>Email address</Label>
                    <Input
                        control={control} name='email' type="email" placeholder="Type your email..."
                    />
                    {errors?.email?.message && <p className='error'>{errors.email.message}</p>}
                </Field>

                <Field >
                    <Label className='label' htmlFor='password'>Password</Label>
                    <InputPasswordToggle control={control} />
                    {errors?.password?.message && <p className='error'>{errors.password.message}</p>}
                </Field>
                {isValid &&
                    <div className='text-blue-500 text-base my-5'>
                        * All inputs is valid
                    </div>
                }
                <div className="have-account">
                    You have not had an account ?
                    <NavLink to={'/sign-up'}>Register an account</NavLink>
                </div>
                <Button type='submit'
                    className='w-full max-w-[300px] mx-auto'
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                >
                    Sign in
                </Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignInPage;