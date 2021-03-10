import React, {useEffect, useState} from "react";
import 'date-fns';
import plLocale from "date-fns/locale/pl";
import {makeStyles} from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";


function MaterialUIPickers(props) {
    const lastdayOfMonthDate = (y = new Date().getFullYear(), m = new Date().getMonth() + 1) => {
        return (!props.default) ? new Date(y, m, 0) : new Date(props.default);
    };

    const def = (props.default) ? new Date(props.default) : new Date();
    const [selectedDate, setSelectedDate] = React.useState(def);
    const [invoiceDate, setInvoiceDate] = React.useState('');
    const [islastDay, setIsLastDay] = React.useState(props.lastDay);
    const [lastDay, setlastDay] = React.useState(new Date(lastdayOfMonthDate()));

    const [date, changeDate] = useState(new Date());

    const classes = useStyles();

    function handleDateChange(date) {

        if (!islastDay) {
            props.onDateChange(date);
            setSelectedDate(date);
        } else {
            props.onLastDateChange(date);
            setlastDay(date);
        }
    }

    useEffect(() => {

        if (!islastDay) {
            props.onDateChange(selectedDate);
        } else {
            props.onLastDateChange(lastDay);
        }
    }, [selectedDate]);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={plLocale}>
            <KeyboardDatePicker
                autoOk
                fullWidth
                margin="dense"
                // variant="inline"
                inputVariant="outlined"
                // label="With keyboard"
                format="yyyy-MM-dd"
                // orientation="landscape"
                variant="inline"
                value={islastDay ? lastDay : selectedDate}
                // InputAdornmentProps={{position: "start"}}
                onChange={date => handleDateChange(date)}
                disabled={props.disabled}
            />
        </MuiPickersUtilsProvider>
    );
}

const useStyles = makeStyles({
    grid: {
        width: '100%',
    },
});

export default MaterialUIPickers;
