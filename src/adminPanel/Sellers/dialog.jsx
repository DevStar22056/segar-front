import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import {DialogContent} from "@material-ui/core";
import SellerForm from "./SellerForm";
import AddIcon from '@material-ui/icons/Add';
import Fab from "@material-ui/core/Fab";
import MuiDialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function FullScreenDialog() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>

            <div style={{textAlign: 'right', padding: 20}}>
                <Fab onClick={() => handleClickOpen()} variant="extended" color="primary"
                     aria-label="Add"
                     style={{marginBottom: 30}}>
                    <AddIcon style={{marginRight: 10}}/> Dodaj sprzedawcę
                </Fab>
            </div>

            <Dialog fullWidth maxWidth={"lg"} open={open} onClose={handleClose} TransitionComponent={Transition}>
                <DialogContent>
                    <SellerForm/>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="secondary">
                        Anuluj
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}