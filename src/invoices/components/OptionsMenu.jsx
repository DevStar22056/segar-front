import React from 'react';
import LinkLink from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from "@material-ui/core/IconButton";
import {Link} from 'react-router-dom';
import {API_URL} from "../../config";
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function OptionsMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <div>
            <IconButton
                aria-label="More"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                autoFocus
                style={{
                    marginRight: 20
                }}
            >
                <MenuItem component={Link} to={'/invoices/show/' + props.id} onClick={handleClose}>Edytuj</MenuItem>
                <LinkLink href={`${API_URL}/invoice/` + props.id + '/html/' + localStorage['lang']}>
                    <MenuItem onClick={handleClose}>HTML</MenuItem>
                </LinkLink>
                <LinkLink href={`${API_URL}/invoice/` + props.id + '/pdf/' + localStorage['lang']}>
                    <MenuItem onClick={handleClose}>PDF</MenuItem>
                </LinkLink> 
            </Menu>
        </div>
    );
}
