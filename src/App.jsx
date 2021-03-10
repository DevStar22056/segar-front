import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import helpers from './helpers';
import Dashboard from './dashboard';
import ButtonAppBar from './components/Header/AppBar';
import Login from './auth/login';
import Register from './auth/register';
import AddInvoice from './invoices/add';
import UserPanel from './userPanel';
import AdminPanel from './adminPanel';
import pulse from './pulse';
import NestedList from './adminPanel/menu';
import './App.css';

const HandleAuth = () => {
    return (pulse) ? pulse.base.isAuthenticated : false;
};

const HandleIsActive = () => {
    return (pulse) ? pulse.user.is_active : false;
};

const ProtectedRoute = ({component: Component, ...rest}) => (
    <Route {...rest} component={(props) => (
        HandleAuth() ? (
            <Component {...props} />
        ) : (
            <Redirect to="/login"/>
        )
    )}/>
);

export default function App() {
    const classes = useStyles();

    return (
        <Router history={helpers.history}>
            <div className={classes.root}>
                <CssBaseline/>
                <ButtonAppBar status={HandleAuth()}/>
                {HandleAuth() && <NestedList/>}

                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <Switch>
                        <Route exact path="/" render={() => (
                            HandleAuth() ? (
                                HandleIsActive() ? (
                                    <Redirect to="/dashboard"/>
                                ) : (
                                    <Redirect to="/profile"/>
                                )
                            ) : (
                                <Login/>
                            )
                        )}/>

                        <Route exact path="/register" render={() => (
                            HandleAuth() ? (
                                <Redirect to="/dashboard"/>
                            ) : (
                                <Register/>
                            )
                        )}/>

                        <Route path="/register/:code" render={(match) => (
                            HandleAuth() ? (
                                <Redirect to="/dashboard"/>
                            ) : (
                                <Register match={match}/>
                            )
                        )}/>

                        <Route exact path="/login" render={() => (
                            HandleAuth() ? (
                                <Redirect to="/dashboard"/>
                            ) : (
                                <Login/>
                            )
                        )}/>

                        /**
                        * Profile
                        */
                        <ProtectedRoute path="/profile" component={UserPanel}/>

                        /**
                        * Dashboard
                        */
                        <ProtectedRoute exact path="/dashboard" component={Dashboard}/>
                        <ProtectedRoute exact path="/dashboard/invoices" component={Dashboard}/>
                        <ProtectedRoute exact path="/dashboard/profile" component={Dashboard}/>
                        <ProtectedRoute exact path="/dashboard/timesheets" component={Dashboard}/>
                        <ProtectedRoute exact path="/dashboard/faq" component={Dashboard}/>

                        /**
                        * Invoice
                        **/
                        <ProtectedRoute exact path="/invoices/show/:id" component={AddInvoice}/>

                        /**
                        * Admin only
                        **/
                        <ProtectedRoute exact path="/admin" component={AdminPanel}/>
                        <ProtectedRoute exact path="/admin/summary" component={AdminPanel}/>
                        <ProtectedRoute exact path="/admin/projects" component={AdminPanel}/>
                        <ProtectedRoute exact path="/admin/users" component={AdminPanel}/>
                        <ProtectedRoute exact path="/admin/invoices" component={AdminPanel}/>
                        <ProtectedRoute exact path="/admin/faq" component={AdminPanel}/>
                        <ProtectedRoute exact path="/admin/contractors" component={AdminPanel}/>
                        <ProtectedRoute exact path="/admin/sellers" component={AdminPanel}/>
                    </Switch>
                </main>
            </div>
        </Router>
    );
}


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 2,
        // marginLeft: -drawerWidth,
        padding: theme.spacing(0),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
}));
