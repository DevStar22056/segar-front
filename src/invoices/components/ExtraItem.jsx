import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import CheckBox from '@material-ui/icons/CheckBox';
import CheckBoxBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import Fab from '@material-ui/core/Fab';
import pulse from "../../pulse";

const options = [
    'Overtime',
    'On-calls +10%',
    'On-calls +30%',
    'Travels',
    'Other'
];

const ITEM_HEIGHT = 48;

class LongMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            overtime: this.props.overtime,
            oncalls_10: this.props.oncall_10,
            oncalls_30: this.props.oncall_30,
            travels: this.props.travels,
            other: this.props.others
        };
    }

    handleClick = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    handleItemClick = option => {
        // send action to parent component
        const opt = option.toLowerCase();
        this.props.action(opt);
        switch (opt) {
            case 'overtime':
                this.setState({overtime: !this.state.overtime});
                break;
            case 'on-calls +10%':
                //console.log('10');
                this.setState({oncalls_10: !this.state.oncalls_10});
                break;
            case 'on-calls +30%':
                //console.log('30');
                this.setState({oncalls_30: !this.state.oncalls_30});
                break;
            case 'travels':
                this.setState({travels: !this.state.travels});
                break;
            case 'other':
                this.setState({other: !this.state.other});
                break;
        }
        this.handleClose();
    };

    componentDidMount() {
        // console.log(this.props);
    }

    render() {
        const {anchorEl} = this.state;
        const {overtime, oncalls_10, oncalls_30, travels, other} = this.state;
        const open = Boolean(anchorEl);
        const {has_oncall} = this.props;

        return (
            <div style={{float: 'left'}}>
                <Fab
                    onClick={this.handleClick}
                    variant="extended"
                    size="medium"
                    color="primary"
                    aria-label="Add"
                    style={{marginTop: 40, paddingRight: 35}}
                >
                    <AddIcon style={{marginRight: 10}}/> {pulse.text.costs}
                </Fab>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: 300,
                            width: 200,
                            marginLeft: 50,
                            marginTop: 11
                        },
                    }}
                >
                    <MenuItem selected={overtime} onClick={() => this.handleItemClick(options[0])}>
                        {overtime ? (
                            <CheckBox style={{marginRight: 10}}/>
                        ) : (
                            <CheckBoxBlank style={{marginRight: 10}}/>
                        )}
                        {/*{options[0]}*/}
                        {pulse.text.overtime}
                    </MenuItem>
                    {has_oncall[0] === 1 &&
                    <MenuItem selected={oncalls_10} onClick={() => this.handleItemClick(options[1])}>
                        {oncalls_10 ? (
                            <CheckBox style={{marginRight: 10}}/>
                        ) : (
                            <CheckBoxBlank style={{marginRight: 10}}/>
                        )}
                        {/*{options[1]}*/}
                        {pulse.text.oncall_10}
                    </MenuItem>
                    }
                    {has_oncall[1] === 1 &&
                    <MenuItem selected={oncalls_30} onClick={() => this.handleItemClick(options[2])}>
                        {oncalls_30 ? (
                            <CheckBox style={{marginRight: 10}}/>
                        ) : (
                            <CheckBoxBlank style={{marginRight: 10}}/>
                        )}
                        {/*{options[2]}*/}
                        {pulse.text.oncall_30}
                    </MenuItem>
                    }
                    <MenuItem selected={travels} onClick={() => this.handleItemClick(options[3])}>
                        {travels ? (
                            <CheckBox style={{marginRight: 10}}/>
                        ) : (
                            <CheckBoxBlank style={{marginRight: 10}}/>
                        )}
                        {/*{options[3]}*/}
                        {pulse.text.travels}
                    </MenuItem>
                    <MenuItem selected={other} onClick={() => this.handleItemClick(options[4])}>
                        {other ? (
                            <CheckBox style={{marginRight: 10}}/>
                        ) : (
                            <CheckBoxBlank style={{marginRight: 10}}/>
                        )}
                        {/*{options[4]}*/}
                        {pulse.text.others}
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

export default LongMenu;