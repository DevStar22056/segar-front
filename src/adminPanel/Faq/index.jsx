import React, {useEffect, useState} from 'react'
import FaqTable from './table'
import pulse from '../../pulse';
import Grid from "@material-ui/core/Grid";
import SimpleDialogDemo from './newItem';

const FaqManager = () => {

    const [faq, setFaq] = useState([]);
    const [empty, setEmpty] = useState(false);

    async function fetchFaq() {
        await pulse.faq.getFaqItems()
            .then(res => {
                setFaq(res);
                if (!res.length) {
                    setEmpty(true);
                }
            });
        return;
    }

    useEffect(() => {
        fetchFaq();
    }, []);

    return (
        <div style={{padding: 10}}>
            <Grid container spacing={0} className="container">
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                    <SimpleDialogDemo/>
                </Grid>
                <Grid item xs={12}>
                    <FaqTable empty={empty} faq={faq}/>
                </Grid>
            </Grid>
        </div>
    )
};

export default FaqManager
