export default { fetchCountries };

const BASE_URL = 'https://restcountries.com/v3.1/name/';

function fetchCountries(name) {
    const url = `${BASE_URL}${name}?frends=name,capital,population,flags,languages`;
    return fetch(url).then(res => {
        if (res.status === 404) {
            throw new Error(res.status);
        }
        return res.json();
    });
};
