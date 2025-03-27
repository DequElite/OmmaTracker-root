import { useEffect } from "react";

export default function useFavicon(favicon: string) {
    useEffect(() => {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
        
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }

        if (link) {
            link.href = favicon;
        }
    }, [favicon]);
}
