import React, {useEffect} from 'react';
import clsx from 'clsx';
import Select from 'react-select';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import {emphasize} from '@material-ui/core/styles/colorManipulator';
import PropTypes from 'prop-types';
import pulse from '../../pulse';

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

NoOptionsMessage.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
};

function inputComponent({inputRef, ...props}) {
    return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

function Control(props) {
    const {
        children,
        innerProps,
        innerRef,
        selectProps: {classes, TextFieldProps},
    } = props;

    return (
        <TextField
            fullWidth
            placeholder={'Wybierz kontraktorów'}
            InputProps={{
                inputComponent,
                inputProps: {
                    className: classes.input,
                    ref: innerRef,
                    children,
                    ...innerProps,
                },
            }}
            {...TextFieldProps}
        />
    );
}

Control.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    selectProps: PropTypes.object.isRequired,
};

function Option(props) {
    return (
        <MenuItem
            ref={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

Option.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
};

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

Placeholder.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
};

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

SingleValue.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object.isRequired,
};

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

ValueContainer.propTypes = {
    children: PropTypes.node,
    selectProps: PropTypes.object.isRequired,
};

function MultiValue(props) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={clsx(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}

MultiValue.propTypes = {
    children: PropTypes.node,
    isFocused: PropTypes.bool,
    removeProps: PropTypes.object.isRequired,
    selectProps: PropTypes.object.isRequired,
};

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

Menu.propTypes = {
    children: PropTypes.node,
    innerProps: PropTypes.object,
    selectProps: PropTypes.object,
};

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};

function searchInPurchasers(id) {
    return pulse.purchasers.findById(id);
}

function searchInUsers(id) {
    return pulse.users.findById(id);
}

export default function AllUsersSelect(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [multi, setMulti] = React.useState([]);
    const [suggestions, setSuggestions] = React.useState([]);
    const [purchasers, setPurchasers] = React.useState([]);

    const getAllContractors = async () => {
        const contractors = (pulse.users.allUsers.length === 0) ? await pulse.users.getAllUsers() : pulse.users.allUsers;
        const _purchasers = (pulse.purchasers.purchasers.length === 0) ? await pulse.purchasers.getPurchasers() : pulse.purchasers.purchasers;

        formatSuggestions(contractors, 'contractors');
        formatSuggestions(_purchasers, 'purchasers');

        // only if purchasers. are needed
        if (props.purchasers) {
            formatSuggestions(_purchasers, 'purchasers');
        }

        setTimeout(() => {

            const selected_user = searchInPurchasers(props.invoice_contractors) ? searchInPurchasers(props.invoice_contractors) : searchInUsers(props.invoice_contractors);

            if (selected_user) {
                setMulti([
                    {
                        value: selected_user.id,
                        label: selected_user.name + ' ' + selected_user.surname,
                    }
                ])
            }

        }, 1000);

    };

    function formatSuggestions(list, group) {

        const formated = [...new Set(list)].map(item => ({
            ...item,
            value: item.id,
            label: item.name + ' ' + item.surname,
        }));

        // only for selected group
        if (group === 'contractors') {
            setSuggestions(formated);
        }

        if (group === 'purchasers') {
            setPurchasers(formated);
        }
    }

    function handleChangeMulti(value, option) {
        setMulti(value);
        props.selected(value, option);
    }

    const selectStyles = {
        input: base => ({
            ...base,
            color: theme.palette.text.primary,
            '& input': {
                font: 'inherit',
            },
        }),
    };

    const groupedOptions = [
        {
            label: 'Kontraktorzy',
            options: suggestions,
        },
        {
            label: 'Kontrahenci',
            options: purchasers,
        },
    ];

    const groupStyles = {
        borderRadius: '5px',
        background: '#f2fcff',
        zIndex: 99999999,
        position: 'relative',
    };


    const Group = props => (
        <div style={groupStyles}>
            <components.Group {...props} />
        </div>
    );

    useEffect(() => {
        getAllContractors();
    }, [props.invoice_contractors]);

    return (
        <div className={classes.root}>
            <NoSsr>
                <Select
                    disabled={props.disabled}
                    classes={classes}
                    styles={selectStyles}
                    inputId="react-select-multiple"
                    TextFieldProps={{
                        label: props.label,
                        variant: "outlined",
                        margin: 'normal',
                        InputLabelProps: {
                            htmlFor: 'react-select-multiple',
                            shrink: true,
                        },
                        placeholder: 'Wybierz kontraktorów',
                    }}
                    margin='dense'
                    options={groupedOptions}
                    components={Group}
                    value={multi}
                    onChange={handleChangeMulti}
                    // isMulti
                />
            </NoSsr>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        // height: 1910,
        marginTop: 10,
        position: 'relative',
        zIndex: 1111
    },
    input: {
        display: 'flex',
        padding: 0,
        height: 'auto',
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
        padding: 15
    },
    chip: {
        margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: theme.spacing(1, 2),
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 17,
        bottom: 16,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 22,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
        maxHeight: 500,
        overflow: 'auto'
    },
    divider: {
        maxHeight: 100,
    }
}));
