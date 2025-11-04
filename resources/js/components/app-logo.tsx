import { usePage } from '@inertiajs/react';

export default function AppLogo() {

    const { name } = usePage().props as unknown as { name: string };

    return (
        <>
            <img src='https://res.cloudinary.com/dvibz13t8/image/upload/v1762190000/logo_zweior.png' alt='MathG' className='h-10' />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight text-lg font-semibold">{ name }</span>
            </div>
        </>
    );
}
