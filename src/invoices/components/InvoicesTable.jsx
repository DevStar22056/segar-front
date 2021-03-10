import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import pulse from '../../pulse';
import {format} from 'date-fns/esm'
import OptionsMenu from './OptionsMenu';

/*
 draft 0
- in approval 1
- rejected 2
- approved (waiting for the payment) 3
- paid 4
- sended 5
 */


function SimpleTable(props) {
    const {classes} = props;
    const source = props.source;
    const [rows, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [empty, setEmpty] = useState(false);
    const status = ['draft', 'in approval', 'rejected', 'approved', 'paid', 'sended'];

    // console.log(source);

    async function getInvoices() {

        let invoices = [];
        if (source === "all") {
            invoices = await pulse.invoices.getAllInvoices();
        } else {
            invoices = await pulse.invoices.getMyInvoices();
        }

        // invoices data
        setData(invoices);

        // loading
        setLoading(false);
        if (invoices.data.length === 0) {
            setEmpty(true);
        }
    }

    useEffect(() => {
        getInvoices();
    }, [getInvoices]);

    return (
        <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Seargin Invoice number</TableCell>
                            <TableCell>Partner Invoice Number</TableCell>
                            <TableCell>Invoice Description</TableCell>
                            <TableCell>Hours reported</TableCell>
                            <TableCell>Net Amount</TableCell>
                            <TableCell>Gross Amount</TableCell>
                            <TableCell>Invoice Data</TableCell>
                            <TableCell>Approval</TableCell>
                            <TableCell>Expected payment date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
                            {source == 'all' && <></>}
                        </TableRow>
                    </TableHead>

                    {loading ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={11} style={{textAlign: 'center'}}>
                                    <CircularProgress size={18}/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {rows && rows.data.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.internal_invoice_number}
                                    </TableCell>
                                    <TableCell align="right">{row.invoice_number}</TableCell>
                                    <TableCell align="right">{row.description}</TableCell>
                                    <TableCell align="right">{row.hours_value}</TableCell>
                                    <TableCell align="right">{row.hours_value_netto}</TableCell>
                                    <TableCell align="right">{row.hours_value_gross}</TableCell>
                                    <TableCell
                                        align="right">{format(new Date(row.issue_date), 'yyyy-MM-dd')}</TableCell>
                                    <TableCell align="right">{row.approval}</TableCell>
                                    <TableCell
                                        align="right">{format(new Date(row.payment_date), 'yyyy-MM-dd')}</TableCell>
                                    <TableCell align="right">{status[row.status]}</TableCell>
                                    <TableCell align="right">
                                        <OptionsMenu id={row.id}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {rows.length === 0 && (
                                <TableRow key={0}>
                                    <TableCell colSpan={11} style={{textAlign: 'center'}}> <CircularProgress
                                        size={18}/></TableCell>
                                </TableRow>
                            )}
                            {empty && (
                                <TableRow key={0}>
                                    <TableCell colSpan={11} style={{textAlign: 'center'}}>
                                        Brak faktur
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    )}


                </Table>
            </div>
        </Paper>
    );
}


const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
        fontSize: 10
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});


SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);