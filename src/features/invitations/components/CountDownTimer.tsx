import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

interface CountDownTimerProps {
    expiresAt: string;
    onExpire?: () => void;
    className?: string;
}

export const CountDownTimer: React.FC<CountDownTimerProps> = ({ expiresAt, onExpire, className }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(expiresAt) - +new Date();
            if (difference <= 0) {
                if (timeLeft > 0 && onExpire) onExpire();
                return 0;
            }
            return difference;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
            if (remaining <= 0) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt, onExpire]);

    if (timeLeft <= 0) {
        return <span className="text-red-500 font-bold">EXPIRED</span>;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    const isLowTime = timeLeft < 1000 * 60 * 5; // Less than 5 mins

    return (
        <div className={clsx(
            "font-mono text-sm inline-flex items-center gap-1 px-2 py-1 rounded",
            isLowTime ? "bg-red-50 text-red-700 animate-pulse" : "bg-gray-100 text-gray-700",
            className
        )}>
            <span>{hours.toString().padStart(2, '0')}:</span>
            <span>{minutes.toString().padStart(2, '0')}:</span>
            <span>{seconds.toString().padStart(2, '0')}</span>
        </div>
    );
};
