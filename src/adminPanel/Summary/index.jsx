import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import {format} from 'date-fns/esm';
import {Paper} from "@material-ui/core";

export default function Summary(props) {
    const classes = useStyles();
    const source = props.source;
    const [rows, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [empty, setEmpty] = useState(false);
    const status = ['draft', 'in approval', 'rejected', 'approved', 'paid', 'sended'];

    return (
        <div style={{padding: 10}}>
            <Grid container spacing={0}>
                {/*<Grid item xs={6}>*/}
                {/*    <Typography variant="h5" gutterBottom>*/}
                {/*        Podsumowanie*/}
                {/*    </Typography>*/}
                {/*</Grid>*/}
                <Grid item xs={12}>
                    <Paper>
                        <div className={classes.tableWrapper}>
                            <Table className={classes.table} size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Kontraktor</TableCell>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Miesiąc</TableCell>
                                        <TableCell>Miesiąc</TableCell>
                                        <TableCell>NR fv</TableCell>

                                        <TableCell>NR faktury kontraktora (zew)</TableCell>
                                        <TableCell>Liczba godzin
                                            {/*przepracowanych przez kontaktora*/}
                                        </TableCell>

                                        <TableCell>Rate</TableCell>
                                        <TableCell>Netto</TableCell>
                                        <TableCell>Brutto</TableCell>
                                        <TableCell>Projekt</TableCell>
                                        <TableCell>Klient</TableCell>
                                        <TableCell>Nr Fv</TableCell>
                                        <TableCell>Liczba godzin</TableCell>
                                        <TableCell>Final rate</TableCell>
                                        <TableCell>Wartość netto</TableCell>
                                        <TableCell>Wartość brutto</TableCell>
                                        <TableCell>Zysk netto</TableCell>
                                        <TableCell>Marża na godzinę</TableCell>
                                        <TableCell>Marża %</TableCell>
                                        <TableCell>Sprawdzenie</TableCell>
                                        <TableCell>
                                            {/*Uwagi*/}
                                        </TableCell>

                                        {/*<TableCell>Partner Invoice Number</TableCell>*/}
                                        {/*<TableCell>Invoice Description</TableCell>*/}
                                        {/*<TableCell>Hours reported</TableCell>*/}
                                        {/*<TableCell>Net Amount</TableCell>*/}
                                        {/*<TableCell>Gross Amount</TableCell>*/}
                                        {/*<TableCell>Invoice Data</TableCell>*/}
                                        {/*<TableCell>Approval</TableCell>*/}
                                        {/*<TableCell>Expected payment date</TableCell>*/}
                                        {/*<TableCell>Status</TableCell>*/}
                                        {/*<TableCell></TableCell>*/}
                                        {/*{source == 'all' && <></>}*/}
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
                                                    {/*<OptionsMenu id={row.id}/>*/}
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
                </Grid>
            </Grid>
        </div>
    )
}

const useStyles = makeStyles(theme => ({
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
}));
