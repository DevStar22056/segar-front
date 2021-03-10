import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import MLink from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import {API, API_URL, APP_URL} from '../../config';
import pulse from "../../pulse";


export default function SignIn() {
    const classes = useStyles();
    const [email, setEmail] = useState('superuser@searger.pl');
    const [password, setPassword] = useState('demo');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        if (e.target.name === 'email') setEmail(e.target.value);
        if (e.target.name === 'password') setPassword(e.target.value);
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        try {
            // Show loading
            const data = {
                email: email,
                password: password,
            };
            setLoading(true);
            /**
             * fetch api for token
             */
            fetch(API_URL + '/login', {
                method: 'POST',
                mode: 'cors',
                cache: 'default',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    // save token
                    if (data.success === true) {
                        let userData = {
                            user_id: data.id,
                            email: data.email,
                            role: data.role,
                            auth_token: data.token,
                            is_active: data.is_active,
                            timestamp: new Date().toString()
                        };
                        setTimeout(() => {
                            setLoading(false);
                            let appState = {
                                isLoggedIn: true,
                                user: userData
                            };
                            localStorage["appState"] = JSON.stringify(appState);
                            window.location = APP_URL;
                        }, 300)
                    } else {
                        // TODO: implement flash messages
                        alert(data.message);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    alert('API Error');
                    setLoading(false);
                });

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        localStorage.removeItem('appState');
        localStorage.removeItem('_base_isAuthenticated');
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    {pulse.text.login}
                </Typography>
                <form onSubmit={(e) => handleFormSubmit(e, email, password)} className={classes.form}>
                    <TextField
                        value={email}
                        onChange={handleChange}
                        variant="outlined"
                        margin="dense"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        style={{marginBottom: 20}}
                    />
                    <TextField
                        value={password}
                        onChange={handleChange}
                        variant="outlined"
                        margin="dense"
                        required
                        fullWidth
                        name="password"
                        label={pulse.text.password}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        inputProps={{minLength: 8}}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {pulse.text.login}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <MLink href={API + '/password/reset'} variant="body2">
                                {pulse.text.lostpass}
                            </MLink>
                        </Grid>
                        <Grid item>
                            <Link to="/register" variant="body2">
                                {pulse.text.registration}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                <div className={classes.linear}>
                    {loading && <LinearProgress/>}
                </div>
            </div>
        </Container>
    );
}

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    linear: {
        flexGrow: 1,
        width: '100%',
        marginTop: 20
    }
}));