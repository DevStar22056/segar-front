import React, {useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import ControlledExpansionPanels from './editForm';

export default function FullScreenDialog(props) {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);

    function handleClose() {
        setOpen(false);
        setLoading(true);
        setUser([]);
    }

    const handleSaveRef = useRef();

    useEffect(() => {
        if (props.user) {
            setOpen(true);
            setTimeout(() => {
                setUser(props.user);
            }, 0);
            setTimeout(() => {
                setLoading(false);
            }, 300);

        }
    }, [props.user]);

    return (
        <>
            {user && (
                <Dialog fullScreen open={open} onClose={handleClose}>
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Close">
                                <CloseIcon/>
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Edycja danych
                            </Typography>
                            <Button variant="contained" color="secondary" onClick={handleClose}
                                    style={{marginRight: 20}}>
                                Anuluj zmiany
                            </Button>
                            <Button variant="outlined" color="inherit"
                                    onClick={() => handleSaveRef.current.handleSave()}>
                                Zapisz zmiany
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <DialogContent>
                        {loading ? (
                            <div style={{textAlign: 'center', padding: 20}}>
                                <CircularProgress/>
                            </div>
                        ) : <ControlledExpansionPanels ref={handleSaveRef} user={user}/>}
                    </DialogContent>


                </Dialog>
            )}
        </>
    );
}

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));
