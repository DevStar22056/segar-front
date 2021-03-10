import React from 'react';
import Button from '@material-ui/core/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import pulse from "../../pulse";
import {API_URL} from "../../config";
import LinkLink from "@material-ui/core/Link/Link";

export default function DownloadInvoice(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    //console.log(props);

    return (
        <div style={{textAlign: 'right'}}>
            <Button variant="contained" color="primary" onClick={handleClick}>
                <MoreVertIcon style={{marginRight: 10}}/>
                {pulse.text.preview}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <LinkLink target="_blank" href={`${API_URL}/invoice/` + props.id + '/html'}>
                    <MenuItem onClick={handleClose}>HTML - PL</MenuItem>
                </LinkLink>

                <LinkLink target="_blank" href={`${API_URL}/invoice/` + props.id + '/html/en_GB'}>
                    <MenuItem onClick={handleClose}>HTML - EN</MenuItem>
                </LinkLink>

                <LinkLink target="_blank" href={`${API_URL}/invoice/` + props.id + '/pdf'}>
                    <MenuItem onClick={handleClose}>PDF - PL</MenuItem>
                </LinkLink>
                <LinkLink target="_blank" href={`${API_URL}/invoice/` + props.id + '/pdf/en_GB'}>
                    <MenuItem onClick={handleClose}>PDF - EN</MenuItem>
                </LinkLink>

            </Menu>
        </div>
    );
}