import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import pulse from "../../pulse";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";

export default function UpdateFormDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [sending, setSending] = React.useState(false);
    const [visibility, setVisibility] = React.useState(false);
    const [currencies, setCurrencies] = React.useState([]);

    async function getCurrencies() {
        const currencies = await pulse.currencies.getCurrencies();
        setCurrencies(currencies);
        setVisibility(true);
    }

    const fields = [
        {name: 'name', type: 'text', text: 'name'},
        {name: 'surname', type: 'text', text: 'surname'},
        {name: 'email', type: 'email', text: 'email'},
        {name: 'user_phone', type: 'text', text: 'phone'},
        {name: 'user_street', type: 'text', text: 'street'},
        {name: 'user_postal_code', type: 'text', text: 'postal_code'},
        {name: 'user_city', type: 'text', text: 'city'},
        {name: 'invoice_company_name', type: 'text', text: 'company_name'},
        {name: 'company_street', type: 'text', text: 'street'},
        {name: 'company_postal_code', type: 'text', text: 'postal_code'},
        {name: 'company_city', type: 'text', text: 'city'},
        {name: 'company_nip', type: 'text', text: 'NIP'},
        {name: 'bank_name', type: 'text', text: 'bank_name'},
        {name: 'invoice_bank_no', type: 'text', text: 'bank_no'},
        {name: 'bank_iban', type: 'text', text: 'IBAN'},
        {name: 'bank_swift_bic', type: 'text', text: 'SWIFT'},
        {name: 'hourly_rate', type: 'number', text: 'hourly_rate'},
        {name: 'overtime_hour_rate', type: 'number', text: 'overtime_hour_rate'},
        {name: 'vat_value', type: 'number', text: 'vat'},
        {name: 'invoice_payment_currency', type: 'text', text: 'invoice_payment_currency', options: currencies},
    ];

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    // collect new values
    const handleNewValue = event => {
        setNewUserDetails(
            {
                ...newUserDetails,
                [event.target.name]: {
                    old_value: props.user[event.target.name],
                    new_value: event.target.value,
                    field_name: event.target.name,
                    user_id: props.user.id
                }
            }
        )
    };

    // send new values
    function handleSendNewValues() {
        setSending(true);
        pulse.user.sendUserDataChangeRequest({user_id: props.user.id, data: {...newUserDetails}})
    }

    const [userDetails, setUserDetails] = React.useState(props.user);
    const [newUserDetails, setNewUserDetails] = React.useState({});

    useEffect(() => {
        getCurrencies();
    }, []);

    return (
        <div>
            <Button onClick={() => handleClickOpen()}
                    style={{marginTop: 30, float: 'right'}}
                    color="secondary"
                    variant="contained">{pulse.text.make_changes}</Button>

            <Dialog open={open}
                    onClose={handleClose}
                    fullWidth
                // fullScreen
                    maxWidth="lg">
                <DialogTitle id="form-dialog-title">{pulse.text.make_changes}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {pulse.text.make_changes_helper_text}
                    </DialogContentText>
                    <Paper style={{padding: 20}}>
                        {/*  FORM  */}
                        <Grid container alignContent="center" alignItems="center" spacing={5}>
                            <Grid item xs={7} style={{textAlign: "right"}}>
                                <Typography style={{marginBottom: 0}} variant="h6">Wartość obecna</Typography>
                            </Grid>
                            <Grid item xs={5} style={{textAlign: "left"}}>
                                <Typography style={{marginBottom: 0}} variant="h6">Wartość po zmianie</Typography>
                            </Grid>
                            {visibility && fields.map(field => (
                                <>
                                    {/* ROW */}
                                    <Grid item xs={2} style={{textAlign: "right"}}>
                                        {pulse.text[field.text]}
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            disabled
                                            margin="dense"
                                            type={field.type}
                                            fullWidth
                                            variant="outlined"
                                            name={field.name}
                                            value={userDetails[field.name]}
                                            label={pulse.text[field.text]}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        {field.options ? (
                                            <FormControl style={{width: '100%'}} variant="outlined">
                                                <Select
                                                    margin="dense"
                                                    native
                                                    // value={currency}
                                                    onChange={handleNewValue}
                                                    name={field.name}
                                                    input={
                                                        <OutlinedInput margin="dense"
                                                                       name="currency" id="outlined-currency-native"/>
                                                    }
                                                    style={{width: '100%'}}
                                                >
                                                    <option value=""/>
                                                    {currencies.length > 0 && currencies.map(item => (
                                                        <option key={item.code} value={item.code}>{item.code}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <TextField
                                                margin="dense"
                                                fullWidth
                                                variant="outlined"
                                                type={field.type}
                                                name={field.name}
                                                onChange={handleNewValue}
                                                label={pulse.text[field.text]}
                                            />
                                        )}
                                    </Grid>
                                    {/* ROW */}
                                </>
                            ))}
                        </Grid>
                        {/*  FORM  */}
                    </Paper>
                </DialogContent>
                <DialogActions style={{marginTop: 30}}>
                    <Button disabled={sending} onClick={handleSendNewValues} variant="contained" color="primary">
                        {!sending ? (
                            <Typography variant="subtitle2">{pulse.text.send_changes}</Typography>
                        ) : (
                            <Typography variant="subtitle2">{pulse.text.sended}</Typography>
                        )}
                    </Button>
                    <Button onClick={handleClose} variant="contained" color="secondary">
                        {pulse.text.cancel}
                    </Button> <br/>

                </DialogActions>
            </Dialog>
        </div>
    );
}