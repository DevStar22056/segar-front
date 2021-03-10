import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import pulse from "../../pulse";

export default function LangMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [currentLang, setLang] = React.useState(localStorage['lang']);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleLangSelect(code) {
        handleClose();
        if (localStorage['lang'] !== code) {
            localStorage['lang'] = code;

            if (localStorage['_base_isAuthenticated']) {
                pulse.user.updateLanguage({
                    language: code,
                    id: pulse.user.id
                }).then(
                    res => {
                        // console.log(res)
                        setTimeout(() => {
                            window.location.reload();
                        }, 0);
                    }
                );
            } else {
                setTimeout(() => {
                    window.location.reload();
                }, 0);
            }
        }
    }

    return (
        <div style={{display: 'inline', marginRight: 20}}>
            <Button variant="text" color="inherit" onClick={handleClick}>
                {pulse.text[localStorage['lang']]}
                <ArrowDropDownIcon/>
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={() => handleLangSelect('pl_PL')}>{pulse.text.lang_primary}</MenuItem>
                <MenuItem onClick={() => handleLangSelect('en_GB')}>{pulse.text.lang_secondary}</MenuItem>
            </Menu>
        </div>
    );
}