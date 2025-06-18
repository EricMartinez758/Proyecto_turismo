
const getExchangeRate = async () => {
    // Simulamos una llamada a API con un retraso
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                USD: 36.50,  // 1 USD = 36.50 Bs (ejemplo)
                EUR: 39.80,  // 1 EUR = 39.80 Bs (ejemplo)
                COP: 0.0085  // 1 COP = 0.0085 Bs (ejemplo)
            });
        }, 500);
    });
};

export { getExchangeRate };