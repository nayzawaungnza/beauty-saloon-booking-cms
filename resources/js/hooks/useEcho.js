import { useContext } from 'react';
import { EchoContext } from '@/app';

export const useEcho = () => {
    const echo = useContext(EchoContext);
    if (!echo) {
        throw new Error('useEcho must be used within an EchoContext.Provider');
    }
    return echo;
};