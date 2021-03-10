import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import pulse from "../../pulse";
import {makeStyles, withStyles} from "@material-ui/core";
import {green, purple} from "@material-ui/core/colors";

function sendToVerification(id) {
    pulse.invoices.sendToVerification({
        id: parseInt(id),
        status: 1
    })
}

const ColorButton = withStyles(theme => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[800],
        },
    },
}))(Button);

export default function ConfirmationDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = id => {
        setOpen(true);
        // sendToVerification(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ColorButton
                disabled={props.disabled}
                onClick={() => handleClickOpen(props.id)}
                size="large"
                variant="contained"
                color="primary"
                className={classes.margin}>
                {pulse.text.invoice.invoice_submit}
            </ColorButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{pulse.text.invoice.submit_title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {pulse.text.invoice.submit_description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" variant="outlined">
                        {pulse.text.cancel}
                    </Button>
                    <Button onClick={() => sendToVerification(props.id, props.saveHandler)} color="primary" variant="contained" autoFocus>
                        {pulse.text.invoice.send_}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


const useStyles = makeStyles(theme => ({}));