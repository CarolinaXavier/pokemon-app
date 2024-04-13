export const LoadingComponent = () => {
    return (
        <div className="fixed h-screen w-screen bg-transaparent">
            <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                <p>Carregando dados...</p>
            </div>
        </div>
    );
};