import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import pulse from '../pulse';

const styles = theme => ({
    root: {
        // width: '100%',
        // marginTop: theme.spacing(3),
        // overflowX: 'auto',
        marginLeft: 10
    },
    table: {
        // minWidth: 700,
    },
});

function SimpleTable(props) {
    const {classes} = props;
    const [device, setDevice] = React.useState({
        user_id: props.user_id,
        device_name: '',
        device_id: ''
    });
    const [devices, setDevices] = React.useState(props.devices);

    const handleChange = event => {
        setDevice({
            ...device,
            [event.target.name]: event.target.value
        });
    };

    const handleSave = () => {
        if (device.device_name.length > 0 && device.device_id.length > 0) {
            pulse.devices.createDevice({
                ...device
            }).then(res => {
                device['id'] = res;
                setDevices([...devices, device]);
                setDevice({
                    user_id: props.user_id,
                    device_name: '',
                    device_id: '',
                })
            });
        } else {
            alert('Uzupełnij nazwę i id sprzętu');
        }
    };

    const handleRemove = id => {
        pulse.devices.deleteDevice({
            id: id
        });
        setDevices(devices.filter(devices => devices.id !== id))
    };

    return (
        <>
            <Grid item xs={6}>
                <Paper className={classes.root}>
                    {devices.length > 0 ? (
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Nazwa sprzętu</TableCell>
                                    <TableCell>Numer ID</TableCell>
                                    <TableCell>Akcje</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {devices.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.device_name}</TableCell>
                                        <TableCell>{row.device_id}</TableCell>
                                        <TableCell align="right">
                                            <Button onClick={id => {
                                                handleRemove(row.id)
                                            }} variant="outlined"
                                                    color="secondary">
                                                Usuń
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (<div style={{padding: 20}}>Brak urzadzen</div>)}
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Typography
                    variant="h6"
                    style={{marginLeft: 10, marginBottom: -10, marginTop: 30}}>Dodaj nowy
                    przedmiot</Typography>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Nazwa sprzętu"
                    placeholder="Nazwa sprzętu"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    name="device_name"
                    value={device.device_name}
                    onChange={handleChange}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="ID sprzętu"
                    placeholder="ID sprzętu"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    name="device_id"
                    value={device.device_id}
                    onChange={handleChange}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>
            <Grid item xs={4}>
                <Button variant="contained"
                        color="primary"
                        margin="dense"
                        size="large"
                        onClick={handleSave}
                        style={{marginTop: 12}}
                        className={classes.button}>
                    Dodaj przedmiot
                </Button>
            </Grid>
        </>
    );
}

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);