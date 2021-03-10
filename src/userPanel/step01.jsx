import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import HelpRounded from '@material-ui/icons/HelpRounded';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Paper} from "@material-ui/core";

import pulse from '../pulse'
import DropzoneAreaExample from "../invoices/components/Dropzone";

export default function Step01(props) {
    const classes = useStyles();
    // const read_only = props.read_only === true;
    const read_only = false;
    const [canSubmit, setSubmit] = useState(true);
    const [userDetails, setUserDetails] = useState({
        name: '',
        surname: '',
        email: '',
        invoice_company_name: '',
        company_nip: '',
        company_city: '',
        company_postal_code: '',
        company_street: '',
        user_residency: '',
        invoice_payment_currency: '',
        bank_name: '',
        invoice_bank_no: '',
        bank_iban: '',
        bank_swift_bic: '',
        devices: [],
        vat_value: '',
        country: '',
        user_street: '',
        user_city: '',
        user_postal_code: '',
        user_phone: '',
        company_type: '',
        cash_register: '',
        verified: false,
        files: []
    });

    const [countriesList, setCountriesList] = React.useState([]);

    const [state, setState] = React.useState({
        name_check: false,
        surname_check: false,
        email_check: false,
        user_phone_check: false,
        user_address_check: false,
        company_type_check: false,
        invoice_details_check: false,
        devices_check: false,
    });

    const handleChange = name => event => {
        setState({
            ...state,
            [name]: event.target.checked
        });
    };

    const handleChangeUserDetails = e => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value,
        });
    };

    // get countriesList
    async function getCountriesList() {
        const list = await pulse.countries.getCountriesList();
        setCountriesList(list);
    }

    async function getData() {
        // user data
        const user = await pulse.user.getUserData();
        setUserDetails({...user});

        // confirmations
        const fields = [];
        user.confirmations.map(item => fields[item.name] = (item.value !== 0));
        setState(fields);

        if (props.can_edit) {
            setUserDetails({
                verified: false
            })
        }

    }

    function handleSubmit() {

        setSubmit(false);

        // update fields
        pulse.candidate.selfUpdate({
            id: userDetails.id,
            fields: {
                ...userDetails
            },
            confirmations: state
        });

        setUserDetails({
            verified: true
        });

        setTimeout(() => {
            localStorage.removeItem('appState');
            localStorage.removeItem('_base_isAuthenticated');
        }, 200)

    }

    useEffect(() => {
        getData();
        getCountriesList();
    }, []);

    return (
        <>
            {!userDetails.verified ? (
                <Grid direction="column" alignItems="flex-start" container spacing={0}>

                    {/* FORM FIELD ROW */}
                    <Grid spacing={0} container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h6"
                                    className={classes.header}
                                    style={{
                                        marginLeft: 10,
                                        marginBottom: 20,
                                        marginTop: 20
                                    }}>{pulse.text.personal_data}</Typography>
                            </Grid>
                        </Grid>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    disabled={read_only}
                                    id="mainForm_firstname"
                                    label={pulse.text.name}
                                    placeholder={pulse.text.name}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                    name="name"
                                    value={userDetails.name}
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <div className={classes.inlineRowFixButton}>
                                    <Tooltip
                                        classes={{
                                            popper: classes.htmlPopper,
                                            tooltip: classes.htmlTooltip,
                                        }}
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing elit. Mauris vestibulum dolor consequat commodo placerat.
                                                    Nulla ultricies, magna eget dapibus feugiat.</Typography>
                                            </React.Fragment>
                                        }
                                        aria-label="Add"
                                        placement="top">
                                        <IconButton aria-label="Delete">
                                            <HelpRounded/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Grid>
                            <Grid item xs={10} md={4}>
                                <FormControlLabel
                                    checked={state.name_check}
                                    onChange={handleChange('name_check')}
                                    value="name_check"
                                    className={classes.inlineRowFix}
                                    labelPlacement="end"
                                    control={<Checkbox color="primary"/>}
                                    label={pulse.text.accept}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    disabled={read_only}
                                    id="standard-helperText"
                                    label={pulse.text.surname}
                                    // helperText="tekst pomocniczy"
                                    placeholder={pulse.text.surname}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    name="surname"
                                    value={userDetails.surname}
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <div className={classes.inlineRowFixButton}>
                                    <Tooltip
                                        classes={{
                                            popper: classes.htmlPopper,
                                            tooltip: classes.htmlTooltip,
                                        }}
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing elit. Mauris vestibulum dolor consequat commodo placerat.
                                                    Nulla ultricies, magna eget dapibus feugiat.</Typography>
                                            </React.Fragment>
                                        }
                                        aria-label="Add"
                                        placement="top">
                                        <IconButton aria-label="Delete">
                                            <HelpRounded/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Grid>
                            <Grid item xs={10} md={4}>
                                <FormControlLabel
                                    checked={state.surname_check}
                                    onChange={handleChange('surname_check')}
                                    value="surname_check"
                                    className={classes.inlineRowFix}
                                    labelPlacement="end"
                                    control={<Checkbox color="primary"/>}
                                    label={pulse.text.accept}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}
                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    disabled={read_only}
                                    id="standard-helperText"
                                    label="Email"
                                    // helperText="tekst pomocniczy"
                                    placeholder="Email"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    value={userDetails.email}
                                    name="email"
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <div className={classes.inlineRowFixButton}>
                                    <Tooltip
                                        classes={{
                                            popper: classes.htmlPopper,
                                            tooltip: classes.htmlTooltip,
                                        }}
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing elit. Mauris vestibulum dolor consequat commodo placerat.
                                                    Nulla ultricies, magna eget dapibus feugiat.</Typography>
                                            </React.Fragment>
                                        }
                                        aria-label="Add"
                                        placement="top">
                                        <IconButton aria-label="Delete">
                                            <HelpRounded/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Grid>
                            <Grid item xs={10} md={4}>
                                <FormControlLabel
                                    checked={state.email_check}
                                    onChange={handleChange('email_check')}
                                    value="email_check"
                                    className={classes.inlineRowFix}
                                    labelPlacement="end"
                                    control={<Checkbox color="primary"/>}
                                    label={pulse.text.accept}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    disabled={read_only}
                                    id="standard-helperText"
                                    label={pulse.text.phone}
                                    // helperText="tekst pomocniczy"
                                    placeholder={pulse.text.phone}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    name="user_phone"
                                    value={userDetails.user_phone}
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <div className={classes.inlineRowFixButton}>
                                    <Tooltip
                                        classes={{
                                            popper: classes.htmlPopper,
                                            tooltip: classes.htmlTooltip,
                                        }}
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing elit. Mauris vestibulum dolor consequat commodo placerat.
                                                    Nulla ultricies, magna eget dapibus feugiat.</Typography>
                                            </React.Fragment>
                                        }
                                        aria-label="Add"
                                        placement="top">
                                        <IconButton aria-label="Delete">
                                            <HelpRounded/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Grid>
                            <Grid item xs={10} md={4}>
                                <FormControlLabel
                                    checked={state.user_phone_check}
                                    onChange={handleChange('user_phone_check')}
                                    value="user_phone_check"
                                    className={classes.inlineRowFix}
                                    labelPlacement="end"
                                    control={<Checkbox color="primary"/>}
                                    label={pulse.text.accept}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h6"
                                    className={classes.header}
                                    style={{
                                        marginLeft: 10,
                                        marginBottom: -20,
                                        marginTop: 20
                                    }}>{pulse.text.address}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    disabled={read_only}
                                    id="standard-helperText"
                                    label={pulse.text.street}
                                    // helperText="tekst pomocniczy"
                                    value={userDetails.user_street}
                                    placeholder={pulse.text.street}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    name="user_street"
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <div className={classes.inlineRowFixButton}>
                                    <Tooltip
                                        classes={{
                                            popper: classes.htmlPopper,
                                            tooltip: classes.htmlTooltip,
                                        }}
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing elit. Mauris vestibulum dolor consequat commodo placerat.
                                                    Nulla ultricies, magna eget dapibus feugiat.</Typography>
                                            </React.Fragment>
                                        }
                                        aria-label="Add"
                                        placement="top">
                                        <IconButton aria-label="Delete">
                                            <HelpRounded/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Grid>
                            <Grid item xs={10} md={4}>
                                <FormControlLabel
                                    checked={state.user_address_check}
                                    onChange={handleChange('user_address_check')}
                                    value="user_address_check"
                                    className={classes.inlineRowFix}
                                    labelPlacement="end"
                                    control={<Checkbox color="primary"/>}
                                    label={pulse.text.accept}
                                />
                            </Grid>
                            <Grid item xs={12} md={2} style={{marginTop: -40}}>
                                <TextField
                                    disabled={read_only}
                                    id="standard-helperText"
                                    label={pulse.text.postal_code}
                                    // helperText="tekst pomocniczy"
                                    placeholder={pulse.text.postal_code}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    name="user_postal_code"
                                    value={userDetails.user_postal_code}
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4} style={{marginTop: -40}}>
                                <TextField
                                    disabled={read_only}
                                    id="standard-helperText"
                                    label={pulse.text.city}
                                    // helperText="tekst pomocniczy"
                                    placeholder={pulse.text.city}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    value={userDetails.user_city}
                                    name="user_city"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h6"
                                    className={classes.header}
                                    style={{
                                        marginLeft: 10,
                                        marginBottom: -20,
                                        marginTop: 20
                                    }}>{pulse.text.company_type}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6} style={{marginTop: -20}}>
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <RadioGroup
                                        aria-label="company_type"
                                        name="company_type"
                                        // className={classes.group}

                                        value={userDetails.company_type}
                                        onChange={(e) => {
                                            handleChangeUserDetails(e)
                                        }}>
                                        <FormControlLabel disabled={read_only} value="0"
                                                          control={<Radio color="primary"/>}
                                                          label={pulse.text.company_type_text[0]}/>
                                        <FormControlLabel disabled={read_only} value="1"
                                                          control={<Radio color="primary"/>}
                                                          label={pulse.text.company_type_text[1]}/>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={1}>
                                <div className={classes.inlineRowFixButton}>
                                    <Tooltip
                                        classes={{
                                            popper: classes.htmlPopper,
                                            tooltip: classes.htmlTooltip,
                                        }}
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing elit. Mauris vestibulum dolor consequat commodo placerat.
                                                    Nulla ultricies, magna eget dapibus feugiat.</Typography>
                                            </React.Fragment>
                                        }
                                        aria-label="Add"
                                        placement="top">
                                        <IconButton aria-label="Delete">
                                            <HelpRounded/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Grid>
                            <Grid item xs={10} md={4}>
                                <FormControlLabel
                                    checked={state.company_type_check}
                                    onChange={handleChange('company_type_check')}
                                    value="company_type_check"
                                    className={classes.inlineRowFix}
                                    labelPlacement="end"
                                    control={<Checkbox color="primary"/>}
                                    label={pulse.text.accept}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography
                                    variant="h6"
                                    className={classes.header}
                                    style={{
                                        marginLeft: 10,
                                        marginBottom: -10,
                                        marginTop: 20
                                    }}>{pulse.text.resident}</Typography>
                            </Grid>
                            <Grid item xs={12} md={12} style={{marginTop: -20}}>
                                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                    <Select
                                        native
                                        value={userDetails.user_residency}
                                        onChange={(e) => {
                                            handleChangeUserDetails(e)
                                        }}
                                        input={
                                            <OutlinedInput margin="dense" name="user_residency" labelWidth={0} id="user_residency"/>
                                        }
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        name="user_residency">
                                        <option value="">- wybierz -</option>
                                        {countriesList && countriesList.map(item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                                {userDetails.user_residency !== 'PL' && (
                                    <div>
                                        <Typography style={{marginTop: 20, marginBottom: 20}} className={classes.header}
                                                    variant="h6">-
                                            certyfikat
                                            rezydencji podatkowej <br/> -
                                            Oświadczenie o byciu ostatecznym
                                            beneficjentem</Typography>
                                        <DropzoneAreaExample files={userDetails.files}
                                                             type={5}
                                                             source_id={userDetails.id}
                                                             source={0}/>

                                    </div>
                                )}
                            </Grid>

                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h6"
                                    className={classes.header}
                                    style={{
                                        marginLeft: 10,
                                        marginBottom: -20,
                                        marginTop: 20
                                    }}>{pulse.text.billing}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    disabled={read_only}
                                    id="invoice_company_name"
                                    label={pulse.text.company_name}
                                    placeholder={pulse.text.company_name}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                    name="invoice_company_name"
                                    value={userDetails.invoice_company_name}
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <div className={classes.inlineRowFixButton}>
                                    <Tooltip
                                        classes={{
                                            popper: classes.htmlPopper,
                                            tooltip: classes.htmlTooltip,
                                        }}
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing elit. Mauris vestibulum dolor consequat commodo placerat.
                                                    Nulla ultricies, magna eget dapibus feugiat.</Typography>
                                            </React.Fragment>
                                        }
                                        aria-label="Add"
                                        placement="top">
                                        <IconButton aria-label="Delete">
                                            <HelpRounded/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Grid>
                            <Grid item xs={10} md={4}>
                                <FormControlLabel
                                    checked={state.invoice_details_check}
                                    onChange={handleChange('invoice_details_check')}
                                    value="invoice_details_check"
                                    className={classes.inlineRowFix}
                                    labelPlacement="end"
                                    control={<Checkbox color="primary"/>}
                                    label={pulse.text.accept}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            {/* eof */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    disabled={read_only}
                                    id="company_street"
                                    label={pulse.text.address}
                                    placeholder={pulse.text.address}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textField}
                                    name="company_street"
                                    value={userDetails.company_street}
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}></Grid>
                            <Grid item xs={12} md={2} style={{marginTop: -40}}>
                                <TextField
                                    disabled={read_only}
                                    id="company_postal_code"
                                    label={pulse.text.postal_code}
                                    // helperText="tekst pomocniczy"
                                    placeholder={pulse.text.postal_code}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    name="company_postal_code"
                                    value={userDetails.company_postal_code}
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} style={{marginTop: -40}}>
                                <TextField
                                    disabled={read_only}
                                    label={pulse.text.city}
                                    placeholder={pulse.text.city}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    value={userDetails.company_city}
                                    name="company_city"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            {/*    eof */}
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={12} md={6} style={{marginTop: 0}}>
                                <TextField
                                    disabled={read_only}
                                    label="NIP"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    value={userDetails.company_nip}
                                    name="company_nip"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h6"
                                    className={classes.header}
                                    style={{
                                        marginLeft: 10,
                                        marginBottom: -20,
                                        marginTop: 0
                                    }}>{pulse.text.vat}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6} style={{marginTop: -20}}>
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <RadioGroup
                                        name="vat_value"
                                        value={userDetails.vat_value}
                                        onChange={(e) => {
                                            handleChangeUserDetails(e)
                                        }}
                                    >
                                        <FormControlLabel value="23" control={<Radio color="primary"/>}
                                                          label={pulse.text.vat_payer}/>
                                        <FormControlLabel value="zw" control={<Radio color="primary"/>}
                                                          label={pulse.text.vat_ex}/>
                                        <FormControlLabel value="rc" control={<Radio color="primary"/>}
                                                          label={pulse.text.vat_rev}/>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h6"
                                    className={classes.header}
                                    style={{
                                        marginLeft: 10,
                                        marginBottom: -20,
                                        marginTop: 0
                                    }}>{pulse.text.cash}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6} style={{marginTop: -20}}>
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <RadioGroup
                                        name="cash_register"
                                        value={userDetails.cash_register}
                                        onChange={(e) => {
                                            handleChangeUserDetails(e)
                                        }}
                                    >
                                        <FormControlLabel value="1" control={<Radio color="primary"/>}
                                                          label={pulse.text.yes}/>
                                        <FormControlLabel value="0" control={<Radio color="primary"/>}
                                                          label={pulse.text.no}/>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h6"
                                    className={classes.header}
                                    style={{
                                        marginLeft: 10,
                                        marginBottom: -20,
                                        marginTop: 20
                                    }}>{pulse.text.billing_info}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label={pulse.text.bank_name}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    value={userDetails.bank_name}
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={6}>
                                <TextField
                                    label={pulse.text.bank_no}
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    value={userDetails.invoice_bank_no}
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>

                            </Grid>
                            <Grid item xs={4}>

                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={6}>
                                <TextField
                                    label="IBAN"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    value={userDetails.bank_iban}
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>

                            </Grid>
                            <Grid item xs={4}>

                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={6}>
                                <TextField
                                    label="SWIFT/BIC"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined"
                                    value={userDetails.bank_swift_bic}
                                    onChange={(e) => {
                                        handleChangeUserDetails(e)
                                    }}
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>

                            </Grid>
                            <Grid item xs={4}>

                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="center" container spacing={5}>
                            <Grid item xs={6}>
                                <Typography variant="h6"
                                            style={{
                                                marginLeft: 10,
                                                marginTop: 15
                                            }}>{pulse.text.invoice.currency}</Typography>
                                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                    <Select
                                        value={userDetails.invoice_payment_currency}
                                        onChange={(e) => {
                                            handleChangeUserDetails(e)
                                        }}
                                        input={
                                            <OutlinedInput
                                                margin="dense"
                                                name="invoice_payment_currency"
                                                id="invoice_payment_currency"
                                            />
                                        }
                                    >
                                        <MenuItem value="CHF">BGN</MenuItem>
                                        <MenuItem value="CHF">CHF</MenuItem>
                                        <MenuItem value="DKK">DKK</MenuItem>
                                        <MenuItem value="EUR">EUR</MenuItem>
                                        <MenuItem value="GBP">GBP</MenuItem>
                                        <MenuItem value="PLN">PLN</MenuItem>
                                        <MenuItem value="SEK">SEK</MenuItem>
                                        <MenuItem value="SGD">SGD</MenuItem>
                                        <MenuItem value="USD">USD</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={1}>

                            </Grid>
                            <Grid item xs={5} style={{marginTop: 13}}>

                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}

                    {/* FORM FIELD ROW */}
                    <Grid container>
                        <Grid alignItems="flex-start" container spacing={5}>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h6"
                                    className={classes.header} s
                                    style={{
                                        marginLeft: 10,
                                        marginBottom: -20,
                                        marginTop: 40
                                    }}>{pulse.text.devices}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                {userDetails.devices.length > 0 ? (
                                    <Paper style={{marginLeft: 10}}>
                                        <List dense={true}>
                                            {userDetails.devices.map(item => (
                                                <ListItem key={item.id}>
                                                    <ListItemText
                                                        primary={pulse.text.device_title + " - " + item.device_name}
                                                        secondary={"ID: " + item.device_id}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                ) : (
                                    <div style={{marginLeft: 15}}>Brak urządzeń</div>
                                )}
                            </Grid>
                            <Grid item xs={1}>
                                <div className={classes.inlineRowFixButton}>
                                    <Tooltip
                                        classes={{
                                            popper: classes.htmlPopper,
                                            tooltip: classes.htmlTooltip,
                                        }}
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing elit. Mauris vestibulum dolor consequat commodo placerat.
                                                    Nulla ultricies, magna eget dapibus feugiat.</Typography>
                                            </React.Fragment>
                                        }
                                        aria-label="Add"
                                        placement="top">
                                        <IconButton aria-label="Delete">
                                            <HelpRounded/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Grid>
                            <Grid item xs={5} md={4}>
                                <FormControlLabel
                                    checked={state.devices_check}
                                    onChange={handleChange('devices_check')}
                                    value="devices_check"
                                    className={classes.inlineRowFix}
                                    labelPlacement="end"
                                    control={<Checkbox color="primary"/>}
                                    label={pulse.text.accept}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button disabled={!canSubmit}
                                        onClick={() => {
                                            handleSubmit()
                                        }}
                                        variant={"contained"}
                                        size={"large"}
                                        fullWidth={true}
                                        color={"secondary"}
                                        style={{marginTop: 0}}>{pulse.text.send_main_form_btn}</Button>
                            </Grid>
                            <Grid item xs={12}>
                                {pulse.text.send_main_form}
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* FORM FIELD ROW */}
                </Grid>
            ) : (
                <div style={{textAlign: 'center'}}>
                    Dane zostaly przeslane do weryfikacji.
                </div>
            )
            }
        </>
    )


}


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    formRoot: {
        flexGrow: 1,
        paddingTop: 40,
        paddingBottom: 40,
    },
    button: {
        marginTop: theme.spacing(),
        marginRight: theme.spacing(),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    textField: {
        marginLeft: theme.spacing(),
        marginRight: theme.spacing(),
        marginBottom: 10,
        width: '100%'
    },
    textFieldInputDiff: {
        backgroundColor: '#ecffe4'
    },
    formControl: {
        margin: theme.spacing(),
        minWidth: 120,
    },
    rightIcon: {
        marginLeft: theme.spacing(),
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    inlineRowFixButton: {
        position: 'relative',
        top: -8
    },
    input: {
        display: 'none',
    },
    inlineRowFix: {
        position: 'relative',
        top: -8
    },
    h6Headline: {
        marginTop: 20,
        marginBottom: -15,
        marginLeft: 10
    },
    htmlTooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 1)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
        '& b': {
            fontWeight: theme.typography.fontWeightMedium,
        },
    },
    connectorActive: {
        '& $connectorLine': {
            borderColor: theme.palette.secondary.main,
        },
    },
    connectorCompleted: {
        '& $connectorLine': {
            borderColor: theme.palette.primary.main,
        },
    },
    connectorDisabled: {
        '& $connectorLine': {
            borderColor: theme.palette.grey[100],
        },
    },
    connectorLine: {
        transition: theme.transitions.create('border-color'),
    },
    header: {
        backgroundColor: '#e8e8e8',
        padding: 10,
        fontWeight: 'bold',
    }
}));