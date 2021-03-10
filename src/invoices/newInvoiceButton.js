import React from "react";
import AddIcon from '@material-ui/icons/Add';
import Fab from "@material-ui/core/Fab";
import pulse from '../pulse';

function NewInvoiceButton() {
    return (
        <Fab onClick={() => pulse.invoices.createDraft()} variant="extended" color="primary"
             aria-label="Add"
             style={{float: '', marginBottom: 30}}>
            <AddIcon style={{marginRight: 10}}/> {pulse.text.invoice.new}
        </Fab>
    )
}

export default NewInvoiceButton;