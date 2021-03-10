import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import pulse from "../../pulse";

export default function MailModalDialog(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    };

    const [form, setForm] = React.useState({
        subject: pulse.text._email.default_title_text,
        body: pulse.text._email.default_message_text,
        to: ''
    });

    const [sended, setSended] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleSend = () => {
        console.log(props)
        if (form.to.length > 2) {
            setDisabled(true);
            setLoading(true);

            pulse.invoices.sendInvoiceViaMail({
                id: props.invoice.data.id,
                ...form
            }).then(
                res => {
                    if (res.data === "success") {
                        setDisabled(false);
                        setLoading(false);
                        setSended(true);
                    } else {
                        window.location.reload();
                    }
                    return res;
                }
            )
        } else {
            alert('podaj adres email')
        }


    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                {pulse.text.invoice.send_mail}
            </Button>
            <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
                <DialogTitle>{pulse.text.invoice.send_mail}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={pulse.text._email.title + ': ' + props.invoice.internal_invoice_number}
                        value={form.subject}
                        type="text"
                        variant="outlined"
                        fullWidth
                        name="subject"
                        onChange={handleChange}
                    />
                    <br/>
                    <br/>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={pulse.text._email.message}
                        type="text"
                        multiline
                        value={form.body}
                        rows={2}
                        variant="outlined"
                        fullWidth
                        name="body"
                        onChange={handleChange}
                    />
                    <Paper style={{backgroundColor: '#ffbdbd', padding: 20, marginTop: 30}}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="ADRES EMAIL GDZIE ZOSTANIE WYSLANA WIADOMOSC - TYLKO DO TESTOW"
                            type="text"
                            value={form.to}
                            variant="outlined"
                            fullWidth
                            name="to"
                            onChange={handleChange}
                        />
                        {sended && <>wiadomosc zostala wyslana</>}
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button color='secondary' onClick={handleClose} color="primary">
                        {pulse.text.cancel}
                    </Button>
                    <Button color='primary' disabled={disabled} onClick={handleSend} color="primary">
                        {pulse.text.send}
                    </Button>
                    {loading && <CircularProgress/>}
                </DialogActions>
            </Dialog>
        </div>
    );
}