import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import pulse from "../../pulse";
import {Link} from "react-router-dom";
import LinkLink from "@material-ui/core/Link/Link";
import {API_URL} from "../../config";
import MenuItem from "@material-ui/core/MenuItem";
import {Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
}));


function getInvoiceRendered(id, type = '/html') {
    pulse.invoices.getInvoiceRendered({
        id: id,
        type: type
    }).then((response) => {
            // console.log(response);
            // const url = window.URL.createObjectURL(new Blob([response]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', 'file.pdf');
            // document.body.appendChild(link);
            // link.click();
        }
    )
}

export default function RowDetailsCorrections(props) {
    const classes = useStyles();

    return (
        <div style={{padding: 20}}>
            <Typography variant="h6" style={{marginTop: 50}}>{pulse.text.corrections}</Typography>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">{pulse.text.invoice.description}</TableCell>
                            <TableCell align="right">{pulse.text.correction_reason}</TableCell>
                            <TableCell align="right">&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.items.map(row => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="right">{row.description}</TableCell>
                                <TableCell align="right">{row.correction_description}</TableCell>
                                <TableCell align="right">
                                    <Button component={Link}
                                            to={'/invoices/show/' + row.id}
                                            variant="contained"
                                            color="primary">
                                        {pulse.text.edit}
                                    </Button>
                                    <Button>
                                        <LinkLink style={{color: '#000'}}
                                                  href={`${API_URL}/invoice/` + row.id + '/html/'+localStorage['lang']}>
                                            <MenuItem>HTML</MenuItem>
                                        </LinkLink>
                                    </Button>
                                    <Button>
                                        <LinkLink style={{color: '#000'}}
                                                  href={`${API_URL}/invoice/` + row.id + '/pdf/'+localStorage['lang']}>
                                            <MenuItem>PDF</MenuItem>
                                        </LinkLink>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}
