import React, {useEffect} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import {DialogContent} from "@material-ui/core";
import ContractorForm from "./ContractorForm";
import Button from "@material-ui/core/Button";
import MuiDialogActions from "@material-ui/core/DialogActions/DialogActions";
import CircularProgress from '@material-ui/core/CircularProgress';
import pulse from "../../pulse";

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
    const [contractor, setContractor] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function handleRemove(id) {
        const remove = window.confirm('Na pewno chcesz usunac wybranego kontrahenta?');
        if(remove === true) {
            pulse.contractors.deleteContractor({id: id})
        }
    }

    useEffect(() => {
        if (props.contractor_id) {
            setOpen(true);
            setTimeout(() => {
                setContractor(props.contractor_id);
            }, 0);
            setTimeout(() => {
                setLoading(false);
            }, 300);

        }
    }, [props.contractor_id]);

    return (
        <Dialog fullWidth maxWidth={"lg"} open={open} onClose={handleClose} TransitionComponent={Transition}>
            <DialogContent>
                <ContractorForm contractor_id={contractor}/>
            </DialogContent>
            <DialogActions>
                <Button size="large" variant="contained" color="secondary"
                        onClick={() => handleRemove(contractor)}>
                    Usuń kontrahenta
                </Button>
                <Button autoFocus onClick={handleClose} color="secondary">
                    Anuluj
                </Button>
            </DialogActions>
        </Dialog>

    );
}