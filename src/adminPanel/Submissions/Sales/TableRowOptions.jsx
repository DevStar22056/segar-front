import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import pulse from "../../../pulse";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {Link} from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Edit';
import FlipToBackIcon from '@material-ui/icons/FlipToBack';
import GetAppIcon from '@material-ui/icons/GetApp';
import CodeIcon from '@material-ui/icons/Code';
import {API_URL} from "../../../config";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
}));

// create correction
function createCorrection(id) {
    pulse.invoices.createCorrection({
        creator: pulse.user.id,
        user_id: pulse.user.id,
        correction_id: parseInt(id)
    });
}

export default function TableRowOptions(props) {
    const classes = useStyles();
    const elem = props.el !== undefined ? props.el : false;
    return (
        <div className={'over-helper'}>
            {elem &&
            <React.Fragment>
                <Button style={{marginBottom: 5}} variant="text" color="inherit" size="medium">
                    {pulse.text.selected}: <strong style={{marginLeft: 10}}>{elem.id}</strong>
                </Button>
                <br/>
                <ButtonGroup size="medium" aria-label="small outlined button group">
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={'/invoices/show/' + elem.id}>
                        <DeleteIcon fontSize="small" style={{marginRight: 5}}/>
                        {pulse.text.edit}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        onClick={() => createCorrection(elem.id)}>
                        <FlipToBackIcon fontSize="small" style={{marginRight: 5}}/>
                        {pulse.text.invoice.create_correction}
                    </Button>
                    <Button
                        href={`${API_URL}/invoice/` + elem.id + '/html'}
                        target="_blank"
                        variant="contained"
                        color="primary">
                        <CodeIcon fontSize="small" style={{marginRight: 5}}/>
                        {pulse.text.prev_html}
                    </Button>
                    <Button
                        href={`${API_URL}/invoice/` + elem.id + '/pdf'}
                        variant="contained"
                        color="primary">
                        <GetAppIcon fontSize="small" style={{marginRight: 5}}/>
                        {pulse.text.download_pdf}
                    </Button>
                </ButtonGroup>
            </React.Fragment>
            }
        </div>
    );
}