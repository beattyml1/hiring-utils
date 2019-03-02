export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function formatDollars(x) {
    return `$ ${numberWithCommas(round100(x).toFixed(0))}`;
}

export const round100 = (x) => Math.ceil(x / 100) * 100;