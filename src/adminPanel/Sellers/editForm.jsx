import React, {useEffect} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import {DialogContent} from "@material-ui/core";
import SellerForm from "./SellerForm";
import Button from "@material-ui/core/Button";
import MuiDialogActions from "@material-ui/core/DialogActions/DialogActions";
import CircularProgress from '@material-ui/core/CircularProgress';

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

export default function EditForm(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [seller, setSeller] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (props.seller_id) {
            setOpen(true);
            setTimeout(() => {
                setSeller(props.seller_id);
            }, 0);
            setTimeout(() => {
                setLoading(false);
            }, 300);

        }
    }, [props.seller_id]);

    return (
        <Dialog fullWidth maxWidth={"lg"} open={open} onClose={handleClose} TransitionComponent={Transition}>
            <DialogContent>
                <SellerForm seller_id={seller}/>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} color="secondary">
                    Anuluj
                </Button>
            </DialogActions>
        </Dialog>

    );
}