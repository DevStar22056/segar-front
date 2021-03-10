import React, {useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import ControlledExpansionPanels from './editForm';

import pulse from '../../pulse';

export default function FullScreenDialog(props) {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [faq, setFaq] = useState([]);
    const [url, setUrl] = useState('');

    function handleClose() {
        setOpen(false);
        setUrl('');
    }

    // handleRemove
    function handleRemove(id) {
        pulse.faq.deleteFaqItem({
            id: id
        });
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    const handleSaveRef = useRef();

    useEffect(() => {
        if (url) {
            const item = props.faq;
            setFaq(item);
            setOpen(true);
        }
    }, [url]);

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => {
                setUrl(`${props.faq}`)
            }}>
                Edytuj
            </Button>
            <Button variant="contained" color="secondary"
                    style={{marginLeft: 10}}
                    onClick={() => handleRemove(props.faq.id)}>
                Usuń
            </Button>
            {faq && (
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
                                Zapisz zmiany
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <ControlledExpansionPanels ref={handleSaveRef} faq={faq}/>
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
