export const currencyFormat = (amount) => {
    const rate = 90;
    const inrAmount = amount * rate;
    return `₹ ${inrAmount.toLocaleString('en-IN')}`;
}
