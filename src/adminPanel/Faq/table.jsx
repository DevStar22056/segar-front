import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from "@material-ui/core/CircularProgress";
import FullScreenDialog from './editModal';

export default function FaqTable(props) {

    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">Tytuł</TableCell>
                        <TableCell align="right">Opis</TableCell>
                        <TableCell align="right">Akcje</TableCell>
                    </TableRow>
                </TableHead>
                {props.faq.length > 0 ? (
                    <TableBody>
                        {props.faq.map(item => (
                            <TableRow key={item.id}>
                                <TableCell component="th" scope="row">
                                    {item.id}
                                </TableCell>
                                <TableCell align="right">{item.title}</TableCell>
                                <TableCell align="right">{item.description}</TableCell>
                                <TableCell align="right">
                                    <FullScreenDialog faq={item}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                ) : (
                    <TableBody>
                        <TableRow>
                            {props.empty ? (
                                <TableCell align="center" colSpan={10}>
                                    Brak wpisów
                                </TableCell>
                            ) : (
                                <TableCell align="center" colSpan={10}>
                                    <CircularProgress size={18}/>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableBody>
                )}
            </Table>
        </Paper>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    progress: {
        margin: theme.spacing(2),
    },
}));
