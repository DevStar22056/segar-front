import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import pulse from "../../pulse";
import {Link} from "react-router-dom";
import {API_URL} from "../../config";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        padding: theme.spacing(2),
        overflowX: 'auto',
    },
    table: {
        // minWidth: 650,
    },
}));


function getInvoiceRendered(id, type = '/html') {
    pulse.invoices.getInvoiceRendered({
        id: id,
        type: type
    }).then((response) => {
            console.log(response);
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
        <div className={classes.root}>
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
                                        style={{marginRight: 10}}
                                        to={'/invoices/show/' + row.id}
                                        variant="contained"
                                        color="primary">
                                    {pulse.text.edit}
                                </Button>
                                {/*<Button>*/}
                                {/*    <LinkLink style={{color: '#000'}}*/}
                                {/*              href={`${API_URL}/invoice/` + row.id + '/html'}>*/}
                                {/*        <MenuItem>HTML</MenuItem>*/}
                                {/*    </LinkLink>*/}
                                {/*</Button>*/}
                                <Button href={`${API_URL}/invoice/` + row.id + '/html'}
                                        variant="contained"
                                        style={{marginRight: 10}}
                                        color="primary">
                                    {pulse.text.prev_html}
                                </Button>
                                <Button href={`${API_URL}/invoice/` + row.id + '/pdf'}
                                        variant="contained"
                                        color="primary">
                                    {pulse.text.download_pdf}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
