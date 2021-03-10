import React, { useEffect, useState, useRef, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import ImageUploader from 'react-images-upload';
import { Paper } from "@material-ui/core";
import helpers from "../../helpers";
import pulse from "../../pulse";
import { API, API_URL } from "../../config";
import CircularProgress from '@material-ui/core/CircularProgress';
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from "@material-ui/core/Radio";
import InlineDatePickerDemo from '../../components/DatePicker';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(1),
    },
    formControl: {
        marginTop: theme.spacing(1)
    },
    textField: {
        // marginBottom: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    title: {
        fontSize: 13,
        marginBottom: 4
    },
    upToValue: {
        padding: '0 !important'
    },
    radioLabel: {
        fontSize: 14
    }
}));

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export default function ContractorForm(props) {
    const classes = useStyles();

    const [updateMode, setMode] = React.useState(false);
    // const [logo, setLogo] = React.useState(false);
    // const [logoURL, setLogoURL] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [nipError, setNipError] = React.useState(false);
    const [contractorDetails, setContractorDetails] = useState({
        nip: '',
        company_name: '',
        street: '',
        address1: '',
        address2: '',
        postal_code: '',
        city: '',
        country: '',
        regon: '',
        currency: '',
        account_manager: '',
        shipping_type: '',
        shipping_email: '',
        shipping_post: '',
        is_b2b: false,
        is_uop: false,
        is_margin: false,
        is_inne: false,
        terms_uop: '',
        terms_currency_type: '',
        terms_payment_deadline: '',
        invoicing_type: '',
        invoicing_invoice: '',
        invoicing_process: '',
    });

    const [bankDetails, setBankDetails] = React.useState({
        bank_name: '',
        invoice_bank_no: '',
        bank_iban: '',
        bank_swift_bic: '',
        resource_id: '',
        resource_type: 2
    });

    const [contactDetails, setContactDetails] = React.useState({
        contact_name: '',
        position: '',
        phone: '',
        mail: '',
        resource_id: '',
    });

    const [agreementDetails, setAgreementDetails] = React.useState({
        agree_from: '',
        agree_to: '',
        period: '',
        penalties: '',
        resource_id: '',
    });

    const [error, setError] = React.useState(false);
    const [loadingContractorDetail, setLoadingContractorDetail] = React.useState(false);
    const [loadingContactDetail, setLoadingContactDetail] = React.useState(false);
    const [loadingBankAccountDetail, setLoadingBankAccountDetail] = React.useState(false);

    const handleChangeState = name => event => {
        setContractorDetails({...contractorDetails, [name]: event.target.checked});
    };

    const handleChangeContractorDetails = event => {
        const val = event.target.value;
        setContractorDetails({ ...contractorDetails, [event.target.name]: val });
    };

    const handleDateChange = (value, name) => {
        setAgreementDetails({ ...agreementDetails, [name]: value });
    };

    const handleBankDetailsChange = event => {
        const val = event.target.value;
        setBankDetails({ ...bankDetails, [event.target.name]: val });
    };

    const handleContactDetailsChange = event => {
        const val = event.target.value;
        setContactDetails({ ...contactDetails, [event.target.name]: val });
    };

    const handleAgreementDetailsChange = event => {
        const val = event.target.value;
        setAgreementDetails({ ...agreementDetails, [event.target.name]: val });
    };

    /* GUS */
    const handleGUSData = async () => {
        const nip = contractorDetails.nip;

        if (helpers.isValidNip(nip)) {
            const res = await pulse.gus.getDataByNIP({
                nip: nip
            });
            setContractorDetails({
                ...contractorDetails,
                company_name: res.data.invoice_company_name,
                street: res.data.company_street,
                city: res.data.company_city,
                postal_code: res.data.company_postal_code,
            });
        } else {
            setNipError(true);
        }

        setTimeout(() => {
            setNipError(false);
        }, 5000);
    };

    /* handleSave */
    const handleSave = () => {
        // validation
        if (contractorDetails.company_name.length <= 0) {
            setError(true);
        } else {
            setError(false);

            setTimeout(() => {
                handleSendData();
            })
        }
        //
    };

    const updateContractor = id => {
        pulse.contractors.updateContractor({
            id: id,
            ...contractorDetails
        }).then(res => {
            setTimeout(() => window.location.reload(), 900);
        });

        let _temp = bankDetails;
        _temp.resource_id = id;
        pulse.user.addBankAccountRequest({
            ..._temp
        });

    };

    const createContractor = () => {
        pulse.contractors.createContractor({
            ...contractorDetails
        }).then(res => {

            // RETURN ID
            if (res.id) {
                // contractor id to bank acc
                let _temp = bankDetails;
                _temp.resource_id = res.id;

                // add bank details
                pulse.user.addBankAccountRequest({
                    ..._temp
                }).then(res => {
                    let _temp_contact = contactDetails;
                    _temp_contact.resource_id = _temp.resource_id;

                    // add contact details
                    pulse.user.addContactRequest({
                        ..._temp_contact
                    }).then(res => {
                        let _temp_agreement = agreementDetails;
                        _temp_agreement.resource_id = _temp.resource_id;

                        // add contact details
                        pulse.user.addAgreementRequest({
                            ..._temp_agreement
                        }).then(res => {
                            setTimeout(() => window.location.reload(), 300);
                        })
                    });
                });
            }
        });
    };

    const handleSendData = () => {
        // lock
        setDisabled(true);
        setLoading(true);

        // create new
        if (updateMode) {
            updateContractor(props.contractor_id);
        } else {
            createContractor();
        }

    };


    const getContractor = async (id) => {
        await pulse.contractors.getContractor({
            id: id
        }).then(
            res => {
                setLoading(false);

                // show data
                setContractorDetails({
                    ...res.data
                });

                setBankDetails({
                    ...res.data.bank_accounts
                });

                setContactDetails({
                    ...res.data.contacts
                })

                setAgreementDetails({
                    ...res.data.agreements
                })
            }
        );
    };

    useEffect(() => {

        setLoading(false);

        if (props.contractor_id) {
            setLoading(true);
            setMode(true);
            const id = props.contractor_id;

            // get contractor
            getContractor(id);
        }

    }, [props.contractor_id]);

    const prevContractorDetails = usePrevious(contractorDetails);

    useEffect(() => {
        if (prevContractorDetails) {
            if (prevContractorDetails !== contractorDetails && !loadingContractorDetail) {
                setLoadingContractorDetail(true);
            }
        }
    }, [contractorDetails]);

    const prevContactDetails = usePrevious(contactDetails);

    useEffect(() => {
        if (prevContactDetails) {
            if (prevContactDetails !== contactDetails && !loadingContactDetail) {
                setLoadingContactDetail(true);
            }
        }
    }, [contactDetails]);

    const prevBankDetails = usePrevious(bankDetails);

    useEffect(() => {
        if (prevBankDetails) {
            if (prevBankDetails !== bankDetails && !loadingBankAccountDetail) {
                setLoadingBankAccountDetail(true);
            }
        }
    }, [bankDetails]);
    return (
        <div className={classes.root}>

            <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Dane firmy
                        </Typography>
                    </Grid>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={7}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="NIP"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={contractorDetails.nip}
                                name="nip"
                                onChange={el => handleChangeContractorDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                            {nipError && <div>Wystąpił błąd z numerem NIP</div>}
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Button onClick={handleGUSData} fullWidth variant="outlined" color="primary"
                                size="medium" component="span"
                                className={classes.button}>
                                GUS
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                multiline
                                label="Nazwa firmy"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={contractorDetails.company_name}
                                name="company_name"
                                onChange={el => handleChangeContractorDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="Ulica"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={contractorDetails.street}
                                name="street"
                                onChange={el => handleChangeContractorDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="Numer domu"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={contractorDetails.address1}
                                name="address1"
                                onChange={el => handleChangeContractorDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="Numer lokalu"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={contractorDetails.address2}
                                name="address2"
                                onChange={el => handleChangeContractorDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="Kod pocztowy"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={contractorDetails.postal_code}
                                name="postal_code"
                                onChange={el => handleChangeContractorDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="Miejscowość"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={contractorDetails.city}
                                name="city"
                                onChange={el => handleChangeContractorDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="Kraj"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={contractorDetails.country}
                                name="country"
                                onChange={el => handleChangeContractorDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="REGON"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={contractorDetails.regon}
                                name="regon"
                                onChange={el => handleChangeContractorDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                    </Grid>


                    {/*nip <br/> GUS <br/>*/}
                    {/*nazwa firmy<br/>*/}
                    {/*ulica<br/>*/}
                    {/*nr domu | nr lokalu <br/>*/}
                    {/*kod | miejscowosc<br/>*/}
                    {/*regon<br/>*/}
                    {/*logo*/}

                </Grid>
                <Grid item xs={12} sm={4}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Kontrahent UE
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined" className={classes.formControl}>
                            <Select
                                disabled={disabled}
                                native
                                value={contractorDetails.currency}
                                onChange={el => handleChangeContractorDetails(el)}
                                input={
                                    <OutlinedInput
                                        margin="dense"
                                        name="currency"
                                        id="currency"
                                        disabled={disabled}
                                    />
                                }>
                                <option value="poland">Polska</option>
                                <option value="germany">Niemcy</option>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom style={{ marginTop: 30 }}>
                            Account Manager
                        </Typography>
                        {/* FIELD */}
                        <TextField
                            disabled={disabled}
                            fullWidth
                            label="Account Manager"
                            className={classes.textField}
                            margin="dense"
                            variant="outlined"
                            defaultValue={contractorDetails.account_manager}
                            name="account_manager"
                            onChange={el => handleChangeContractorDetails(el)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                        />
                        {/* FIELD */}
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Dane bankowe
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="Dane banku"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={bankDetails.bank_name}
                                name="bank_name"
                                onChange={el => handleBankDetailsChange(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingBankAccountDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="Numer konta"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={bankDetails.invoice_bank_no}
                                name="invoice_bank_no"
                                onChange={el => handleBankDetailsChange(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingBankAccountDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="IBAN"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={bankDetails.bank_iban}
                                name="bank_iban"
                                onChange={el => handleBankDetailsChange(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingBankAccountDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="SWIFT"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                defaultValue={bankDetails.bank_swift_bic}
                                name="bank_swift_bic"
                                onChange={el => handleBankDetailsChange(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                key={loadingBankAccountDetail ? 'loaded' : 'notLoadedYet'}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" className={classes.title}>Waluta rozliczenia</Typography>
                            <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                <Select
                                    disabled={disabled}
                                    native
                                    value={contractorDetails.currency}
                                    onChange={el => handleChangeContractorDetails(el)}
                                    input={
                                        <OutlinedInput
                                            margin="dense"
                                            name="currency"
                                            id="currency"
                                            disabled={disabled}
                                        />
                                    }>
                                    <option value="PLN">PLN</option>
                                    <option value="EUR">EUR</option>
                                    <option value="USD">USD</option>
                                    <option value="GBP">GBP</option>
                                    <option value="CHF">BGN</option>
                                    <option value="CHF">CHF</option>
                                    <option value="DKK">DKK</option>
                                    <option value="SEK">SEK</option>
                                    <option value="SGD">SGD</option>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>


                <Grid item xs={12}>

                    <Grid container alignItems="flex-start" spacing={2}>

                        <Grid item xs={4}>
                            <Grid container alignItems="flex-start" spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Dane kontaktowe
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" className={classes.title}>Finanse/Księgowość</Typography>
                                    {/* FIELD */}
                                    <TextField
                                        disabled={disabled}
                                        fullWidth
                                        label="Imię i nazwisko"
                                        className={classes.textField}
                                        margin="dense"
                                        variant="outlined"
                                        defaultValue={contactDetails.contact_name}
                                        name="contact_name"
                                        onChange={el => handleContactDetailsChange(el)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        key={loadingContactDetail ? 'loaded' : 'notLoadedYet'}
                                    />
                                    {/* FIELD */}
                                </Grid>
                                <Grid item xs={12}>
                                    {/* FIELD */}
                                    <TextField
                                        disabled={disabled}
                                        fullWidth
                                        label="Stanowisko"
                                        className={classes.textField}
                                        margin="dense"
                                        variant="outlined"
                                        defaultValue={contactDetails.position}
                                        name="position"
                                        onChange={el => handleContactDetailsChange(el)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        key={loadingContactDetail ? 'loaded' : 'notLoadedYet'}
                                    />
                                    {/* FIELD */}
                                </Grid>
                                <Grid item xs={12}>
                                    {/* FIELD */}
                                    <TextField
                                        disabled={disabled}
                                        fullWidth
                                        label="Telefon"
                                        className={classes.textField}
                                        margin="dense"
                                        variant="outlined"
                                        defaultValue={contactDetails.phone}
                                        name="phone"
                                        onChange={el => handleContactDetailsChange(el)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        key={loadingContactDetail ? 'loaded' : 'notLoadedYet'}
                                    />
                                    {/* FIELD */}
                                </Grid>
                                <Grid item xs={12}>
                                    {/* FIELD */}
                                    <TextField
                                        disabled={disabled}
                                        fullWidth
                                        label="E-mail"
                                        className={classes.textField}
                                        margin="dense"
                                        variant="outlined"
                                        defaultValue={contactDetails.mail}
                                        name="mail"
                                        onChange={el => handleContactDetailsChange(el)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        key={loadingContactDetail ? 'loaded' : 'notLoadedYet'}
                                    />
                                    {/* FIELD */}
                                </Grid>
                            </Grid>

                        </Grid>
                        {/*<Grid item xs={2}></Grid>*/}
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                            <Grid container alignItems="flex-start" spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Wysłka faktur
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <RadioGroup
                                        aria-label="shipping_type"
                                        name="shipping_type"
                                        // className={classes.group}
                                        value={contractorDetails.shipping_type}
                                        onChange={handleChangeContractorDetails}>
                                        <Grid container alignItems="flex-start" spacing={2}>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    value="0"
                                                    control={<Radio color="primary" />}
                                                    label="E-mail"
                                                    classes={{ label: classes.radioLabel }} />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    value="1"
                                                    control={<Radio color="primary" />}
                                                    label="POCZTA"
                                                    classes={{ label: classes.radioLabel }} />
                                            </Grid>
                                            {/* FIELD */}
                                            {contractorDetails.shipping_type == "0" ? (
                                                <TextField
                                                    disabled={disabled}
                                                    fullWidth
                                                    label="E-mail"
                                                    className={classes.textField}
                                                    margin="dense"
                                                    variant="outlined"
                                                    defaultValue={contractorDetails.shipping_email}
                                                    name="shipping_email"
                                                    onChange={el => handleChangeContractorDetails(el)}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                                                />
                                            ) : contractorDetails.shipping_type == "1" ? (
                                                <TextField
                                                    disabled={disabled}
                                                    fullWidth
                                                    rows={5}
                                                    multiline
                                                    label="Adres"
                                                    className={classes.textField}
                                                    margin="dense"
                                                    variant="outlined"
                                                    defaultValue={contractorDetails.shipping_post}
                                                    name="shipping_post"
                                                    onChange={el => handleChangeContractorDetails(el)}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                                                />

                                            ) : null}
                                            {/* FIELD */}
                                        </Grid>
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <Grid container alignItems="flex-start" spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Warunki handlowe
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container alignItems="flex-start" spacing={2}>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    value="0"
                                                    control={
                                                        <Checkbox
                                                            checked={contractorDetails.is_b2b == 1 || contractorDetails.is_b2b == true? true: false}
                                                            onChange={handleChangeState('is_b2b')}
                                                            value={contractorDetails.is_b2b == 1 || contractorDetails.is_b2b == true? true: false}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="B2B"
                                                    classes={{ label: classes.radioLabel }} />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Grid container alignItems="flex-start" spacing={2}>
                                                    <Grid item xs={5}>
                                                        <FormControlLabel
                                                            value="1"
                                                            control={
                                                                <Checkbox
                                                                    checked={contractorDetails.is_uop == 1 ||  contractorDetails.is_uop == true? true: false}
                                                                    onChange={handleChangeState('is_uop')}
                                                                    value={contractorDetails.is_uop == 1 ||  contractorDetails.is_uop == true? true: false}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label="UoP"
                                                            classes={{ label: classes.radioLabel }} />
                                                    </Grid>
                                                    {contractorDetails.is_uop == 1 || contractorDetails.is_uop == true ? (
                                                        <Grid item xs={7} className={classes.upToValue}>
                                                            <TextField
                                                                disabled={disabled}
                                                                label="%"
                                                                fullWidth
                                                                margin="dense"
                                                                variant="outlined"
                                                                onChange={handleChangeContractorDetails}
                                                                value={contractorDetails.terms_uop}
                                                                name="terms_uop"
                                                                className={classes.textField}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Grid>
                                                    ) : null}
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    value="2"
                                                    control={
                                                        <Checkbox
                                                            checked={contractorDetails.is_margin == 1 ||  contractorDetails.is_margin == true? true: false}
                                                            onChange={handleChangeState('is_margin')}
                                                            value={contractorDetails.is_margin == 1 ||  contractorDetails.is_margin == true? true: false}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="marża"
                                                    classes={{ label: classes.radioLabel }} />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    value="3"
                                                    control={
                                                        <Checkbox
                                                            checked={contractorDetails.is_inne == 1 ||  contractorDetails.is_inne == true? true: false}
                                                            onChange={handleChangeState('is_inne')}
                                                            value={contractorDetails.is_inne == 1 ||  contractorDetails.is_inne == true? true: false}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Inne"
                                                    classes={{ label: classes.radioLabel }} />
                                            </Grid>
                                        </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" className={classes.title}>Waluta</Typography>
                                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                        <Select
                                            disabled={disabled}
                                            native
                                            value={contractorDetails.terms_currency_type}
                                            onChange={el => handleChangeContractorDetails(el)}
                                            input={
                                                <OutlinedInput
                                                    margin="dense"
                                                    name="currency"
                                                    id="currency"
                                                    disabled={disabled}
                                                />
                                            }>
                                            <option value="PLN">PLN</option>
                                            <option value="EUR">EUR</option>
                                            <option value="USD">USD</option>
                                            <option value="GBP">GBP</option>
                                            <option value="CHF">BGN</option>
                                            <option value="CHF">CHF</option>
                                            <option value="DKK">DKK</option>
                                            <option value="SEK">SEK</option>
                                            <option value="SGD">SGD</option>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" className={classes.title}>Termin płatność</Typography>
                                    <TextField
                                        disabled={disabled}
                                        fullWidth
                                        // label="Do"
                                        className={classes.textField}
                                        margin="dense"
                                        variant="outlined"
                                        defaultValue={contractorDetails.terms_payment_deadline}
                                        name="terms_payment_deadline"
                                        onChange={el => handleChangeContractorDetails(el)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                            <Typography variant="h6">Fakturowanie</Typography>
                            <RadioGroup
                                aria-label="invoicing_type"
                                name="invoicing_type"
                                // className={classes.group}
                                value={contractorDetails.invoicing_type}
                                onChange={handleChangeContractorDetails}>
                                <Grid container alignItems="flex-start" spacing={2}>
                                    <Grid item xs={6}>
                                        <FormControlLabel
                                            value="0"
                                            control={<Radio color="primary" />}
                                            label="PO"
                                            classes={{ label: classes.radioLabel }} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControlLabel
                                            value="1"
                                            control={<Radio color="primary" />}
                                            label="Rozliczenia"
                                            classes={{ label: classes.radioLabel }} />
                                    </Grid>
                                </Grid>
                            </RadioGroup>
                            <Grid item xs={12}>
                                {/* FIELD */}
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    label="Opis faktury"
                                    className={classes.textField}
                                    margin="dense"
                                    variant="outlined"
                                    defaultValue={contractorDetails.invoicing_invoice}
                                    name="invoicing_invoice"
                                    onChange={el => handleChangeContractorDetails(el)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                                />
                                {/* FIELD */}
                            </Grid>
                            <Grid item xs={12}>
                                {/* FIELD */}
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    rows={5}
                                    multiline
                                    label="Opis procesu"
                                    className={classes.textField}
                                    margin="dense"
                                    variant="outlined"
                                    defaultValue={contractorDetails.invoicing_process}
                                    name="invoicing_process"
                                    onChange={el => handleChangeContractorDetails(el)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    key={loadingContractorDetail ? 'loaded' : 'notLoadedYet'}
                                />
                                {/* FIELD */}
                            </Grid>
                        </Grid>

                        <Grid item xs={4}>
                            <Grid container alignItems="flex-start" spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Umowa</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" className={classes.title}>Okres obowiązywania</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    {/* FIELD */}
                                    <InlineDatePickerDemo selected={(val) => {
                                        handleDateChange(val, 'agree_from')
                                    }} default={agreementDetails.agree_from} label="OD" />
                                    {/* FIELD */}
                                </Grid>
                                <Grid item xs={6}>
                                    <InlineDatePickerDemo selected={(val) => {
                                        handleDateChange(val, 'agree_to')
                                    }} default={agreementDetails.agree_to} label="DO" />
                                    {/* FIELD */}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" className={classes.title}>Okres wypowiedzenia</Typography>
                                    {/* FIELD */}
                                    <TextField
                                        disabled={disabled}
                                        fullWidth
                                        // label="Do"
                                        className={classes.textField}
                                        margin="dense"
                                        variant="outlined"
                                        value={agreementDetails.period}
                                        name="period"
                                        onChange={el => handleAgreementDetailsChange(el)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {/* FIELD */}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" className={classes.title}>Kary</Typography>
                                    <TextField
                                        disabled={disabled}
                                        fullWidth
                                        // label="Do"
                                        className={classes.textField}
                                        margin="dense"
                                        variant="outlined"
                                        value={agreementDetails.penalties}
                                        name="penalties"
                                        onChange={el => handleAgreementDetailsChange(el)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                {/* <Grid item xs={8}>
                                    <TextField
                                        disabled={disabled}
                                        fullWidth
                                        // label="Do"
                                        className={classes.textField}
                                        margin="dense"
                                        variant="outlined"
                                        value={agreementDetails.penalties}
                                        name="penalties"
                                        onChange={el => handleAgreementDetailsChange(el)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Button variant="contained" className={classes.button}>
                                        +
                                    </Button>
                                </Grid> */}
                            </Grid>


                        </Grid>

                    </Grid>

                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button onClick={handleSave}
                        disabled={disabled}
                        variant="contained"
                        color="primary"
                        className={classes.button}>
                        {loading && <CircularProgress style={{ marginRight: 10 }}
                            color="inherit"
                            size={14} />}
                        {updateMode ? ('Aktualizuj kontrahenta') : ('Zapisz kontrhenta')}
                    </Button>
                </Grid>
            </Grid>

        </div>
    );
}