import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import ImageUploader from 'react-images-upload';
import {Paper} from "@material-ui/core";
import helpers from "../../helpers";
import pulse from "../../pulse";
import {API, API_URL} from "../../config";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(1),
    },
    textField: {
        // marginBottom: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    title: {
        fontSize: 12,
        marginBottom: 5
    }
}));


export default function SellerForm(props) {
    const classes = useStyles();

    const [updateMode, setMode] = React.useState(false);
    const [logo, setLogo] = React.useState(false);
    const [logoURL, setLogoURL] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [nipError, setNipError] = React.useState(false);
    const [sellerDetails, setSellerDetails] = useState({
        title: '',
        nip: '',
        company_name: '',
        street: '',
        address1: '',
        address2: '',
        postal_code: '',
        city: '',
        regon: '',
        currency: '',
    });

    const [bankDetails, setBankDetails] = React.useState({
        bank_name: '',
        invoice_bank_no: '',
        bank_iban: '',
        bank_swift_bic: '',
        resource_id: '',
        resource_type: 2
    });

    const [error, setError] = React.useState(false);

    const handleChangeSellerDetails = event => {
        const val = event.target.value;
        setSellerDetails({...sellerDetails, [event.target.name]: val});
    };

    const handleBankDetailsChange = event => {
        const val = event.target.value;
        setBankDetails({...bankDetails, [event.target.name]: val});
    };

    /**
     * image drop
     * */
    const onDrop = (pictureFiles, pictureDataURLs) => {
        if (pictureFiles.length > 1) {
            alert('Tylko pierwsze zdjęcię będzie uwzględnione na fakturze.')
        }
        setLogo(pictureFiles[0]);
        setLogoURL(pictureDataURLs[0]);
    };

    /* GUS */
    const handleGUSData = async () => {
        const nip = sellerDetails.nip;

        if (helpers.isValidNip(nip)) {
            const res = await pulse.gus.getDataByNIP({
                nip: nip
            });
            setSellerDetails({
                ...sellerDetails,
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

    // logo upload
    const FileUpload = async (file, id) => {

        const data = new FormData();
        data.append('file', file);
        data.append('type', 7);
        data.append('source', '2');
        data.append('source_id', id);


        const res = await fetch(API_URL + '/fileupload', {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage["appState"]).user.auth_token}`,
            },
            body: data
        })
            .then(response => response.json())
            .then(data => data);

        return res;


    };

    /* handleSave */
    const handleSave = () => {

        // validation
        if (sellerDetails.title.length <= 0) {
            setError(true);
        } else {
            setError(false);

            setTimeout(() => {
                handleSendData();
            })
        }
        //
    };

    const updateSeller = id => {
        pulse.sellers.updateSeller({
            id: id,
            ...sellerDetails
        }).then(res => {
            setTimeout(() => window.location.reload(), 900);
        });

        let _temp = bankDetails;
        _temp.resource_id = id;
        pulse.user.addBankAccountRequest({
            ..._temp
        });

        if (logo) {
            FileUpload(logo, id).then(res => {
                //success
                setTimeout(() => window.location.reload(), 300)
            });
        }

    };

    const createSeller = () => {
        pulse.sellers.createSeller({
            ...sellerDetails
        }).then(res => {

            // RETURN ID
            if (res.id) {
                // seller id to bank acc
                let _temp = bankDetails;
                _temp.resource_id = res.id;

                // add bank details
                pulse.user.addBankAccountRequest({
                    ..._temp
                }).then(res => {
                    if (logo) {
                        FileUpload(logo, _temp.resource_id).then(res => {
                            //success
                            setTimeout(() => window.location.reload(), 300)
                        });
                    } else {
                        // success
                        setTimeout(() => window.location.reload(), 300);
                    }
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
            updateSeller(props.seller_id);
        } else {
            createSeller();
        }

    };


    const getSeller = async (id) => {
        await pulse.sellers.getSeller({
            id: id
        }).then(
            res => {
                setLoading(false);

                console.log(res.data);

                // .logo.path

                if (res.data.logo) {
                    const url = API + res.data.logo.filename;
                    setLogoURL(url);
                }

                // show data
                setSellerDetails({
                    ...res.data
                });

                setBankDetails({
                    ...res.data.bank_accounts
                });
            }
        );
    };

    useEffect(() => {

        setLoading(false);

        if (props.seller_id) {
            setLoading(true);
            setMode(true);
            const id = props.seller_id;

            // get seller
            getSeller(id);
        }

    }, [props.seller_id]);

    return (
        <div className={classes.root}>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Dane sprzedawcy
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={5}>

                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12}>
                            {/* FIELD */}
                            <TextField
                                error={error}
                                variant={error ? ('filled') : ('outlined')}
                                disabled={disabled}
                                fullWidth
                                label="Nazwa sprzedawcy"
                                className={classes.textField}
                                margin="dense"
                                value={sellerDetails.title}
                                name="title"
                                onChange={el => handleChangeSellerDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="NIP"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                value={sellerDetails.nip}
                                name="nip"
                                onChange={el => handleChangeSellerDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {/* FIELD */}
                            {nipError && <div>Wystąpił błąd z numerem NIP</div>}
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Button onClick={handleGUSData} fullWidth variant="outlined" color="primary"
                                    size="small" component="span"
                                    className={classes.button}>
                                Pobierz dane z GUS
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
                                value={sellerDetails.company_name}
                                name="company_name"
                                onChange={el => handleChangeSellerDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                value={sellerDetails.street}
                                name="street"
                                onChange={el => handleChangeSellerDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                value={sellerDetails.address1}
                                name="address1"
                                onChange={el => handleChangeSellerDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                value={sellerDetails.address2}
                                name="address2"
                                onChange={el => handleChangeSellerDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                value={sellerDetails.postal_code}
                                name="postal_code"
                                onChange={el => handleChangeSellerDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                value={sellerDetails.city}
                                name="city"
                                onChange={el => handleChangeSellerDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                value={sellerDetails.regon}
                                name="regon"
                                onChange={el => handleChangeSellerDetails(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {/* FIELD */}
                        </Grid>

                        <Grid item xs={12}>
                            {/*LOGO*/}
                            {/*<input*/}
                            {/*    accept="image/*"*/}
                            {/*    className={classes.input}*/}
                            {/*    id="outlined-button-file"*/}
                            {/*    multiple*/}
                            {/*    type="file"*/}
                            {/*/>*/}
                            {/*<label htmlFor="outlined-button-file">*/}
                            {/*    <Button fullWidth variant="outlined" component="span" className={classes.button}>*/}
                            {/*        Dodaj logo*/}
                            {/*    </Button>*/}
                            {/*</label>*/}

                            <Paper>
                                <ImageUploader
                                    // defaultImages={[logo]}
                                    label={false}
                                    buttonText='Dodaj logo'
                                    onChange={onDrop}
                                    withPreview={true}
                                    withIcon={false}
                                    singleImage={true}
                                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                    maxFileSize={5242880}
                                />
                            </Paper>

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
                <Grid item xs={12} sm={2}></Grid>
                <Grid item xs={12} sm={5}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12}>
                            {/* FIELD */}
                            <TextField
                                disabled={disabled}
                                fullWidth
                                label="Dane banku"
                                className={classes.textField}
                                margin="dense"
                                variant="outlined"
                                value={bankDetails.bank_name}
                                name="bank_name"
                                onChange={el => handleBankDetailsChange(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                value={bankDetails.invoice_bank_no}
                                name="invoice_bank_no"
                                onChange={el => handleBankDetailsChange(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                value={bankDetails.bank_iban}
                                name="bank_iban"
                                onChange={el => handleBankDetailsChange(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                value={bankDetails.bank_swift_bic}
                                name="bank_swift_bic"
                                onChange={el => handleBankDetailsChange(el)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {/* FIELD */}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" className={classes.title}>Waluta rozliczenia</Typography>
                            <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                <Select
                                    disabled={disabled}
                                    native
                                    value={sellerDetails.currency}
                                    onChange={el => handleChangeSellerDetails(el)}
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
                        <br/>
                        {logoURL && <img width={200} src={logoURL}/>}

                    </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Button onClick={handleSave}
                            disabled={disabled}
                            variant="contained"
                            color="primary"
                            className={classes.button}>
                        {loading && <CircularProgress style={{marginRight: 10}}
                                                      color="inherit"
                                                      size={14}/>}
                        {updateMode ? ('Aktualizuj sprzedawcę') : ('Zapisz sprzedawcę')}
                    </Button>
                </Grid>
            </Grid>

        </div>
    );
}