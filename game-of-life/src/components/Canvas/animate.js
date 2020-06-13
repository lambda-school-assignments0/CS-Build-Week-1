import React, { useEffect, useState } from 'react';

export const useAnimate = (animationCB) => {
    const [continueAnimation, setContinueAnimation] = useState(true);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!started) {
            setStarted(true);
            requestAnimationFrame(onFrame);
        }
    }, [started]);

    const onFrame = () => {
        if (continueAnimation) {
            requestAnimationFrame(onFrame);
        }
        console.log('Nah, it is not working yet.');

        animationCB();
    };

    const cancelAnimation = () => {
        setContinueAnimation(false);
    };

    return [cancelAnimation];
};
