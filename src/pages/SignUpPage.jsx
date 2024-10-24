import React, { useEffect } from 'react';
import { Label } from '../components/label';
import { Input } from '../components/input';
import { Field } from '../components/field';
import { useForm } from 'react-hook-form';
import Button from '../components/button/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase/firebase-config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import AuthenticationPage from './AuthenticationPage';
import { useAuth } from '../contexts/authContext';
import InputPasswordToggle from '../components/input/InputPasswordToggle';
import slugify from 'slugify';
import { userRole, userStatus } from '../utils/constansts';

const schema = yup.object({
    fullName: yup.string()
        .required('Full name must be required!'),
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

const SignUpPage = () => {
    const { handleSubmit, formState: { errors, isSubmitting, isValid }, reset, setFocus, control }
        = useForm({
            resolver: yupResolver(schema),
            mode: 'onChange',
        });
    const navigate = useNavigate();// eslint-disable-next-line
    const { userInfo } = useAuth();

    const onSubmit = async (values) => {
        const user = await createUserWithEmailAndPassword(auth, values?.email, values?.password);
        if (user) {
            await updateProfile(auth.currentUser, {
                displayName: values?.fullName,
                photoURL: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'
            })
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                fullName: values?.fullName,
                username: slugify(values?.fullName, { lower: true, replacement: " ", trim: true }),
                email: values?.email,
                password: values?.password,
                avatar: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg',
                status: userStatus.ACTIVE,
                role: userRole.USER,
                createdAt: serverTimestamp()
            })
                .catch(err => {
                    console.log(err);
                })
            toast.success('Sign up success');
            reset({ fullName: '', email: '', password: '' });
            navigate('/');
        }
    }

    useEffect(() => {
        document.title = 'Register Page';
        setFocus("fullName");
        if (userInfo?.email) {
            navigate('/');
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo])

    useEffect(() => {
        if (errors && isSubmitting) {
            const arrErrors = Object.values(errors);
            if (arrErrors.length > 0)
                toast.error(arrErrors[0]?.message);
        }
    }, [errors, isSubmitting]);

    return (
        <AuthenticationPage>
            <form className='form' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Field >
                    <Label className='label' htmlFor='fullName'>Full name</Label>
                    <Input
                        control={control} name='fullName' type="text" placeholder="Type your fullname..."
                    />
                    {errors?.fullName?.message && <p className='error'>{errors.fullName.message}</p>}

                </Field>
                <Field >
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
                        All inputs is valid
                    </div>
                }
                <div className="have-account">
                    Already have an account ?
                    <NavLink to={'/sign-in'}>Login</NavLink>
                </div>
                <Button type='submit'
                    style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                >
                    Sign up
                </Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignUpPage;