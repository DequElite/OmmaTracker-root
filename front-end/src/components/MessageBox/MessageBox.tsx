import { useEffect, useState } from "react";
import "./style.scss";

interface MessageBoxProps {
    type: 'info' | 'warning' | 'error' | 'success';
    description: string;
    onClose?: () => void;
    duration: number;
}

export default function MessageBox({ type, description, onClose, duration }: MessageBoxProps) {
    const [timeLeft, setTimeLeft] = useState<number>(duration);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevState) => prevState - 100);
            }, 100);

            return () => clearInterval(timer);
        } else {
            setIsClosing(true);

            const animationTimeout = setTimeout(() => {
                onClose && onClose();
            }, 300);

            return () => clearTimeout(animationTimeout);
        }
    }, [timeLeft, onClose]);

    return (
        <>
            <div className={`messageBox ${isClosing && "box--closing" }`}>
                <div className="messageBox__header">
                    <h1 className={`messageBox__header-text ${type}`}>
                        {type}
                    </h1>
                </div>
                <div className="messageBox__content">
                    <div className="messageBox__content-info">
                        <p className="info-text">
                            {description}
                        </p>
                        <img src={`/light/${type}.svg`} alt="" className="info-img" />
                    </div>
                </div>
                <div className={`messageBox__line ${type}`} style={{ width: `${(timeLeft / duration) * 100}%` }}></div>
            </div>
        </>
    );
}
