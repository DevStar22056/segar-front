import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import pulse from "../../pulse";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import InputAdornment from '@material-ui/core/InputAdornment';
import IntegrationAutosuggest from '../Projects/clients';
import InlineDatePickerDemo from '../../components/DatePicker';
import Equipment from "../../components/Equipment";
import Button from "@material-ui/core/Button";
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import FormHelperText from '@material-ui/core/FormHelperText';
import helpers from '../../helpers';
import CheckBankAcc from './checkBankAcc';
import ChangesTable from './changesTable';
import DropzoneAreaExample from "../../invoices/components/Dropzone";
import BankAccountsList from '../../dashboard/components/multipleBankAccounts.jsx'

function handleRemove(id) {
    const remove = window.confirm('Na pewno chcesz usunąć wybranego użytkownika?');
    if(remove === true) {
        pulse.users.deleteUser({id: id})
    }
}

const ControlledExpansionPanels = forwardRef((props, ref) => {

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    /* PANEL */
    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    /* CHECKBOXES */
    const [state, setState] = React.useState({
        is_active: props.user.is_active === 1,
        can_login: props.user.can_login === 1,
        verified: props.user.verified === 1,
    });

    const handleChangeState = name => event => {
        setState({...state, [name]: event.target.checked});
        setuserDetails({...userDetails, [name]: event.target.checked});
    };

    /* USER FIELDS */
    const [userDetails, setuserDetails] = React.useState(props.user);
    const handleChangeUserDetails = event => {
        const val = event.target.value;
        setuserDetails({...userDetails, [event.target.name]: val});

        // internal_hour_rate event
        if (event.target.name === 'internal_hour_rate') {
            calculate_internal_hour_rate(val)
        } else if (event.target.name === 'internal_overtime_rate') {
            calculate_internal_overtime_rate(val)
        } else if (event.target.name === 'internal_fixed_rate') {
            calculate_internal_fixed_rate(val)
        }
    };

    /* oncall */
    const [oncall, setOncall] = React.useState({
        oncall_10: (props.user.oncall_10 !== 0),
        oncall_30: (props.user.oncall_30 !== 0),
    });

    const handleOncall = event => {
        setOncall({...oncall, [event.target.name]: event.target.checked});
        setuserDetails({...userDetails, [event.target.name]: event.target.checked});
    };

    // const [dense, setDense] = React.useState(true);
    // const [secondary, setSecondary] = React.useState(false);
    const [userClient, setUserClient] = React.useState(props.user.client_id);

    // nip
    const [nipError, setNipError] = React.useState(false);

    /* CLIENTS */
    const handleDateChange = (value, name) => {
        setuserDetails({...userDetails, [name]: value});
    };

    useImperativeHandle(ref, () => ({
        handleSave() {
            pulse.users.updateUser({
                id: props.user.id,
                ...userDetails,
                client_id: userClient
            }).then(res => {
                if (res.data) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 200)
                }
            });
            setOpen(true);
        }
    }));

    /* CLIENTS */
    const handleClientChange = val => {
        if (val.length > 0) {
            setUserClient(val[0].id)
        }
    };

    const [open, setOpen] = React.useState(false);
    const [countries, setCountries] = React.useState(false);

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }

    /*
    *
    * internal rate
    *
    * */
    const [internal_rate_commission, setInternalRateCommission] = useState({
        commission: 0,
        commission_percent: 0
    });

    const [internal_rate_overtime, setInternalRateOvertime] = useState({
        overtime: 0,
        overtime_percent: 0
    });

    const [internal_rate_fixed, setInternalRateFixed] = useState({
        fixed: 0,
        fixed_percent: 0
    });

    async function getCountries() {
        const countries = await pulse.countries.getCountriesList();
        setCountries(countries);
    }

    async function handleGUSData() {
        const nip = userDetails.company_nip;

        if (helpers.isValidNip(nip)) {
            const res = await pulse.gus.getDataByNIP({
                nip: nip
            });
            setuserDetails({...userDetails, ...res.data});
        } else {
            setNipError(true);
        }

        setTimeout(() => {
            setNipError(false);
        }, 5000);
    }

    const calculate_internal_hour_rate = (val) => {
        // Internal h rate
        const IHR = (val === undefined) ? parseInt(userDetails.internal_hour_rate) : val;
        // User h rate
        const HR = userDetails.hourly_rate ? parseInt(userDetails.hourly_rate) : 0;
        // commision rate
        const CR = IHR - HR;
        // Internal rate percent diff
        let IHRP = parseFloat((CR / IHR) * 100, 2);
        IHRP = parseFloat(IHRP).toFixed(2);
        IHRP = (IHRP > 0) ? IHRP : 0;
        setInternalRateCommission({
            commission: CR,
            commission_percent: IHRP
        });
    };

    const calculate_internal_overtime_rate = (val) => {
        // Internal h rate
        const IHR = (val === undefined) ? parseInt(userDetails.internal_overtime_rate) : val;
        // User h rate
        const HR = userDetails.overtime_rate ? parseInt(userDetails.overtime_rate) : 0;
        // commision rate
        const CR = IHR - HR;
        // Internal rate percent diff
        let IHRP = parseFloat((CR / IHR) * 100, 2);
        IHRP = parseFloat(IHRP).toFixed(2);
        IHRP = (IHRP > 0) ? IHRP : 0;
        setInternalRateOvertime({
            overtime: CR,
            overtime_percent: IHRP
        });
    };

    const calculate_internal_fixed_rate = (val) => {
        // Internal h rate
        const IHR = (val === undefined) ? parseInt(userDetails.internal_fixed_rate) : val;
        // User h rate
        const HR = userDetails.fixed_rate ? parseInt(userDetails.fixed_rate) : 0;
        // commision rate
        const CR = IHR - HR;
        // Internal rate percent diff
        let IHRP = parseFloat((CR / IHR) * 100, 2);
        IHRP = parseFloat(IHRP).toFixed(2);
        IHRP = (IHRP > 0) ? IHRP : 0;
        setInternalRateFixed({
            fixed: CR,
            fixed_percent: IHRP
        });
    };


    React.useEffect(() => {

        // get countries
        getCountries();

        if (userDetails.internal_hour_rate !== 0) {
            calculate_internal_hour_rate()
        }

        if (userDetails.internal_overtime_rate !== 0) {
            calculate_internal_overtime_rate();
        }

        if (userDetails.internal_fixed_rate !== 0) {
            calculate_internal_fixed_rate()
        }

        setLabelWidth(inputLabel.current.offsetWidth);

    }, []);

    return (
        <div className={classes.root}>
            {/* PANEL */}
            <ExpansionPanel expanded={expanded === 'panel0'} onChange={handleChange('panel0')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel0bh-content"
                    id="panel0bh-header"
                >
                    <Typography className={classes.heading}>Statusy</Typography>
                    <Typography className={classes.secondaryHeading}>Aktywność, weryfikacja, logowanie </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {/* PANEL */}
                    <Grid alignItems="center" container spacing={0}>
                        <Grid container alignItems="center" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                            {/* FORM FIELD ROW */}
                            <Grid item xs={12}>
                                {/* FIELDS */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={state.is_active}
                                            onChange={handleChangeState('is_active')}
                                            value={state.is_active}
                                            color="primary"
                                        />
                                    }
                                    label="Konto aktywne"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={state.can_login}
                                            onChange={handleChangeState('can_login')}
                                            value={state.can_login}
                                            color="primary"
                                        />
                                    }
                                    label="Może się logować"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={state.verified}
                                            onChange={handleChangeState('verified')}
                                            value={state.verified}
                                            color="primary"
                                        />
                                    }
                                    label="Konto zweryfikowane"
                                />
                                {/* FIELDS */}
                            </Grid>
                            <Grid item xs={12}>
                                <Button size="large" variant="contained" color="secondary"
                                        onClick={() => handleRemove(userDetails.id)}>
                                    Usuń użytkownika
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* PANEL */}

            {/* PANEL */}
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.heading}>Dane użytkownika</Typography>
                    <Typography className={classes.secondaryHeading}>Dane osobowe</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>

                    {/* PANEL */}
                    <Grid alignItems="center" container spacing={0}>

                        {/* FORM FIELD ROW */}
                        <Grid container alignItems="center" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                            <Grid item xs={12} md={5}>
                                <TextField
                                    label="Imię"
                                    placeholder="Imię"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                    name="name"
                                    value={userDetails.name}
                                    onChange={handleChangeUserDetails}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            {/*<Grid item xs={10} md={4}>*/}
                            {/*    <FormControlLabel*/}
                            {/*        className={classes.controlCheckbox}*/}
                            {/*        labelPlacement="end"*/}
                            {/*        control={<Checkbox color="primary"/>}*/}
                            {/*        label="Zatwierdź wartość pola"*/}
                            {/*    />*/}
                            {/*</Grid>*/}
                        </Grid>
                        {/* FORM FIELD ROW */}

                        {/* FORM FIELD ROW */}
                        <Grid container alignItems="center" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                            <Grid item xs={12} md={5}>
                                <TextField
                                    label="Nazwisko"
                                    placeholder="Nazwisko"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                    name="surname"
                                    value={userDetails.surname}
                                    onChange={handleChangeUserDetails}

                                />
                            </Grid>
                            {/*<Grid item xs={10} md={4}>*/}
                            {/*    <FormControlLabel*/}
                            {/*        className={classes.controlCheckbox}*/}
                            {/*        labelPlacement="end"*/}
                            {/*        control={<Checkbox color="primary"/>}*/}
                            {/*        label="Zatwierdź wartość pola"*/}
                            {/*    />*/}
                            {/*</Grid>*/}
                        </Grid>
                        {/* FORM FIELD ROW */}

                        {/* FORM FIELD ROW */}
                        <Grid container alignItems="center" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                            <Grid item xs={12} md={5}>
                                <TextField
                                    label="Email"
                                    placeholder="Email"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                    name="email"
                                    value={userDetails.email}
                                    onChange={handleChangeUserDetails}

                                />
                            </Grid>
                            {/*<Grid item xs={10} md={4}>*/}
                            {/*    <FormControlLabel*/}
                            {/*        className={classes.controlCheckbox}*/}
                            {/*        labelPlacement="end"*/}
                            {/*        control={<Checkbox color="primary"/>}*/}
                            {/*        label="Zatwierdź wartość pola"*/}
                            {/*    />*/}
                            {/*</Grid>*/}
                        </Grid>
                        {/* FORM FIELD ROW */}

                        {/* FORM FIELD ROW */}
                        <Grid container alignItems="center" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                            <Grid item xs={12} md={5}>
                                <TextField
                                    label="Telefon"
                                    placeholder="Telefon"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                    name="user_phone"
                                    value={userDetails.user_phone}
                                    onChange={handleChangeUserDetails}

                                />
                            </Grid>
                            {/*<Grid item xs={10} md={4}>*/}
                            {/*    <FormControlLabel*/}
                            {/*        className={classes.controlCheckbox}*/}
                            {/*        labelPlacement="end"*/}
                            {/*        control={<Checkbox color="primary"/>}*/}
                            {/*        label="Zatwierdź wartość pola"*/}
                            {/*    />*/}
                            {/*</Grid>*/}
                        </Grid>
                        {/* FORM FIELD ROW */}

                        {/* FORM FIELD ROW */}
                        <Grid container alignItems="center" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                            <Grid item xs={12} md={5}>
                                <TextField
                                    label="Ulica"
                                    placeholder="Ulica"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                    name="user_street"
                                    value={userDetails.user_street}
                                    onChange={handleChangeUserDetails}

                                />
                            </Grid>
                            {/*<Grid item xs={10} md={4}>*/}
                            {/*    <FormControlLabel*/}
                            {/*        className={classes.controlCheckbox}*/}
                            {/*        labelPlacement="end"*/}
                            {/*        control={<Checkbox color="primary"/>}*/}
                            {/*        label="Zatwierdź wartość pola"*/}
                            {/*    />*/}
                            {/*</Grid>*/}
                        </Grid>
                        {/* FORM FIELD ROW */}

                        {/* FORM FIELD ROW */}
                        <Grid container alignItems="center" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    label="Kod pocztowy"
                                    placeholder="Kod pocztowy"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                    name="user_postal_code"
                                    value={userDetails.user_postal_code}
                                    onChange={handleChangeUserDetails}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    label="Miasto"
                                    placeholder="Miasto"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                    name="user_city"
                                    value={userDetails.user_city}
                                    onChange={handleChangeUserDetails}
                                />
                            </Grid>
                        </Grid>
                        {/* FORM FIELD ROW */}

                    </Grid>
                    {/* PANEL */}

                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* PANEL */}

            {/* PANEL */}
            <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography className={classes.heading}>Dokumenty firmowe</Typography>
                    <Typography className={classes.secondaryHeading}>
                        Rodzaj firmy, miejsce rezydencji
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>

                    {/* FORM FIELD ROW */}
                    <Grid container alignItems="flex-start" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                        <Grid item xs={12} md={5}>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <Typography variant="h6" className={classes.title}>Rodzaj firmy</Typography>
                                <RadioGroup
                                    aria-label="company_type"
                                    name="company_type"
                                    // className={classes.group}
                                    value={userDetails.company_type}
                                    onChange={handleChangeUserDetails}>

                                    <FormControlLabel
                                        value="0"
                                        control={<Radio color="primary"/>}
                                        label="Działalnośc jednoosobowa"/>

                                    <FormControlLabel
                                        value="1"
                                        control={<Radio color="primary"/>}
                                        label="Spółka"/>

                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Typography variant="h6" className={classes.title}>
                                Dokumenty z CEIDG - KRS bądź inne z danego kraju <br/>
                                Dokumenty potwierdzające prowadzenie ww. działalności gospodarczej.
                            </Typography>
                            <DropzoneAreaExample files={userDetails.files} type={4} source_id={userDetails.id}
                                                 source={0}/>
                        </Grid>
                        <Grid item xs={12}>&nbsp;</Grid>
                        <Grid item xs={12} md={5}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                {/*<InputLabel ref={inputLabel} htmlFor="user_residency">*/}
                                {/*    Miejsce rezydencji podatkowej*/}
                                {/*</InputLabel>*/}
                                <Typography className={classes.secondaryHeading}>
                                    Miejsce rezydencji podatkowej
                                </Typography>
                                <Select
                                    native
                                    value={userDetails.user_residency}
                                    onChange={handleChangeUserDetails}
                                    input={
                                        <OutlinedInput margin="dense" name="user_residency" id="user_residency"/>
                                    }>
                                    <option value=""/>
                                    {countries && countries.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </Select>
                                <FormHelperText>Miejsce rezydencji podatkowej</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            {userDetails.user_residency !== 'PL' && (
                                <>
                                    <Typography variant="h6" className={classes.title}>
                                        - certyfikat rezydencji podatkowej <br/>
                                        - Oświadczenie o byciu ostatecznym beneficjentem
                                    </Typography>
                                    <DropzoneAreaExample files={userDetails.files} type={5} source_id={userDetails.id}
                                                         source={0}/>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* PANEL */}

            {/* PANEL */}
            <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                >
                    <Typography className={classes.heading}>Dane firmy</Typography>
                    <Typography className={classes.secondaryHeading}>
                        Dane firmy, VAT, metoda rozliczenia
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>

                    {/* FORM FIELD ROW */}
                    <Grid container alignItems="flex-start" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                id="invoice_company_name"
                                label="Nazwa firmy"
                                placeholder="Nazwa firmy"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                className={classes.textField}
                                name="invoice_company_name"
                                onChange={handleChangeUserDetails}
                                value={userDetails.invoice_company_name}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        {/*<Grid item xs={10} md={4}>*/}
                        {/*    <FormControlLabel*/}
                        {/*        // checked={state.invoice_details_check}*/}
                        {/*        onChange={handleChange('invoice_details_check')}*/}
                        {/*        value="invoice_details_check"*/}
                        {/*        className={classes.inlineRowFix}*/}
                        {/*        labelPlacement="end"*/}
                        {/*        control={<Checkbox color="primary"/>}*/}
                        {/*        label="Zatwierdź wartość pola"*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        <Grid item xs={12} style={{padding: 0}}></Grid>
                        <Grid item xs={12} md={5} style={{marginTop: -20}}>
                            <TextField
                                // disabled={read_only}
                                id="company_street"
                                label="Adres firmy"
                                placeholder="Adres firmy"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                className={classes.textField}
                                name="company_street"
                                onChange={handleChangeUserDetails}
                                value={userDetails.company_street}
                                // onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} style={{padding: 0}}></Grid>
                        <Grid item xs={12} md={2} style={{marginTop: -20}}>
                            <TextField
                                // disabled={read_only}
                                id="company_postal_code"
                                label="Kod pocztowy"
                                // helperText="tekst pomocniczy"
                                placeholder="Kod pocztowy"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                name="company_postal_code"
                                onChange={handleChangeUserDetails}
                                value={userDetails.company_postal_code}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} style={{marginTop: -20}}>
                            <TextField
                                // disabled={read_only}
                                label="Miasto"
                                // helperText="tekst pomocniczy"
                                placeholder="Miasto"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                onChange={handleChangeUserDetails}
                                value={userDetails.company_city}
                                name="company_city"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} style={{padding: 0}}></Grid>
                        <Grid item xs={12} md={5} style={{marginTop: -20}}>
                            <TextField
                                // disabled={read_only}
                                label="NIP"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                onChange={handleChangeUserDetails}
                                value={userDetails.company_nip}
                                name="company_nip"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Button fullWidth variant="contained" color="primary" onClick={handleGUSData}
                                    className={classes.button}>
                                Pobierz dane z GUS
                            </Button>
                            {nipError && <div>Wystąpił błąd z numerem NIP</div>}
                        </Grid>
                        <Grid item xs={12} style={{padding: 0}}></Grid>
                        <Grid item xs={12} md={5} style={{marginTop: -20, marginLeft: 15}}>
                            <Typography variant="h6" className={classes.title}>Podatek VAT</Typography>
                            <FormControl component="fieldset" className={classes.formControl} style={{marginLeft: 15}}>
                                <RadioGroup
                                    name="vat_value"
                                    value={userDetails.vat_value}
                                    onChange={handleChangeUserDetails}
                                >
                                    <FormControlLabel value="23"
                                                      control={<Radio checked={userDetails.vat_value === '23'}
                                                                      color="primary"/>}
                                                      label="Czynny podatnik VAT"/>

                                    <FormControlLabel value="zw"
                                                      control={<Radio checked={userDetails.vat_value === 'zw'}
                                                                      color="primary"/>}
                                                      label="Zwolnienie VAT"/>

                                    <FormControlLabel value="rc"
                                                      control={<Radio checked={userDetails.vat_value === 'rc'}
                                                                      color="primary"/>}
                                                      label="Zagraniczny VAT (reverse charge)"/>
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={5} style={{marginTop: -20, marginLeft: 15}}>
                            <Typography variant="h6" className={classes.title}>Rozliczenie metodą kasową?</Typography>
                            <FormControl component="fieldset" className={classes.formControl} style={{marginLeft: 15}}>
                                <RadioGroup
                                    name="cash_register"
                                    // className={classes.group}
                                    value={userDetails.cash_register}
                                    onChange={handleChangeUserDetails}>
                                    <FormControlLabel value="1"
                                                      control={<Radio color="primary"/>}
                                                      label="Tak"/>
                                    <FormControlLabel value="0"
                                                      control={<Radio color="primary"/>}
                                                      label="Nie"/>
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* PANEL */}

            {/* PANEL */}
            <ExpansionPanel expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel5bh-content"
                    id="panel5bh-header"
                >
                    <Typography className={classes.heading}>Dane rozliczeniowe</Typography>
                    <Typography className={classes.secondaryHeading}>
                        Dane do przelewu
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>

                    <Grid container alignItems="flex-start" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                label="Nazwa banku"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                value={userDetails.bank_name}
                                name="bank_name"
                                onChange={handleChangeUserDetails}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="Numer rachunku bankowego"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                value={userDetails.invoice_bank_no}
                                name="invoice_bank_no"
                                onChange={handleChangeUserDetails}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="IBAN"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                value={userDetails.bank_iban}
                                name="bank_iban"
                                onChange={handleChangeUserDetails}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                label="SWIFT/BIC"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                value={userDetails.bank_swift_bic}
                                name="bank_swift_bic"
                                onChange={handleChangeUserDetails}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Typography variant="h6" className={classes.title}>Waluta rozliczenia</Typography>
                            <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                <Select
                                    native
                                    value={userDetails.invoice_payment_currency}
                                    onChange={handleChangeUserDetails}
                                    input={
                                        <OutlinedInput
                                            margin="dense"
                                            name="invoice_payment_currency"
                                            id="invoice_payment_currency"
                                        />
                                    }>
                                    <option></option>
                                    <option value="CHF">BGN</option>
                                    <option value="CHF">CHF</option>
                                    <option value="DKK">DKK</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="PLN">PLN</option>
                                    <option value="SEK">SEK</option>
                                    <option value="SGD">SGD</option>
                                    <option value="USD">USD</option>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={7} style={{marginTop: 20}}>
                            <Paper className={classes.coloredPaper}>
                                <Typography variant="h6" className={classes.title} style={{marginBottom: 30}}>Weryfikuj
                                    numer konta (Biała lista)</Typography>
                                <CheckBankAcc invoice_bank_no={userDetails.invoice_bank_no}/>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={5} style={{marginTop: 20}}>
                            <BankAccountsList
                                bank_accounts={userDetails.bank_accounts}
                                resource_id={userDetails.id}
                                resource_type={1}/>
                        </Grid>
                    </Grid>

                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* PANEL */}

            {/* PANEL */}
            <ExpansionPanel expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel6bh-content"
                    id="panel6bh-header"
                >
                    <Typography className={classes.heading}>Informacje o stawce</Typography>
                    <Typography className={classes.secondaryHeading}>
                        Rodzaj stawki, On-call, opcje płatności
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>

                    {/* PANEL */}
                    <Grid container alignItems="flex-start" item xs={12} md={5} spacing={5} style={{paddingBottom: 10}}>
                        <Grid item xs={12} md={8} style={{marginTop: -10}}>
                            <Typography variant="h6" className={classes.title}>Rodzaj stawki</Typography>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <RadioGroup
                                    className={classes.group}
                                    name="rate_type"
                                    onChange={handleChangeUserDetails}
                                    value={userDetails.rate_type}>
                                    <FormControlLabel value="0"
                                                      control={<Radio color="primary"/>}
                                                      label="Time and material"/>
                                    <FormControlLabel value="1"
                                                      control={<Radio color="primary"/>}
                                                      label="Fixed"/>
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{padding: 0}}></Grid>
                        {userDetails.rate_type === "0" ? (
                            <>
                                <Grid item xs={12} md={8} style={{marginTop: -30}}>
                                    <TextField
                                        label="Stawka godzinowa"
                                        placeholder="Stawka godzinowa"
                                        fullWidth
                                        margin="dense"
                                        variant="outlined"
                                        className={classes.textField}
                                        onChange={handleChangeUserDetails}
                                        value={userDetails.hourly_rate}
                                        name="hourly_rate"
                                        InputLabelProps={{shrink: true}}
                                        InputProps={{
                                            startAdornment: <InputAdornment
                                                position="start">{userDetails.invoice_payment_currency}</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} style={{padding: 0}}></Grid>
                                <Grid item xs={12} md={8} style={{marginTop: -30}}>
                                    <TextField
                                        label="Stawka za nadgodziny"
                                        placeholder="Stawka za nadgodziny"
                                        fullWidth
                                        margin="dense"
                                        variant="outlined"
                                        className={classes.textField}
                                        onChange={handleChangeUserDetails}
                                        value={userDetails.overtime_rate}
                                        name="overtime_rate"
                                        InputLabelProps={{shrink: true}}
                                        InputProps={{
                                            startAdornment: <InputAdornment
                                                position="start">{userDetails.invoice_payment_currency}</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            </>
                        ) : (
                            <Grid item xs={12} md={8} style={{marginTop: -30}}>
                                <TextField
                                    label="Wartość stawki (fixed)"
                                    helperText="Wartość stawki (fixed)"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                    onChange={handleChangeUserDetails}
                                    value={userDetails.fixed_rate}
                                    name="fixed_rate"
                                    InputLabelProps={{shrink: true}}
                                    InputProps={{
                                        startAdornment: <InputAdornment
                                            position="start">{userDetails.invoice_payment_currency}</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Grid container alignItems="flex-start" item xs={4} spacing={5} style={{paddingBottom: 10}}>
                        <Grid item xs={12} md={8} style={{marginTop: 0}}>
                            <Typography variant="h6">On call</Typography>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={oncall.oncall_10}
                                        onChange={handleOncall}
                                        name="oncall_10"
                                        value={oncall.oncall_10}
                                        color="primary"
                                    />
                                }
                                label="On-call 10%"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={oncall.oncall_30}
                                        onChange={handleOncall}
                                        name="oncall_30"
                                        value={oncall.oncall_30}
                                        color="primary"
                                    />
                                }
                                label="On-call 30%"
                            />

                            {/*<FormControl row*/}
                            {/*             style={{marginLeft: 10}}*/}
                            {/*             component="fieldset"*/}
                            {/*             className={classes.formControl}>*/}
                            {/*    <RadioGroup*/}
                            {/*        name="oncall_rate"*/}
                            {/*        onChange={handleChangeUserDetails}*/}
                            {/*        value={userDetails.oncall_rate}*/}
                            {/*        className={classes.group}>*/}
                            {/*        <FormControlLabel value="10" control={<Radio color="primary"/>} label="10 %"/>*/}
                            {/*        <FormControlLabel value="30" control={<Radio color="primary"/>} label="30 %"/>*/}
                            {/*    </RadioGroup>*/}
                            {/*</FormControl>*/}
                        </Grid>
                    </Grid>
                    <Grid container alignItems="flex-start" item xs={12} md={6} spacing={5} style={{paddingBottom: 10}}>
                        <Grid item xs={12} md={12} style={{marginTop: 0}}>
                            <Typography variant="h6" style={{marginLeft: 10}}>Opcje płatności</Typography>
                            <FormControl variant="outlined"
                                         className={classes.formControl}
                                         style={{marginTop: 20}}>
                                <InputLabel ref={inputLabel} htmlFor="first_payment_date">
                                    Pierwsza płatność
                                </InputLabel>
                                <Select
                                    native
                                    value={userDetails.first_payment_number}
                                    onChange={handleChangeUserDetails}
                                    input={
                                        <OutlinedInput
                                            margin="dense"
                                            name="first_payment_number"
                                                       labelWidth={labelWidth}
                                                       id="first_payment_number"/>
                                    }>
                                    <option value="select"></option>
                                    <option value="14">14 dni</option>
                                    <option value="21">21 dni</option>
                                    <option value="30">30 dni</option>
                                    <option value="33">33 dni</option>
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined"
                                         className={classes.formControl}
                                         style={{marginTop: 20}}>
                                <InputLabel ref={inputLabel} htmlFor="second_payment_number">
                                    Druga płatność
                                </InputLabel>
                                <Select
                                    native
                                    value={userDetails.second_payment_number}
                                    onChange={handleChangeUserDetails}
                                    input={
                                        <OutlinedInput margin="dense"
                                                       name="second_payment_number"
                                                       labelWidth={labelWidth}
                                                       id="second_payment_number"/>
                                    }>
                                    <option value="select"></option>
                                    <option value="14">14 dni</option>
                                    <option value="21">21 dni</option>
                                    <option value="30">30 dni</option>
                                    <option value="33">33 dni</option>
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined"
                                         className={classes.formControl}
                                         style={{marginTop: 20}}>
                                <InputLabel ref={inputLabel} htmlFor="third_payment_number">
                                    Trzecia płatność
                                </InputLabel>
                                <Select
                                    native
                                    value={userDetails.third_payment_number}
                                    onChange={handleChangeUserDetails}
                                    input={
                                        <OutlinedInput margin="dense"
                                                       name="third_payment_number"
                                                       labelWidth={labelWidth}
                                                       id="third_payment_number"/>
                                    }>
                                    <option value="select"></option>
                                    <option value="14">14 dni</option>
                                    <option value="21">21 dni</option>
                                    <option value="30">30 dni</option>
                                    <option value="33">33 dni</option>
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined"
                                         className={classes.formControl}
                                         style={{marginTop: 20}}>
                                <InputLabel ref={inputLabel} htmlFor="other_payment_number">
                                    Kolejne płatności
                                </InputLabel>
                                <Select
                                    native
                                    value={userDetails.other_payment_number}
                                    onChange={handleChangeUserDetails}
                                    input={
                                        <OutlinedInput margin="dense"
                                                       name="other_payment_number"
                                                       labelWidth={labelWidth}
                                                       id="other_payment_number"/>
                                    }>
                                    <option value="select"></option>
                                    <option value="14">14 dni</option>
                                    <option value="21">21 dni</option>
                                    <option value="30">30 dni</option>
                                    <option value="33">33 dni</option>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {/* PANEL */}

                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* PANEL */}

            {/* PANEL */}
            <ExpansionPanel expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel7bh-content"
                    id="panel7bh-header"
                >
                    <Typography className={classes.heading}>Informacje o kontrakcie</Typography>
                    <Typography className={classes.secondaryHeading}>
                        Klient końcowy, data podpisania umowy, data zakończenia umowy, czas wypowiedzenia.
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {/* FORM FIELD ROW */}
                    <Grid container alignItems="flex-start" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                style={{marginTop: 0, marginBottom: 0}}>Klient końcowy</Typography>
                            <IntegrationAutosuggest selected={(val) => {
                                handleClientChange(val)
                            }} default={props.user.client_id}/>
                        </Grid>
                        <Grid container alignItems="flex-start" item xs={12} md={6} spacing={5}
                              style={{paddingBottom: 10}}>
                            <Grid item xs={12} style={{marginTop: 0}}>
                                <Typography
                                    variant="h6"
                                    style={{marginBottom: 20}}>Data podpisania umowy</Typography>
                                <InlineDatePickerDemo selected={(val) => {
                                    handleDateChange(val, 'date_of_signing')
                                }} default={userDetails.date_of_signing}/>
                            </Grid>
                            <Grid item xs={12} style={{marginTop: 0}}>
                                <Typography
                                    variant="h6"
                                    style={{marginBottom: 20}}>Data zakończenia umowy</Typography>
                                <InlineDatePickerDemo selected={(val) => {
                                    handleDateChange(val, 'date_of_ending')
                                }} default={userDetails.date_of_ending}/>
                            </Grid>
                            <Grid item xs={12} style={{marginTop: 0}}>
                                <Typography
                                    variant="h6"
                                    style={{marginBottom: 20}}>Czas wypowiedzenia</Typography>
                                <TextField
                                    label="Czas wypowiedzenia (dni)"
                                    helperText="Ilość dni"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    onChange={handleChangeUserDetails}
                                    className={classes.textField}
                                    value={userDetails.notice_ending}
                                    name="notice_ending"
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* FORM FIELD ROW */}
                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* PANEL */}

            {/* PANEL */}
            <ExpansionPanel expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel8bh-content"
                    id="panel8bh-header"
                >
                    <Typography className={classes.heading}>Przypisany sprzęt</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>

                    {/*FIELDS*/}
                    <Grid container alignItems="flex-start" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                        {/* <Grid item xs={12}> */}
                        <Equipment user_id={userDetails.id} devices={userDetails.devices}/>
                        {/* </Grid> */}
                    </Grid>
                    {/*FIELDS*/}

                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* PANEL */}

            {/* PANEL */}
            <ExpansionPanel expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel9bh-content"
                    id="panel9bh-header"
                >
                    <Typography className={classes.heading}>Stawka końcowa</Typography>
                    <Typography className={classes.secondaryHeading}>
                        Informacje dla działu finansów.
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>

                    <Grid container alignItems="flex-start" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                        <Grid item xs={12} md={6} lg={4} style={{marginTop: 0}}>
                            <Typography
                                variant="h6"
                                style={{marginBottom: 20}}>Okres obowiązywania
                                zamówienia</Typography>
                            <InlineDatePickerDemo selected={(val) => {
                                handleDateChange(val, 'contract_duration')
                            }} default={userDetails.contract_duration}/>

                            <Typography
                                variant="h6"
                                style={{marginTop: 20}}>Numer zamówienia</Typography>
                            <TextField
                                label="Numer zamówienia"
                                placeholder="Numer zamówienia"
                                fullWidth
                                type="number"
                                margin="dense"
                                variant="outlined"
                                className={classes.textField}
                                value={userDetails.order_id}
                                name="order_id"
                                onChange={handleChangeUserDetails}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        {/* FORM FIELD ROW */}

                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Wartości marży - stawki</Typography>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <RadioGroup
                                    className={classes.group}
                                    name="internal_rate_type"
                                    onChange={handleChangeUserDetails}
                                    style={{marginTop: 14}}
                                    value={userDetails.internal_rate_type}>
                                    <FormControlLabel value="0"
                                                      control={<Radio color="primary"/>}
                                                      label="Time and material"/>
                                    <FormControlLabel value="1"
                                                      control={<Radio color="primary"/>}
                                                      label="Fixed"/>
                                </RadioGroup>
                            </FormControl>
                            <Grid container style={{marginTop: 30}}>
                                {userDetails.internal_rate_type === "0" ? (
                                    <Grid item xs={12}>
                                        <Grid alignItems="center" container spacing={2}>
                                            <Grid item xs={4}>
                                                <TextField
                                                    label="Stawka godzinowa"
                                                    placeholder="Stawka godzinowa"
                                                    fullWidth
                                                    margin="dense"
                                                    variant="outlined"
                                                    className={classes.textField}
                                                    value={userDetails.internal_hour_rate}
                                                    name="internal_hour_rate"
                                                    onChange={handleChangeUserDetails}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment
                                                            position="start">{userDetails.invoice_payment_currency}</InputAdornment>,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>

                                                <TextField
                                                    disabled
                                                    label="Wysokość marży"
                                                    placeholder="Wysokość marży"
                                                    value={internal_rate_commission.commission}
                                                    fullWidth
                                                    margin="dense"
                                                    variant="outlined"
                                                    className={classes.textField}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment
                                                            position="start">{userDetails.invoice_payment_currency}</InputAdornment>,
                                                        classes: {
                                                            root: internal_rate_commission.commission > 0 ? classes.textFieldInputDiff : classes.textFieldInputDiff2
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />

                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    disabled
                                                    label="Wartość procentowa"
                                                    placeholder="Wartość procentowa"
                                                    value={internal_rate_commission.commission_percent}
                                                    fullWidth
                                                    margin="dense"
                                                    variant="outlined"
                                                    className={classes.textField}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment
                                                            position="start">%</InputAdornment>,
                                                        classes: {
                                                            root: internal_rate_commission.commission_percent > 0 ? classes.textFieldInputDiff : classes.textFieldInputDiff2
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid alignItems="center" container spacing={2}>
                                            <Grid item xs={4}>
                                                <TextField
                                                    label="Stawka za nadgodziny"
                                                    placeholder="Stawka za nadgodziny"
                                                    fullWidth
                                                    margin="dense"
                                                    variant="outlined"
                                                    className={classes.textField}
                                                    value={userDetails.internal_overtime_rate}
                                                    name="internal_overtime_rate"
                                                    onChange={handleChangeUserDetails}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment
                                                            position="start">{userDetails.invoice_payment_currency}</InputAdornment>,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    disabled
                                                    label="Wysokość marży"
                                                    placeholder="Wysokość marży"
                                                    value={internal_rate_overtime.overtime}
                                                    fullWidth
                                                    margin="dense"
                                                    variant="outlined"
                                                    className={classes.textField}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment
                                                            position="start">{userDetails.invoice_payment_currency}</InputAdornment>,
                                                        classes: {
                                                            root: internal_rate_overtime.overtime > 0 ? classes.textFieldInputDiff : classes.textFieldInputDiff2
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    disabled
                                                    label="Wartość procentowa"
                                                    placeholder="Wartość procentowa"
                                                    value={internal_rate_overtime.overtime_percent}
                                                    fullWidth
                                                    margin="dense"
                                                    variant="outlined"
                                                    className={classes.textField}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment
                                                            position="start">%</InputAdornment>,
                                                        classes: {
                                                            root: internal_rate_overtime.overtime_percent > 0 ? classes.textFieldInputDiff : classes.textFieldInputDiff2
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Grid alignItems="center" container spacing={2}>
                                        <Grid item xs={4}>
                                            <TextField
                                                label="Wartość stawki (fixed)"
                                                placeholder="Wartość stawki (fixed)"
                                                fullWidth
                                                margin="dense"
                                                variant="outlined"
                                                className={classes.textField}
                                                value={userDetails.internal_fixed_rate}
                                                name="internal_fixed_rate"
                                                onChange={handleChangeUserDetails}
                                                InputProps={{
                                                    startAdornment: <InputAdornment
                                                        position="start">{userDetails.invoice_payment_currency}</InputAdornment>,
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                disabled
                                                label="Wysokość marży"
                                                placeholder="Wysokość marży"
                                                value={internal_rate_fixed.fixed}
                                                fullWidth
                                                margin="dense"
                                                variant="outlined"
                                                className={classes.textField}
                                                InputProps={{
                                                    startAdornment: <InputAdornment
                                                        position="start">{userDetails.invoice_payment_currency}</InputAdornment>,
                                                    classes: {
                                                        root: internal_rate_fixed.fixed > 0 ? classes.textFieldInputDiff : classes.textFieldInputDiff2
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                disabled
                                                label="Wartość procentowa"
                                                placeholder="Wartość procentowa"
                                                value={internal_rate_fixed.fixed_percent}
                                                fullWidth
                                                margin="dense"
                                                variant="outlined"
                                                className={classes.textField}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                    classes: {
                                                        root: internal_rate_fixed.fixed_percent > 0 ? classes.textFieldInputDiff : classes.textFieldInputDiff2
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <Typography variant="h6" className={classes.title}>
                                Dodatkowe pliki
                            </Typography>
                            <DropzoneAreaExample files={userDetails.files}
                                                 type={6}
                                                 source_id={userDetails.id}
                                                 source={0}/>
                        </Grid>

                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>

            {/* PANEL */}
            {userDetails.changes.length > 0 && (
                <ExpansionPanel expanded={expanded === 'panel10'} onChange={handleChange('panel10')}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel10bh-content"
                        id="panel10bh-header"
                    >
                        <Typography className={classes.heading}>Zmiana danych
                            <Chip
                                label={userDetails.changes.length}
                                color="secondary"
                                style={{marginLeft: 5}}
                            />
                        </Typography>
                        <Typography className={classes.secondaryHeading}>
                            Nowe wartości przesłane przez użytkownika.
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container alignItems="flex-start" item xs={12} spacing={5} style={{paddingBottom: 10}}>
                            <Grid item xs={12} style={{marginTop: 0}}>
                                <ChangesTable changes={userDetails.changes}/>
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )}

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Dane zostaly zapisane</span>}
                action={[

                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.close}
                        onClick={handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>,
                ]}
            />
        </div>
    );
});

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        padding: 40
    },
    formControl: {
        width: '100%'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(2),
        width: '100%',
        fontSize: 12
    },
    controlCheckbox: {
        // position: 'relative',
        // top: -8
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
    demo: {
        backgroundColor: '#efefef',
    },
    textFieldInputDiff: {
        backgroundColor: '#ecffe4'
    },
    textFieldInputDiff2: {
        backgroundColor: '#fff3f5'
    },
    coloredPaper: {
        backgroundColor: '#efefef',
        padding: theme.spacing(2)
    }
}));

export default ControlledExpansionPanels;