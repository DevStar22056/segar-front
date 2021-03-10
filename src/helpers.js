import {createBrowserHistory} from 'history';

/**
 *
 * @type {{createHref, goBack, length, replace, go, action, location, goForward, block, push, listen}}
 */
const history = createBrowserHistory();

/**
 *
 * @param email
 * @returns {boolean}
 */
const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

/**
 *
 * @param phone
 * @returns {boolean}
 */
const validatePhone = phone => {
    const re = /[0-9]{3}-[0-9]{3}-[0-9]{3}/g;
    return re.test(String(phone).toLowerCase());
};

/**
 *
 * @param nip
 * @returns {boolean}
 */
const isValidNip = nip => {
    if (typeof nip !== 'string')
        return false;

    nip = nip.replace(/[\ \-]/gi, '');

    let weight = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    let controlNumber = parseInt(nip.substring(9, 10));
    for (let i = 0; i < weight.length; i++) {
        sum += (parseInt(nip.substring(i, i + 1)) * weight[i]);
    }

    return sum % 11 === controlNumber;
};

/**
 *
 */
export default {
    validateEmail,
    history,
    validatePhone,
    isValidNip
}