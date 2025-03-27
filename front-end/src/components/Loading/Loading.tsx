import "./Loading.style.scss"

export default function LoadingComponent({loadingText, type}:{loadingText:string, type:'error' | 'loading'}){
    return (
        <>
            <div className="loading">
                {
                    type === 'loading' 
                    && 
                    <div className="loader">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                }
                <h1 style={{fontSize:type==='loading' ? '1.2rem' : '1.5rem'}}>{loadingText}</h1>
            </div>
        </>
    )
}