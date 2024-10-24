import React, { useState } from 'react';
import Input from './Input';
import { IconEyeClose, IconEyeOpen } from '../icon';

const InputPasswordToggle = ({ control, ...props }) => {
    const [togglePassword, setTogglePassword] = useState(false);

    if (!control) return null;

    return (
        <>
            <Input
                control={control} name='password' placeholder="Type your password..."
                type={togglePassword ? 'text' : 'password'}
            >
                {togglePassword ?
                    <IconEyeOpen onClick={() => setTogglePassword(false)} className='input-icon' />
                    :
                    <IconEyeClose onClick={() => setTogglePassword(true)} className='input-icon' />
                }
            </Input>
        </>
    );
};

export default InputPasswordToggle;