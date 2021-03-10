import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import SimpleTable from './components/InvoicesTable';
import Typography from "@material-ui/core/Typography";
import NewInvoiceButton from './newInvoiceButton';

class Invoices extends Component {
    render() {
        const newItem = (this.props.newItem !== false);
        const source = (this.props.source) ? this.props.source : 'user';
        return (
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <Typography variant="h5" gutterBottom>
                        Faktury
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    {newItem && (
                        <NewInvoiceButton/>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <SimpleTable source={source}/>
                </Grid>
            </Grid>
        )
    }
}

export default Invoices;