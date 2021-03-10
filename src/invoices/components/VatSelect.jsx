import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import pulse from "../../pulse";

const styles = theme => ({
    formControl: {
        marginTop: 7,
        width: '100%'
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
});

class VatSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vat: this.props.value,
            name: '',
            labelWidth: 0,
        };
    }

    vatChange = val => {
        this.props.onVatChange(val);
    };

    componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        });
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
        this.vatChange(event.target.value)
    };

    render() {
        const {classes} = this.props;

        return (
            <FormControl disabled={this.props.disabled} variant="outlined" className={classes.formControl}>
                <InputLabel
                    ref={ref => {
                        this.InputLabelRef = ref;
                    }}
                    htmlFor="outlined-vat-simple"
                > VAT
                </InputLabel>
                <Select
                    margin='dense'
                    value={this.state.vat}
                    onChange={this.handleChange}
                    fullWidth={true}
                    input={
                        <OutlinedInput
                            margin="dense"
                            labelWidth={this.state.labelWidth}
                            name="vat"
                            id="outlined-vat-simple"
                        />
                    }
                >
                    <MenuItem value={0.23}>23%</MenuItem>
                    <MenuItem value={0.08}>8%</MenuItem>
                    <MenuItem value={0}>0%</MenuItem>
                    <MenuItem value="nd">{pulse.text.invoice.nd}</MenuItem>
                    <MenuItem value="np">{pulse.text.invoice.np}</MenuItem>
                    <MenuItem value="zw">{pulse.text.invoice.zw}</MenuItem>
                </Select>
            </FormControl>
        );
    }
}

VatSelect.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VatSelect);