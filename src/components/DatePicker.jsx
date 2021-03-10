import React, {Fragment, useEffect, useState} from "react";
import plLocale from "date-fns/locale/pl";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {format} from "date-fns/esm";


function InlineDatePickerDemo(props) {
    const initDate = props.default ? new Date(props.default) : new Date();
    const [selectedDate, handleDateChange] = useState(initDate);

    useEffect(() => {
        props.selected(format(new Date(selectedDate), 'yyyy-MM-dd'));
    }, [selectedDate]);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={plLocale}>
            <Fragment>
                <KeyboardDatePicker
                    autoOk
                    fullWidth
                    variant="inline"
                    inputVariant="outlined"
                    label={props.label? props.label: 'Data'}
                    format="yyyy-MM-dd"
                    value={selectedDate}
                    InputAdornmentProps={{position: "start"}}
                    onChange={(date) => handleDateChange(date)}
                />
            </Fragment>
        </MuiPickersUtilsProvider>
    );
}

export default InlineDatePickerDemo;