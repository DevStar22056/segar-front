import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import {blue} from '@material-ui/core/colors';
import Fab from "@material-ui/core/Fab";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import pulse from '../../pulse';
import Grid from "@material-ui/core/Grid";
import EnhancedTable from './usersTable';
import helpers from '../../helpers';

function TabContainer({children}) {
    return (
        <Typography component="div" style={{padding: 8 * 3}}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
};

function SimpleDialog(props) {
    const {onClose, selectedValue, ...other} = props;
    const [form, setForm] = useState({
        id: '',
        forename: '',
        surname: '',
        email: ''
    });
    const [contractors, setContractors] = useState([]);

    function handleClose() {
        onClose(selectedValue);
    }

    function handleListItemClick(value) {
        onClose(value);
    }

    const handleSearchInput = event => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    };

    async function handleSearchSubmit(name) {

        let data = [];
        setContractors([]);
        if (name === 'name') {
            if (form.forename.length > 0 || form.surname.length > 0) {
                data = {
                    "forename": form.forename,
                    "surname": form.surname,
                };
            } else {
                alert("Podaj imię lub nazwisko")
            }

        } else if (name === 'email') {
            if (form.email.length > 0) {
                if (helpers.validateEmail(form.email)) {
                    data = {
                        "email": form.email,
                    }
                } else {
                    alert('Zły adres email.')
                }
            } else {
                alert("Podaj email")
            }
        } else {
            if (form.id.length > 0) {
                data = {
                    "id": form.id,
                }
            } else {
                alert("Podaj ID")
            }
        }
        const apiData = await pulse.contractors.findContractor(data);
        setContractors(apiData.data)
    }

    const [value, setValue] = React.useState("one");

    function handleChange(event, newValue) {
        setContractors([]);
        setValue(newValue);
    }

    return (
        <Dialog fullWidth maxWidth="md" onClose={handleClose} aria-labelledby="simple-dialog-title" {...other}>
            {/*<DialogTitle id="simple-dialog-title">Wyszukaj konto</DialogTitle>*/}

            <AppBar position="static">
                <Tabs variant="fullWidth" value={value} onChange={handleChange}>
                    <Tab value="one" label="Imię lub nazwisko" wrapped/>
                    <Tab value="two" label="Email"/>
                    <Tab value="id" label="ID"/>
                </Tabs>
            </AppBar>

            {value === 'one' && (
                <TabContainer>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item sm={4}>
                            <TextField
                                label="Imię"
                                placeholder="Imię"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                name="forename"
                                value={form.forename}
                                onChange={handleSearchInput}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <TextField
                                label="Nazwisko"
                                placeholder="Nazwisko"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                name="surname"
                                value={form.surname}
                                onChange={handleSearchInput}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <Button size={"large"} color="primary" variant="contained"
                                    onClick={() => {
                                        handleSearchSubmit('name')
                                    }}>Szukaj</Button>
                        </Grid>
                    </Grid>
                </TabContainer>
            )}
            {value === 'two' && (
                <TabContainer>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item sm={4}>
                            <TextField
                                label="E-mail"
                                placeholder="E-mail"
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                name="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={handleSearchInput}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <Button size={"large"} color="primary" variant="contained"
                                    onClick={() => {
                                        handleSearchSubmit('email')
                                    }}>Szukaj</Button>
                        </Grid>
                    </Grid>


                </TabContainer>
            )}
            {value === 'id' && (
                <TabContainer>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item sm={4}>
                            <TextField
                                label="ID"
                                placeholder="ID"
                                fullWidth
                                type="number"
                                margin="dense"
                                variant="outlined"
                                name="id"
                                value={form.id}
                                onChange={handleSearchInput}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    min: 0,
                                    max: 99999999
                                }}
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <Button size={"large"} color="primary" variant="contained"
                                    onClick={() => {
                                        handleSearchSubmit('id')
                                    }}>Szukaj</Button>
                        </Grid>
                    </Grid>
                </TabContainer>
            )}

            {contractors.length === 0 && (
                <div className={'shake-move'}
                     style={{paddingLeft: 30, width: '40%', paddingBottom: 20}}>Brak
                    wyników.</div>
            )}

            {contractors.length > 0 && <EnhancedTable contractors={contractors}/>}

        </Dialog>
    );
}

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});


SimpleDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    selectedValue: PropTypes.string,
};

export default function NewUserDialog() {
    const [open, setOpen] = React.useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <div>
            <Fab onClick={handleClickOpen} variant="extended" color="primary"
                 aria-label="Add"
                 style={{float: 'right', marginTop: 0, marginBottom: 30}}>
                <AddIcon style={{marginRight: 10}}/> Dodaj nowego użytkownika
            </Fab>
            <SimpleDialog open={open} onClose={handleClose}/>
        </div>
    );
}