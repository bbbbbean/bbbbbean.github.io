import { useEffect, useState } from "react";

const LodingPage = ({ message }) => {

    const [dat, setDat] = useState("");

    useEffect(() => {
        let dats = ".";
        const timer = setInterval(() => {
            if (dats.length === 3) {
                dats = ""
            }
            dats = dats + "\."
            setDat(dats)
        }, 1000)

        return () => clearInterval(timer);

    }, [])

    return (
        <div className="loding-page">
            <div>
                <span>{message}{dat}</span>
            </div>
        </div>
    )
}

export default LodingPage;