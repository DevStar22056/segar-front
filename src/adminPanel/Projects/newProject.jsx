import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from "@material-ui/core/Fab";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IntegrationAutosuggest from "./clients";
import AddIcon from '@material-ui/icons/Add';
import pulse from '../../pulse';
import IntegrationReactSelect from './usersList';
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
    const [formName, setFormName] = React.useState('');
    const [formDescription, setFormDescription] = React.useState('');
    const [formClient, setFormClient] = React.useState('');
    const [formCompanyName, setCompanyName] = React.useState('');
    const [formUsers, setSelectedUsers] = React.useState('');

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleNameChange(e) {
        var val = e.target.value;
        setFormName(val);
    }

    function handleDescriptionChange(e) {
        var val = e.target.value;
        setFormDescription(val);
    }

    const handleSelect = e => {
        console.log(e);
        if (e.length > 0) {
            setFormClient(e[0].id);
            setCompanyName(e[0].company_name);
        }
    };

    function handleSelectUsers(e) {
        console.log(e);
        if (e !== null) {
            setSelectedUsers(e);
        }
    }

    function handleSave() {
        if (formName.length > 0) {
            pulse.projects.createProject({
                name: formName,
                description: formDescription,
                client_id: formClient,
                company_name: formCompanyName,
                selectedUsers: formUsers
            });
            // setOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 300);
        }
    }

    useEffect(() => {

    }, []);

    return (
        <div style={{textAlign: "right"}}>
            <Fab onClick={handleClickOpen} variant="extended" color="primary"
                 aria-label="Add"
                 style={{marginTop: 0, marginBottom: 40}}>
                <AddIcon style={{marginRight: 10}}/> Dodaj projekt
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen
                TransitionComponent={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Nowy projekt
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
                        Nazwa projektu
                    </Typography>
                    <TextField
                        id="name"
                        label="Project name"
                        style={{margin: '0'}}
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        onChange={handleNameChange}
                    />
                    <div className={classes.divider}/>

                    <Typography variant="h6" gutterBottom style={{float: 'left'}}>
                        Opis projektu
                    </Typography>
                    <TextField
                        id="description"
                        label="Project description"
                        style={{margin: '0'}}
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        multiline
                        rows="1"
                        rowsMax="2"
                        onChange={handleDescriptionChange}
                    />

                    <div className={classes.divider}/>
                    <Typography variant="h6" gutterBottom style={{float: 'left'}}>
                        Nazwa klienta
                    </Typography>
                    <IntegrationAutosuggest
                        selected={(val) => {
                            handleSelect(val)
                        }}
                        default={''}/>

                    <div className={classes.divider}/>
                    <Typography variant="h6" gutterBottom style={{float: 'left'}}>
                        Kontraktorzy
                    </Typography>
                    <IntegrationReactSelect
                        selected={(val) => {
                            handleSelectUsers(val)
                        }}
                        default={''}
                    />

                </DialogContent>
            </Dialog>
        </div>
    );
}

export default FormDialog;