import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import pulse from "../../pulse";

export default function FormDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    console.log(props.resource_id);

    // handle account number creation etc
    const [account_number, setAaccountNumber] = React.useState({
        bank_name: '',
        invoice_bank_no: '',
        bank_iban: '',
        bank_swift_bic: '',
        resource_id: props.resource_id ? props.resource_id : pulse.user.id,
        resource_type: 1
    });

    const handleChange = event => {
        setAaccountNumber({
            ...account_number,
            [event.target.name]: event.target.value
        })
    };

    const handleSave = () => {
        setDisabled(true);
        pulse.user.addBankAccountRequest({
            ...account_number
        }).then(res => {
            // console.log(res)
        });
    };

    return (
        <div>
            <Button onClick={handleClickOpen} variant="outlined" color="primary" size="small"
                    className={classes.button}>
                <AddIcon className={clsx(classes.leftIcon, classes.iconSmall)}/>
                {pulse.text.ADD_BANK_ACC}
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{pulse.text.BANK_ACC}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={pulse.text.bank_name}
                        name="bank_name"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="invoice_bank_no"
                        label={pulse.text.bank_no}
                        type="text"
                        fullWidth
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="bank_iban"
                        label="IBAN"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="bank_swift_bic"
                        label="SWIFT"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {pulse.text.cancel}
                    </Button>
                    <Button disabled={disabled} onClick={handleSave} color="primary">
                        {pulse.text.save}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    button: {
        marginLeft: theme.spacing(0),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
}));