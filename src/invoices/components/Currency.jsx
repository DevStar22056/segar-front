import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import pulse from '../../pulse';

export default function Currency(props) {
    const classes = useStyles();

    const [disabled, setDisabled] = React.useState(props.disabled);
    const [currencies, setCurrencies] = React.useState({});
    const [currency, setCurrency] = React.useState((props.currency) ? props.currency : pulse.user.userData[0].invoice_payment_currency);

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);

    async function getCurrencies() {
        const currencies = await pulse.currencies.getCurrencies();
        setCurrencies(currencies);
    }

    React.useEffect(() => {
        setCurrency(currency);
        setLabelWidth(inputLabel.current.offsetWidth);
        getCurrencies();
        if (pulse.user.role !== 1) {
            setDisabled(true)
        }
    }, []);

    const handleChange = name => event => {
        setCurrency(event.target.value);
        props.handleCurrencyChange(event.target.value)
    };

    return (
        <div className={classes.root}>
            <FormControl disabled={disabled} variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} htmlFor="outlined-currency-native">
                    {pulse.text.invoice.currency}
                </InputLabel>
                <Select
                    margin="dense"
                    native
                    value={currency}
                    onChange={handleChange('currency')}
                    name="currency"
                    input={
                        <OutlinedInput margin="dense" name="currency" labelWidth={labelWidth} id="outlined-currency-native"/>
                    }
                >
                    {currencies.length > 0 && currencies.map(item => (
                        <option key={item.code} value={item.code}>{item.code}</option>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    root: {},
    formControl: {
        marginTop: theme.spacing(1),
        minWidth: 120,
        width: '100%'
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));