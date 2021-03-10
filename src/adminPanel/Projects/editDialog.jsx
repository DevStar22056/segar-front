import React, {useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ShowProject from './show';
import DialogContent from "@material-ui/core/DialogContent";

export default function FullScreenDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    function handleClose() {
        setOpen(false);
    }

    const handleSaveRef = useRef();

    return (
        <div style={{float: "left", marginRight: 20}}>
            <Button variant="contained" color="primary" onClick={() => (setOpen(true))}>
                Edytuj projekt
            </Button>
            {props.project && (
                <Dialog fullScreen open={open} onClose={handleClose}>
                    <AppBar className={classes.appBar}>
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
                                Zapisz
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <ShowProject ref={handleSaveRef} project={props.project.id} project_obj={props.project}/>
                    </DialogContent>
                </Dialog>
            )}
        </div>
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
