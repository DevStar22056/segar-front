import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import pulse from "../../pulse";

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        // margin: theme.spacing(),
        minWidth: 120,
        width: '100%'
    },
});

class RejectInvoice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            id: props.invoice.data.id,
            rejection_type: props.invoice.data.rejection_type,
            rejection_description: props.invoice.data.rejection_description,
        };
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleSave = (props) => {
        pulse.invoices.updateInvoice({
            id: parseInt(this.state.id),
            rejection_type: this.state.rejection_type,
            rejection_description: this.state.rejection_description,
            status: 2
        }).then(res => {
            if (res.status === 'success') {
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        });
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                <Button size="large" variant="contained" color="secondary" onClick={this.handleClickOpen}>
                    Odrzuć fakturę
                </Button>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    fullWidth={true}
                    maxWidth='sm'
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>Wybierz powód odrzucenia.</DialogTitle>
                    <DialogContent>
                        <form className={classes.container}>
                            <TextField
                                select
                                // label="Powód"
                                fullWidth
                                className={classes.textField}
                                value={this.state.rejection_type}
                                name="rejection_type"
                                onChange={this.handleChange}
                                SelectProps={{
                                    native: true,
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                margin="dense"
                                variant="outlined"
                            >
                                {/*<option value="" hidden>- wybierz -</option>*/}
                                <option value="Termin świadczenia usług">Termin świadczenia usług</option>
                                <option value="Wartość faktury">Wartość faktury</option>
                                <option value="Brak akceptacji">Brak akceptacji</option>
                                <option value="Błędny timesheet">Błędny timesheet</option>
                                <option value="Inny">Inny</option>
                            </TextField>
                            <TextField
                                label="Opisz problem"
                                style={{margin: '40px 0 0 0'}}
                                fullWidth
                                name="rejection_description"
                                multiline
                                rows={4}
                                rowsMax={4}
                                margin="dense"
                                onChange={this.handleChange}
                                value={this.state.rejection_description}
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="outlined" color="secondary">
                            Anuluj
                        </Button>
                        <Button onClick={this.handleSave} variant="contained" color="primary" autoFocus>
                            Prześlij
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

RejectInvoice.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RejectInvoice);