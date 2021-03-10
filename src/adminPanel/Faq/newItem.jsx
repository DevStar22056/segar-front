import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from "@material-ui/core/Fab";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AddIcon from '@material-ui/icons/Add';
import pulse from '../../pulse';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    icon: {
        marginRight: theme.spacing(2),
    },
    divider: {
        height: theme.spacing(3),
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function FormDialog() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [item, setItem] = React.useState([]);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleChange(e) {
        setItem({
            ...item,
            [e.target.name]: e.target.value
        });
    }

    function handleSave() {
        console.log(item);
        pulse.faq.createFaqItem({
            title: item.name,
            description: item.description
        });
        setOpen(false);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    return (
        <div>
            <Fab onClick={handleClickOpen} variant="extended" color="primary"
                 aria-label="Add"
                 style={{float: 'right', marginTop: 0, marginBottom: 30}}>
                <AddIcon style={{marginRight: 10}}/> Nowy wpis
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
                // fullScreen
                fullWidth
                maxWidth="md"
                TransitionComponent={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Nowy wpis
                        </Typography>
                        <Button variant="contained" color="secondary" onClick={handleClose}
                                style={{marginRight: 20}}>
                            Anuluj
                        </Button>
                        <Button color="inherit" variant="outlined" onClick={handleSave}>
                            {/*<SaveIcon className={classes.icon}/>*/}
                            Zapisz
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>

                    <div className={classes.divider}/>
                    <Typography variant="h6" gutterBottom style={{float: 'left'}}>
                        Tytuł
                    </Typography>
                    <TextField
                        name="name"
                        label="Tytuł"
                        style={{margin: '0'}}
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        value={item.name}
                        onChange={handleChange}
                    />
                    <div className={classes.divider}/>
                    <Typography variant="h6" gutterBottom style={{float: 'left'}}>
                        Opis
                    </Typography>
                    <TextField
                        name="description"
                        label="Opis"
                        style={{marginBottom: 30}}
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        multiline
                        rows="1"
                        rowsMax="2"
                        value={item.description}
                        onChange={handleChange}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default FormDialog;