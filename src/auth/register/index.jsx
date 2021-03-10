import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/ArrowBack';
import {API_URL} from '../../config';
import ReactPasswordStrength from 'react-password-strength';
import FormHelperText from '@material-ui/core/FormHelperText';
import helpers from '../../helpers';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import pulse from "../../pulse";

function getSteps() {
    return ['Details', 'Verification'];
}

function TextMaskCustom(props) {
    const {inputRef, ...other} = props;
    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
            showMask
        />
    );
}

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            email: '',
            password: '',
            phone: '',
            sms: '',
            isLoading: false,
            emailError: true,
            passwordError: true,
            phoneError: true,
            open: false,
            code: Math.floor(Math.random() * (65535 - 0 + 1)) + 65535,
            mask: '___-___-___',
            passLength: 0,
            nextStepDisabled: true,
            isSMSVerified: true,
            is_email_verified: false,
            success: false
        };
    }

    /**
     * Stepper
     */

    handleNext = () => {
        if (this.state.emailError === false && this.state.passwordError === false && this.state.passLength !== 0 && this.state.phoneError === false) {
            this.setState(state => ({
                activeStep: state.activeStep + 1,
            }));
            // SMS
            if (this.state.phoneError === false && helpers.validatePhone(this.state.phone)) {
                this.sendSms(this.state.phone);
            }
        }
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    sendSms = (phone) => {
        const phone_string = '48' + phone.replace(/-/g, '');
        try {
            fetch(API_URL + '/register/sms', {
                method: 'POST',
                mode: 'cors',
                cache: 'default',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    phone: phone_string
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.code == 201) {

                    } else if (data.code == 400) {
                        alert('Błąd SMS - API - zły numer!')
                    }
                });
            /**
             * returns
             * id
             * code
             * phone_number
             */
        } catch (err) {
            console.error(err);
        }
    };

    checkSMSCode = (e) => {
        //http://127.0.0.1:8000/api/register/validatesms
        e.preventDefault();
        const phone_string = '48' + this.state.phone.replace(/-/g, '');
        try {
            fetch(API_URL + '/register/validatesms', {
                method: 'POST',
                mode: 'cors',
                cache: 'default',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({
                    code: this.state.sms,
                    phone: phone_string
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data.code);
                    if (data.code === 404 || data.code === 400) {
                        this.setState({isSMSVerified: true});
                        alert('Błędny KOD!')
                    } else if (data.code === 408) {
                        this.setState({isSMSVerified: true});
                        alert('KOD wygasł!')
                    } else {
                        this.setState({isSMSVerified: false});
                    }

                })
                .catch(err => {
                    // console.log(err)
                    // alert('API Error')
                });

            /**
             * returns
             * id
             * code
             * phone_number
             */
        } catch (err) {
            console.error(err);
        }
        /*
         * example response - HTTP/1.1 204
         * 204 - OK
         * 404 - wrong code
         * 408 - expired code
         */
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    passwordCheck = state => {
        this.setState({
            passLength: state.password.length,
            passwordError: !state.isValid,
            password: state.password
        });
        // this.nextStepChecker();
    };

    handleChange = e => {
        console.log(e.target.value);
        this.setState({
            [e.target.id]: e.target.value
        });
        if (e.target.id === 'email') {
            if (helpers.validateEmail(e.target.value)) {
                this.setState({emailError: false})
            } else {
                this.setState({emailError: true})
            }
        }
        // this.nextStepChecker();
    };

    handleMaskChange = name => event => {
        this.setState({
            [name]: event.target.value,
            phone: event.target.value,
        });
        this.setState({phoneError: !helpers.validatePhone(event.target.value)});
        // this.nextStepChecker();
    };

    // nextStepChecker = () => {
    //     if (this.state.emailError === false && this.state.passwordError === false && this.state.passLength !== 0 && this.state.phoneError === false) {
    //         this.setState({nextStepDisabled: false})
    //     } else {
    //         this.setState({nextStepDisabled: true})
    //     }
    //     console.log(this.state);
    //     console.log(this.state.nextStepDisabled);
    // };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            open: false
        });
    };

    handleEmailVerification = e => {
        // form data
        const data = {
            email: this.state.email,
        };
        try {
            fetch(API_URL + '/register/email', {
                method: 'POST',
                mode: 'cors',
                cache: 'default',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
                .then(response => {
                    return response.json()
                })
                .then(response => {
                    if (response) {
                        if (response.success) {
                            this.setState({
                                is_email_verified: true
                            });
                            // this.nextStepChecker();
                        } else {
                            this.setState({
                                is_email_verified: false,
                                open: true
                            });
                        }
                    }
                })
                .catch(err => {
                    if (err) {
                        this.setState({
                            is_email_verified: false,
                            open: true
                        });
                    }
                });
        } catch (err) {
            console.error(err);
        }
    };

    handleRegistration = (e) => {
        if (this.state.email.length > 0 && this.state.password.length > 0 && helpers.validateEmail(this.state.email)) {

            // form data
            const data = {
                email: this.state.email,
                password: this.state.password,
                phone: this.state.phone,
                code: this.state.code
            };
            try {
                /**
                 * fetch api for token
                 */
                fetch(API_URL + '/register', {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'default',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        if (data.success === true) {
                            this.setState({
                                success: true,
                                password: '',
                                phone: '',
                                code: ''
                            })
                        } else {
                        }
                    });

            } catch (err) {
                console.error(err);
            }
        }
    };

    render() {

        const {classes} = this.props;
        const steps = getSteps();
        const {isSMSVerified} = this.state;
        const {activeStep} = this.state;
        const {password} = this.state;
        const {mask} = this.state;
        const {phone} = this.state;
        const {open} = this.state;
        const {success} = this.state;
        const {nextStepDisabled} = this.state;
        const inputProps = {
            placeholder: "Password *",
            autoFocus: false,
            className: 'another-input-prop-class-name',
        };

        const {is_email_verified} = this.state;

        return (
            <div className={classes.root}>
                <div className={classes.root}>
                    {this.state.code && !success ? (
                        <Grid style={{maxWidth: 500, marginLeft: 'auto', marginRight: 'auto'}} container spacing={0}>
                            <Grid xs={12} item>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map(label => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Grid>
                        </Grid>
                    ) : ('')}
                    <div>
                        {this.state.activeStep === 0 ? (
                            <Paper className={classes.paper}>
                                <Grid container spacing={5}>
                                    <Grid item container direction="column">
                                        {this.state.code && !success ? (
                                            <div>
                                                <Grid style={{paddingBottom: 30}} item>
                                                    <h1 style={{
                                                        marginTop: 0,
                                                        marginBottom: 40
                                                    }}>{pulse.text.register.title}</h1>
                                                    <hr/>
                                                </Grid>

                                                <Grid item>
                                                    <InputLabel htmlFor="email">Email</InputLabel>
                                                    <TextField
                                                        required={true}
                                                        error={this.state.emailError}
                                                        id="email"
                                                        className={classes.textField}
                                                        type="email"
                                                        placeholder="E-mail *"
                                                        value={this.state.email}
                                                        onChange={(e) => {
                                                            this.handleChange(e)
                                                        }}
                                                        margin="dense"
                                                        variant="outlined"
                                                        autoFocus={true}
                                                    />
                                                    {this.state.emailError &&
                                                    <FormHelperText
                                                        id="component-error-text">{pulse.text.register.wrong_email}</FormHelperText>
                                                    }
                                                    {!is_email_verified && (
                                                        <Grid style={{marginTop: 20}} item>
                                                            <div className={classes.wrapper}>
                                                                <Button
                                                                    disabled={this.state.emailError}
                                                                    className={classes.button}
                                                                    size={"medium"}
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={this.handleEmailVerification}>
                                                                    {pulse.text.register.verify_email}
                                                                </Button>
                                                            </div>
                                                            <Snackbar
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'left',
                                                                }}
                                                                open={this.state.open}
                                                                autoHideDuration={6000}
                                                                onClose={this.handleClose}
                                                                ContentProps={{
                                                                    'aria-describedby': 'message-id',
                                                                }}
                                                                message={<span
                                                                    id="message-id">{pulse.text.register.wrong_email}</span>}
                                                                action={[
                                                                    <IconButton
                                                                        key="close"
                                                                        aria-label="Close"
                                                                        color="inherit"
                                                                        className={classes.close}
                                                                        onClick={this.handleClose}
                                                                    >
                                                                        <CloseIcon/>
                                                                    </IconButton>,
                                                                ]}
                                                            />
                                                        </Grid>
                                                    )}
                                                </Grid>
                                                {is_email_verified && (
                                                    <div>
                                                        <Grid item>
                                                            <InputLabel style={{marginTop: 15, display: 'block'}}
                                                                        htmlFor="password">{pulse.text.password}</InputLabel>
                                                            <div style={{marginTop: 15}}>
                                                                <ReactPasswordStrength
                                                                    className={classes.formControlPassword}
                                                                    minScore={4}
                                                                    minLength={8}
                                                                    tooShortWord={'Min 8 char.'}
                                                                    scoreWords={['Week', 'Week', 'Week', 'Week', 'Strong']}
                                                                    inputProps={{
                                                                        ...inputProps,
                                                                        id: "password",
                                                                        name: "password",
                                                                        autoComplete: "off",
                                                                        className: classes.formPassword,
                                                                    }}
                                                                    defaultValue={password}
                                                                    changeCallback={this.passwordCheck}
                                                                />
                                                            </div>
                                                        </Grid>

                                                        <Grid item>
                                                            <InputLabel style={{marginTop: 15, display: 'block'}}
                                                                        htmlFor="phone">{pulse.text.phone}</InputLabel>
                                                            <FormControl className={classes.formControl}>
                                                                <TextField
                                                                    error={this.state.phoneError}
                                                                    id="phone"
                                                                    name="phone"
                                                                    className={classes.textField}
                                                                    type="tel"
                                                                    placeholder={mask}
                                                                    value={phone}
                                                                    onChange={this.handleMaskChange('textmask')}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    required
                                                                    InputProps={{
                                                                        inputComponent: TextMaskCustom,
                                                                        startAdornment: <InputAdornment
                                                                            position="start">+48</InputAdornment>,
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        {!this.state.emailError && !this.state.passwordError && this.state.passLength !== 0 && !this.state.phoneError ? (
                                                            <Grid style={{marginTop: 40}} item>
                                                                <div className={classes.wrapper}>
                                                                    <Button
                                                                        className={classes.button}
                                                                        size={"medium"}
                                                                        variant="contained"
                                                                        color="primary"
                                                                        onClick={this.handleNext}>
                                                                        {pulse.text.register.next}
                                                                    </Button>
                                                                </div>
                                                            </Grid>
                                                        ) : (<></>)}

                                                    </div>
                                                )}

                                            </div>
                                        ) : (<></>)}
                                    </Grid>
                                </Grid>
                            </Paper>
                        ) : (
                            <Paper className={classes.paper}>
                                <Grid container spacing={5}>

                                    {this.state.code ? (
                                        <Grid item container direction="row" alignContent="center"
                                              alignItems="center">
                                            <Grid xs={12} item>
                                                <h1>{pulse.text.register.verification}</h1>
                                                <Typography
                                                    style={{marginBottom: 15}}>{pulse.text.register.sms_code_type}</Typography>
                                            </Grid>
                                            <Grid xs={8} item style={{paddingRight: 20}}>
                                                <TextField
                                                    error={this.state.smsCode}
                                                    id="sms"
                                                    label={pulse.text.register.sms_code}
                                                    className={classes.textField}
                                                    type="text"
                                                    placeholder={pulse.text.register.sms_code}
                                                    value={this.state.sms}
                                                    onChange={this.handleChange}
                                                    margin="dense"
                                                    variant="outlined"
                                                    required
                                                />
                                            </Grid>
                                            <Grid xs={4} item>
                                                <Button type="submit"
                                                        color="primary"
                                                        size="medium"
                                                        onClick={this.checkSMSCode}
                                                        variant="contained">
                                                    {pulse.text.register.check_sms_code}
                                                </Button>
                                            </Grid>
                                            <Grid xs={12} item>
                                                <div className={classes.wrapper}>
                                                    <Button disabled={isSMSVerified}
                                                            color="primary"
                                                            size="large"
                                                            variant="contained"
                                                            onClick={this.handleRegistration}
                                                            className={classes.button}>
                                                        {pulse.text.register.title}
                                                    </Button>
                                                    {this.state.isLoading &&
                                                    <CircularProgress size={24}
                                                                      className={classes.buttonProgress}/>}
                                                </div>
                                                <Button
                                                    style={{marginTop: 40}}
                                                    disabled={activeStep === 0}
                                                    onClick={this.handleBack}
                                                    variant="contained"
                                                    className={classes.backButton}>
                                                    <AccountCircle/> Back
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <>
                                            <Typography variant={"h5"}
                                                        style={{marginBottom: 15}}>{pulse.text.register.acc_created}</Typography>
                                            {/*<p>Na adres email: <strong>{this.state.email}</strong> - otrzymasz*/}
                                            {/*    informacje o statusie konta.</p>*/}
                                        </>
                                    )}

                                </Grid>
                            </Paper>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    wrapper: {
        marginTop: 20,
        position: 'relative',
    },
    button: {
        margin: 0,
        width: '100%',
        fontSize: 20,
        backgroundColor: '#1e69b8'
    },
    buttonProgress: {
        color: 'green',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    textField: {
        width: '100%',
        fontWeight: 'bold',
        fontSize: 21
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
    paper: {
        padding: theme.spacing(4),
        margin: '50px auto',
        maxWidth: 500,
    },
    backButton: {
        marginRight: theme.spacing(),
    },
    instructions: {
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(),
    },
    formControl: {
        width: '100%',
    },
    formPassword: {
        marginTop: 1,
        marginLeft: 1
    },
    formControlPassword: {
        borderRadius: 4,
        fontSize: 15
    }
});

Register.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
// export default Login;