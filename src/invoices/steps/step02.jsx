import React, {useEffect, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MaterialUIPickers from "../components/DateSelect";
import ProjectUsers from "../components/ProjectUsers";
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from "@material-ui/core/LinearProgress";
import IconButton from "@material-ui/core/IconButton";
import HelpRounded from '@material-ui/icons/HelpRounded';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import LongMenu from "../components/ExtraItem";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Fab from "@material-ui/core/Fab";
import VatSelect from "../components/VatSelect";
import DeleteIcon from '@material-ui/icons/Delete';
import DropzoneAreaExample from "../components/Dropzone";
import Currency from "../components/Currency";
import Add from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import {format} from 'date-fns/esm'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import pulse from '../../pulse';


export default function Step02(props) {

    const classes = useStyles();
    let {match} = props;
    match = match.params.id;

    let user = pulse.user.userData[0];
    user = user ? user : {};

    const [creator, setCreator] = useState(false);

    let invoice_number = props.invoice_number;
    let internal_invoice_number = props.internal_invoice_number;

    let vendor_name = props.vendor_name;
    let vendor_nip = props.vendor_nip;
    let vendor_address = props.vendor_address;

    let purchaser_name = props.purchaser_name;
    let purchaser_nip = props.purchaser_nip;
    let purchaser_address = props.purchaser_address;

    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(props.disabled);
    const [date_1, setDate1] = useState('');
    const [date_2, setDate2] = useState('');

    const [match_date_1, setMatchDate1] = useState('');
    const [match_date_2, setMatchDate2] = useState('');

    const [has_overtime, setOvertime] = useState(false);
    const [has_oncall_10, setOncall_10] = useState(false);
    const [has_oncall_30, setOncall_30] = useState(false);

    const [has_travel, setTravels] = useState(false);
    const [travels, setTravelsItems] = useState([]);
    const [travelsOriginal, setOriginalTravelsItems] = useState([]);

    const [has_others, setOthers] = useState(false);
    const [others, setOthersItems] = useState([]);
    const [othersOriginal, setOriginalOthersItems] = useState([]);

    // VAT
    const vat_value_profile = (user.vat_value === '23') ? 0.23 : 0;
    const [vat_value, setVat_value] = useState(vat_value_profile);

    // EU vat
    const [eu_vat, setVat] = useState(false);

    function handleEuVat() {
        setVat(!eu_vat);
        setVatValue(0);
    }

    // Invoice description
    const [description, setDescription] = useState('');
    const [remarks, setRemarks] = useState('');
    const [has_remarks, setHasRemarks] = useState(false);

    // currency
    const [currency, setCurrency] = useState('');

    // set currency
    function handleCurrencyChange(val) {
        setCurrency(val);
    }

    const [saving, setSaving] = useState(false);

    // Discount
    const [discount, setDiscount] = useState('');
    const [discount_description, setDiscountDescription] = useState('');
    const [discount_gross, setDiscountGross] = useState('');
    const [discount_vat, setDiscountVat] = useState('');

    // Files
    const [files, setFiles] = useState([]);
    const [filesLength, setFilesLength] = useState(props.filesLength);

    // Regular hours calculate
    const [hours_value, setHoursValue] = useState(0);
    const [hours_value_netto, setNettoValue] = useState(0);
    const [hours_value_gross, setGrossValue] = useState(0);
    const [vat_value_calculated, setVatValue] = useState(0);

    // Overtime calculate
    const [overtime_value, setOvertimeValue] = useState(0);
    const [overtime_value_netto, setOvertimeNetto] = useState(0);
    const [overtime_value_gross, setOvertimeGross] = useState(0);
    const [overtime_value_vat, setOvertimeVat] = useState(0);

    // Oncall calculate
    const [oncall_value_10, setOncallValue_10] = useState(0);
    const [oncall_value_netto_10, setOncallNetto_10] = useState(0);
    const [oncall_value_gross_10, setOncallGross_10] = useState(0);
    const [oncall_value_vat_10, setOncallVat_10] = useState(0);

    const [oncall_value_30, setOncallValue_30] = useState(0);
    const [oncall_value_netto_30, setOncallNetto_30] = useState(0);
    const [oncall_value_gross_30, setOncallGross_30] = useState(0);
    const [oncall_value_vat_30, setOncallVat_30] = useState(0);

    // Fixed price calculate
    // @TODO: default state from state
    const [is_fixed, setFixed] = useState(!!(user.fixed_rate));
    const [fixed_price, setFixedPrice] = useState('');
    const [fixed_price_gross, setFixedPriceGross] = useState(0);
    const [fixed_price_vat, setFixedPriceVat] = useState(0);

    const handleChangeFixedPrice = name => event => {
        setFixed(!is_fixed);

        // reset h value
        // setHoursValue(0);
        // setNettoValue(0);
        // setGrossValue(0);
        // setVatValue(0);

        // reset f value
        // setFixedPrice(0);
        // setFixedPriceGross(0);
        // setFixedPriceVat(0)
    };

    const [invoice_type, setInvoiceType] = useState(props.invoiceType.type);
    const [invoice_type_id, setInvoiceTypeId] = useState(props.invoiceType.id);

    // correction
    const [is_correction, setCorrection] = useState(false);
    const [correction_description, setCorrectionDescription] = useState('');

    // original invoice data
    const [original, setOriginal] = useState(false);

    function handleCorrectionDescription(val) {
        setCorrectionDescription(val.target.value);
    }

    // rates
    const [hour_rate, setHourRate] = useState(user.hourly_rate);
    const [overtime_hour_rate, setOvertimeHourRate] = useState(user.overtime_hour_rate);

    // remove overtime
    function removeOvertime() {
        setOvertime(false);
        setOvertimeValue('');
        setOvertimeNetto('');
        setOvertimeGross('');
        setOvertimeVat('');
    }

    // remove oncall
    function removeOncall_10() {
        setOncall_10(false);
        setOncallValue_10('');
        setOncallNetto_10('');
        setOncallGross_10('');
        setOncallVat_10('');
    }

    function removeOncall_30() {
        setOncall_30(false);
        setOncallValue_30('');
        setOncallNetto_30('');
        setOncallGross_30('');
        setOncallVat_30('');
    }

    // onDateChange
    function onDateChange(val) {
        setDate1(format(val, 'yyyy-MM-dd'));
    }

    // Sell date
    function onLastDateChange(val) {
        setDate2(format(val, 'yyyy-MM-dd'));
    }

    // Description
    function handleDescriptionChange(event) {
        const val = event.target.value;
        setDescription(val);
    }

    // Discount
    function handleDiscountChange(event) {
        const val = event.target.value;
        setDiscount(val);
        calculateDiscountGross(val);
    }

    function calculateDiscountGross(val) {
        // vat
        const discount_vat = parseFloat(val) * 0.23;
        setDiscountVat(discount_vat.toFixed(2));
        // gross
        const gross_val = parseFloat(val) + discount_vat;
        setDiscountGross(gross_val.toFixed(2))
    }

    function handleDiscountDescriptionChange(event) {
        const val = event.target.value;
        setDiscountDescription(val);
    }

    // Remarks
    function handleRemarksChange(event) {
        const val = event.target.value;
        setRemarks(val);
    }

    /**
     *
     * @param value
     */
    // Hours value
    function handleHoursValue(value) {
        const val = (typeof value === 'object') ? value.target.value : value;
        const netto_value = val * hour_rate;
        const vat_value_calculated = netto_value * vat_value;
        const gross_value = netto_value + vat_value_calculated;

        setHoursValue(val);
        setNettoValue(netto_value.toFixed(2));
        setGrossValue(gross_value.toFixed(2));
        setVatValue(vat_value_calculated.toFixed(2));
    }

    /**
     *
     * @param event
     */
    // Overtime
    function handleOvertimeHoursValue(event) {
        const val = event.target.value;
        const netto_value = val * overtime_hour_rate;
        const vat_value_calculated = netto_value * vat_value;
        const gross_value = netto_value + vat_value_calculated;

        setOvertimeValue(val);
        setOvertimeNetto(netto_value.toFixed(2));
        setOvertimeGross(gross_value.toFixed(2));
        setOvertimeVat(vat_value_calculated.toFixed(2))
    }

    /**
     *
     * @param event
     */
    // Oncall
    function handleOnCallValue_10(event) {
        const val = event.target.value;
        let oncall_hour_rate = parseInt(hour_rate);
        const oncall_extra_value = 1.1;
        oncall_hour_rate = (oncall_hour_rate * oncall_extra_value);
        const netto_value = val * oncall_hour_rate;
        const vat_value_calculated = netto_value * vat_value;
        const gross_value = netto_value + vat_value_calculated;
        setOncallValue_10(val);
        setOncallNetto_10(netto_value.toFixed(2));
        setOncallGross_10(gross_value.toFixed(2));
        setOncallVat_10(vat_value_calculated.toFixed(2))
    }

    /**
     *
     * @param event
     */
    function handleOnCallValue_30(event) {
        const val = event.target.value;
        let oncall_hour_rate = parseInt(hour_rate);
        const oncall_extra_value = 1.3;
        oncall_hour_rate = (oncall_hour_rate * oncall_extra_value);
        const netto_value = val * oncall_hour_rate;
        const vat_value_calculated = netto_value * vat_value;
        const gross_value = netto_value + vat_value_calculated;
        setOncallValue_30(val);
        setOncallNetto_30(netto_value.toFixed(2));
        setOncallGross_30(gross_value.toFixed(2));
        setOncallVat_30(vat_value_calculated.toFixed(2))
    }

    /*
    * Travel items
    * */
    function createTravelsItem() {
        setTravelsItems(
            [{value: '', vat: 0.23, gross: '', cost_vat_only: '', description: '', type: 'travel'}]
        );
    }

    function setTravelsItemsCount() {
        setTravelsItems(
            [...travels, {value: '', vat: 0.23, gross: '', cost_vat_only: '', description: '', type: 'travel'}]
        );
    }

    /**
     *
     * @param e
     * @param index
     */
    const setTravelItemValue = (e, index) => {
        travels[index].value = e.target.value;

        // calculate gross
        let value_include_vat = e.target.value * travels[index].vat;

        // if vat field value is text
        if (typeof travels[index].vat === "string") {
            value_include_vat = e.target.value * 0;
        }
        travels[index].cost_vat_only = parseFloat(value_include_vat).toFixed(2);

        value_include_vat = parseFloat(e.target.value) + parseFloat(value_include_vat);
        travels[index].gross = parseFloat(value_include_vat).toFixed(2);

        setTravelsItems([...travels]);
    };

    /**
     *
     * @param val
     * @param index
     */
    const onTravelVatChange = (val, index) => {
        let fixedVal;
        if (val !== 0) {
            if (typeof val === "string") {
                fixedVal = 0;
            } else {
                fixedVal = (val === 0.23) ? 0.23 : 0.08;
            }
        } else {
            fixedVal = 0;
        }

        // calculate gross
        travels[index].vat = fixedVal;
        let value_include_vat = travels[index].value * travels[index].vat;

        travels[index].cost_vat_only = parseFloat(value_include_vat).toFixed(2);
        value_include_vat = parseFloat(travels[index].value) + parseFloat(value_include_vat);

        travels[index].gross = parseFloat(value_include_vat).toFixed(2);

        if (typeof val === "string") {
            if (val === 'nd') travels[index].vat = 'Nie dotyczy';
            if (val === 'np') travels[index].vat = 'Nie podlega';
            if (val === 'zw') travels[index].vat = 'Zwolnienie';
        }
        setTravelsItems([...travels]);
    };

    /**
     *
     * @param e
     * @param index
     */
    const setTravelItemDescription = (e, index) => {
        travels[index].description = e.target.value.replace(/(<([^>]+)>)/ig, "");
        setTravelsItems([...travels]);
    };

    /**
     *
     * @param indexToRemove
     */
    function handleRemoveTravel(indexToRemove) {
        const newTravelsItems = travels.filter((_, index) => index !== indexToRemove);
        setTravelsItems(newTravelsItems);
    }

    /**
     * Others items
     * */

    function createOthersItem() {
        setOthersItems(
            [{value: '', vat: 0.23, gross: '', cost_vat_only: '', description: '', type: 'other'}]
        );
    }

    function setOthersItemsCount() {
        setOthersItems(
            [...others, {value: '', vat: 0.23, gross: '', cost_vat_only: '', description: '', type: 'other'}]
        );
    }

    /**
     *
     * @param e
     * @param index
     */
    const setOtherItemValue = (e, index) => {
        others[index].value = e.target.value;

        // calculate gross
        let value_include_vat = e.target.value * others[index].vat;

        // if vat field value is text
        if (typeof others[index].vat === "string") {
            value_include_vat = 0;
        }
        others[index].cost_vat_only = parseFloat(value_include_vat).toFixed(2);

        value_include_vat = parseFloat(e.target.value) + parseFloat(value_include_vat);
        others[index].gross = parseFloat(value_include_vat).toFixed(2);

        setOthersItems([...others]);
    };

    /**
     *
     * @param val
     * @param index
     */
    const onOtherVatChange = (val, index) => {
        let fixedVal;
        if (val !== 0) {
            if (typeof val === "string") {
                fixedVal = 0;
            } else {
                fixedVal = (val === 0.23) ? 0.23 : 0.08;
            }
        } else {
            fixedVal = 0;
        }

        // calculate gross
        others[index].vat = fixedVal;

        let value_include_vat = others[index].value * others[index].vat;
        others[index].cost_vat_only = parseFloat(value_include_vat).toFixed(2);

        value_include_vat = parseFloat(others[index].value) + parseFloat(value_include_vat);
        others[index].gross = parseFloat(value_include_vat).toFixed(2);

        if (typeof val === "string") {
            if (val === 'nd') others[index].vat = pulse.text.invoice.nd;
            if (val === 'np') others[index].vat = pulse.text.invoice.np;
            if (val === 'zw') others[index].vat = pulse.text.invoice.zw;
        }
        setOthersItems([...others]);
    };

    /**
     *
     * @param e
     * @param index
     */
    const setOtherItemDescription = (e, index) => {
        others[index].description = e.target.value.replace(/(<([^>]+)>)/ig, "");
        setOthersItems([...others]);
    };

    /**
     *
     * @param indexToRemove
     */
    function handleRemoveOther(indexToRemove) {
        const newOthersItems = others.filter((_, index) => index !== indexToRemove);
        setOthersItems(newOthersItems);
    }

    /**
     *
     * @param event
     */
    function fixed_price_change(event) {
        const fixed_price = parseFloat(event.target.value);
        const fixed_price_vat = fixed_price * vat_value;
        setFixedPrice(fixed_price);
        setFixedPriceGross((fixed_price + fixed_price_vat).toFixed(2));
        setFixedPriceVat(fixed_price_vat.toFixed(2));
    }

    // LongMenuHandler
    function longMenuHandler(option) {

        switch (option) {
            case 'overtime':
                setOvertime(!has_overtime);
                break;
            case 'on-calls +10%':
                setOncall_10(!has_oncall_10);
                break;
            case 'on-calls +30%':
                setOncall_30(!has_oncall_30);
                break;
            case 'travels':
                setTravels(!has_travel);
                setTravelsItems([]);

                setTimeout(() => {
                    createTravelsItem();
                }, 100);

                break;
            case 'other':
                setOthers(!has_others);
                setOthersItems([]);

                setTimeout(() => {
                    createOthersItem();
                }, 100);

                break;
        }
    }

    // from:to
    const [vendor, setVendor] = useState(props.vendor);
    const [purchaser, setPurchaser] = useState(props.purchaser);

    /*const [vendor_name, setVendorName] = useState();
    const [vendor_nip, setVendorNip] = useState();
    const [vendor_address, setVendorAddress] = useState();

    const [purchaser_name, setPurchaserName] = useState();
    const [purchaser_nip, setPurchaserNip] = useState();
    const [purchaser_address, setPurchaserAddress] = useState();*/

    // handleSave
    async function handleSave(type) {

        // files check
        if (!is_correction) {
            if (filesLength <= 0) {
                alert('Dodaj pliki (timesheet i potwierdzenia)...');
                return;
            }
        }

        setSaving(true);

        let data = {
            "user_id": user.id,
            "invoice_type": invoice_type,
            "invoice_type_id": invoice_type_id,
            "payment_date": date_2,
            "issue_date": date_1,
            "correction_description": correction_description,
            "completion_date": date_2,
            "description": description,
            "remarks": remarks,
            "eu_vat": eu_vat,
            "vendor": user.id,
            "discount": discount,
            "discount_description": discount_description,
            "discount_gross": discount_gross,
            "discount_vat": discount_vat,
            "hours_value": hours_value,
            "hours_value_netto": hours_value_netto,
            "hours_value_gross": hours_value_gross,
            "hours_value_vat": vat_value_calculated,
            "fixed_price": fixed_price,
            "fixed_price_gross": fixed_price_gross,
            "fixed_price_vat": fixed_price_vat,
            "overtime_value": overtime_value,
            "overtime_value_netto": overtime_value_netto,
            "overtime_value_gross": overtime_value_gross,
            "overtime_value_vat": overtime_value_vat,
            "oncall_value_10": oncall_value_10,
            "oncall_value_netto_10": oncall_value_netto_10,
            "oncall_value_gross_10": oncall_value_gross_10,
            "oncall_value_vat_10": oncall_value_vat_10,
            "oncall_value_30": oncall_value_30,
            "oncall_value_netto_30": oncall_value_netto_30,
            "oncall_value_gross_30": oncall_value_gross_30,
            "oncall_value_vat_30": oncall_value_vat_30,
            "invoice_number": invoice_number,
            'internal_invoice_number' : internal_invoice_number,

            "vendor_nip": vendor_nip,
            "vendor_address" : vendor_address,
            "vendor_name" : vendor_name,

            "purchaser_nip": purchaser_nip,
            "purchaser_address" : purchaser_address,
            "purchaser_name" : purchaser_name,
 
            // "is_accepted": "0",
            "travels": travels,
            "others": others,
            "currency": currency
        };

        if (pulse.user.role === 1) {
            data['vendor'] = vendor;
            data['purchaser'] = purchaser;
        }

        pulse.invoices.updateInvoice({
            id: parseInt(match),
            ...data
        }).then(
            res => {
                if (res.status === 'success') {
                    setTimeout(() => {
                        setSaving(false);
                        window.location.reload();
                    }, 2000);
                }
            }
        );
    }

    function getInvoice(invoice) {
        if (invoice) {

            setCreator(invoice.creator);

            // const item = invoice.data;
            if (invoice.issue_date !== null) {
                setDate1(format(new Date(invoice.issue_date), 'yyyy-MM-dd'));
            }

            if (invoice.completion_date !== null) {
                setDate2(format(new Date(invoice.completion_date), 'yyyy-MM-dd'));
            }

            if (invoice.remarks !== null) {
                setRemarks(invoice.remarks);
            }

            if (invoice.description !== null) {
                setDescription(invoice.description);
            }

            if (invoice.currency !== null) {
                setCurrency(invoice.currency);
            }

            if (invoice.eu_vat !== null) {
                if (invoice.eu_vat === 1) {
                    setVat(true);
                } else {
                    setVat(false);
                }
            }

            if (invoice.is_correction !== null && invoice.is_correction === true) {
                setCorrection(true);
            }

            if (invoice.correction_description !== null) {
                setCorrectionDescription(invoice.correction_description);
            }

            if (invoice.invoice_type !== null) {
                setInvoiceType(invoice.invoice_type);
            }

            if (invoice.invoice_type_id !== null) {
                setInvoiceTypeId(invoice.invoice_type_id);
            }

            if (invoice.discount !== null) {
                setDiscount(invoice.discount);
            }

            // if (invoice.vendor !== null) {
            //     setVendor(invoice.vendor);
            // }
            //
            // if (invoice.purchaser !== null) {
            //     setPurchaser(invoice.purchaser);
            // }

            if (invoice.discount_gross !== null) {
                setDiscountGross(invoice.discount_gross);
            }

            if (invoice.discount_vat !== null) {
                setDiscountVat(invoice.discount_vat);
            }

            if (invoice.discount_description !== null) {
                setDiscountDescription(invoice.discount_description);
            }

            /* NORMAL VALUE */
            if (invoice.hours_value !== null) {
                setHoursValue(invoice.hours_value);
            }

            if (invoice.hours_value_gross !== null) {
                setGrossValue(invoice.hours_value_gross);
            }

            if (invoice.hours_value_netto !== null) {
                setNettoValue(invoice.hours_value_netto);
            }

            if (invoice.hours_value_vat !== null) {
                setVatValue(invoice.hours_value_vat);
            }

            if (invoice.status === 0 || invoice.status === 2) {
                // setDisabled(false);
            } else {
                // setDisabled(true)
            }

            /* NORMAL VALUE */

            /* FIXED */
            if (invoice.fixed_price !== null) {
                setFixed(true);
                setFixedPrice(invoice.fixed_price);
            }

            if (invoice.fixed_price_gross !== null) {
                setFixedPriceGross(invoice.fixed_price_gross);
            }

            if (invoice.fixed_price_vat !== null) {
                setFixedPriceVat(invoice.fixed_price_vat);
            }

            /* FIXED */
            if (invoice.overtime_value >= 1) {
                setOvertime(true);
                setOvertimeValue(invoice.overtime_value);
                setOvertimeNetto(invoice.overtime_value_netto);
                setOvertimeGross(invoice.overtime_value_gross);
                setOvertimeVat(invoice.overtime_value_vat)
            }

            if (invoice.oncall_value_10 >= 1) {
                setOncall_10(true);
                setOncallValue_10(invoice.oncall_value_10);
                setOncallNetto_10(invoice.oncall_value_netto_10);
                setOncallGross_10(invoice.oncall_value_gross_10);
                setOncallVat_10(invoice.oncall_value_vat_10);
            }

            if (invoice.oncall_value_30 >= 1) {
                setOncall_30(true);
                setOncallValue_30(invoice.oncall_value_30);
                setOncallNetto_30(invoice.oncall_value_netto_30);
                setOncallGross_30(invoice.oncall_value_gross_30);
                setOncallVat_30(invoice.oncall_value_vat_30);
            }

            if (invoice.files.length > 0) {
                setFiles(invoice.files);
            }

            if (invoice.original) {
                // console.log(invoice.original)
                setOriginal(invoice.original);

                // extra costs
                if (invoice.original.costs.length > 0) {
                    const _travels = [];
                    const _others = [];
                    invoice.original.costs.map(cost => {
                        if (cost.cost_type === "travel") {
                            if (isNaN(cost.cost_vat)) {
                                cost.cost_vat = 0;
                            }
                            _travels.push({
                                value: cost.cost_value,
                                vat: cost.cost_vat,
                                cost_vat_only: cost.cost_vat_only,
                                gross: cost.cost_vat_value,
                                description: cost.cost_description,
                                type: 'travel'
                            });
                            setTravels(true);
                        } else {
                            if (isNaN(cost.cost_vat)) {
                                cost.cost_vat = 0;
                            }
                            _others.push({
                                value: cost.cost_value,
                                vat: cost.cost_vat,
                                cost_vat_only: cost.cost_vat_only,
                                gross: cost.cost_vat_value,
                                description: cost.cost_description,
                                type: 'other'
                            });
                            setOthers(true);
                        }
                    });
                    // set orig values
                    setOriginalTravelsItems([..._travels]);
                    setOriginalOthersItems([..._others]);
                }

            }

            if (invoice.costs.length > 0) {
                const costs = invoice.costs;
                const _travels = [];
                const _others = [];
                costs.map(cost => {
                    cost.cost_vat = parseFloat(cost.cost_vat);
                    if (cost.cost_type === "travel") {
                        if (isNaN(cost.cost_vat)) {
                            cost.cost_vat = 0;
                        }
                        _travels.push({
                            value: cost.cost_value,
                            vat: cost.cost_vat,
                            cost_vat_only: cost.cost_vat_only,
                            gross: cost.cost_vat_value,
                            description: cost.cost_description,
                            type: 'travel'
                        });
                        setTravels(true);
                    } else {
                        if (isNaN(cost.cost_vat)) {
                            cost.cost_vat = 0;
                        }
                        _others.push({
                            value: cost.cost_value,
                            vat: cost.cost_vat,
                            cost_vat_only: cost.cost_vat_only,
                            gross: cost.cost_vat_value,
                            description: cost.cost_description,
                            type: 'other'
                        });
                        setOthers(true);
                    }
                });
                setTravelsItems([..._travels]);
                setOthersItems([..._others]);
            }

            // show data
            setLoading(false);
        }
    }

    const inputLabel = React.useRef(null);

    useEffect(() => {
        getInvoice(props.invoice.data);

        setVendor(props.vendor);
        setPurchaser(props.purchaser);

        if (!isNaN(parseInt(props.invoiceType.type))) {
            setInvoiceType(props.invoiceType.type);
            setInvoiceTypeId(props.invoiceType.id);
        }

        if (invoice_type === 0) {
            setHourRate(pulse.user.userData[0].hourly_rate);
        } else if (invoice_type === 2) {
            const contractor_id = (props.invoice.data.invoice_type_id === props.invoiceType.id) ? props.invoice.data.invoice_type_id : invoice_type_id;
            if (contractor_id) {
                pulse.users.getUser({
                    id: contractor_id
                }).then(
                    res => res
                ).then(res => {
                    if (res.data) {
                        setHourRate(res.data.internal_hour_rate);
                        setOvertimeHourRate(res.data.internal_overtime_rate);
                    }
                });
            }
        }
        setFilesLength(props.filesLength);
    }, [props, invoice_type]);

    return (
        <div style={{width: '100%'}}>
            <Grid container spacing={2}>
                {/* field */}
                <Grid item xs={12} md={4} lg={2}>
                    <Typography variant="h6" className={classes.h6Title} gutterBottom style={{float: 'left'}}>
                        {/*Issue date*/}
                        {pulse.text.invoice.issue_date}
                    </Typography>
                    <Tooltip
                        className={classes.tooltip}
                        title={
                            <React.Fragment>
                                <Typography color="inherit">Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Mauris vestibulum dolor consequat commodo placerat.
                                    Nulla ultricies, magna eget dapibus feugiat.</Typography>
                            </React.Fragment>
                        }
                        aria-label="Add"
                        placement="top">
                        <IconButton aria-label="Delete">
                            <HelpRounded/>
                        </IconButton>
                    </Tooltip>
                    {date_1 &&
                    <MaterialUIPickers fieldName={'issue_date'}
                                       date={match_date_1}
                                       default={date_1}
                                       disabled={disabled}
                                       onDateChange={(val) => {
                                           onDateChange(val);
                                       }}/>
                    }
                    {is_correction && original && (
                        <TextField
                            disabled
                            hiddenLabel
                            helperText={pulse.text.default_correction_value}
                            defaultValue={format(new Date(original.issue_date), 'yyyy-MM-dd')}
                            className={classes.textField}
                            margin="dense"
                            variant="filled"
                            fullWidth
                        />
                    )}
                </Grid>
                {/* field */}

                {/* field */}
                <Grid item xs={12} md={4} lg={2}>
                    <Typography variant="h6" className={classes.h6Title} gutterBottom style={{float: 'left'}}>
                        {pulse.text.invoice.sell_date}
                    </Typography>
                    <Tooltip
                        className={classes.tooltip}
                        title={
                            <React.Fragment>
                                <Typography color="inherit">Ostatni dzień świadczenia usług</Typography>
                            </React.Fragment>
                        }
                        aria-label="Add"
                        placement="top">
                        <IconButton aria-label="Delete">
                            <HelpRounded/>
                        </IconButton>
                    </Tooltip>
                    {date_2 &&
                    <MaterialUIPickers fieldName={'completion_date'}
                                       date={match_date_2}
                                       lastDay={true}
                                       default={date_2}
                                       disabled={disabled}
                                       onLastDateChange={(val) => {
                                           onLastDateChange(val);
                                       }}/>
                    }
                    {is_correction && original && (
                        <TextField
                            disabled
                            helperText={pulse.text.default_correction_value}
                            defaultValue={format(new Date(original.completion_date), 'yyyy-MM-dd')}
                            className={classes.textField}
                            margin="dense"
                            variant="filled" hiddenLabel
                            fullWidth
                        />
                    )}
                </Grid>
                {/* field */}

                {/* field */}
                <Grid item xs={12} md={4} lg={3}>
                    <Typography variant="h6" className={classes.h6Title} gutterBottom
                                style={{float: 'left'}}>
                        {pulse.text.invoice.invoice_desc}
                    </Typography>
                    <Tooltip
                        className={classes.tooltip}
                        title={
                            <React.Fragment>
                                <Typography color="inherit">Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Mauris vestibulum dolor consequat commodo placerat.
                                    Nulla ultricies, magna eget dapibus feugiat.</Typography>
                            </React.Fragment>
                        }
                        aria-label="Add"
                        placement="top">
                        <IconButton aria-label="Delete">
                            <HelpRounded/>
                        </IconButton>
                    </Tooltip>
                    <TextField
                        disabled={disabled}
                        id="description"
                        label={pulse.text.invoice.invoice_desc}
                        name="description"
                        // helperText={pulse.text.invoice.invoice_desc}
                        variant="outlined"
                        margin="dense"
                        onChange={handleDescriptionChange}
                        value={description}
                        fullWidth
                        // style={{marginTop: 0}}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {is_correction && original && (
                        <TextField
                            disabled
                            helperText={pulse.text.default_correction_value}
                            defaultValue={original.description}
                            className={classes.textField}
                            margin="dense"
                            variant="filled" hiddenLabel
                            fullWidth
                        />
                    )}
                </Grid>
                {/* field */}

                {/* field */}
                <Grid item xs={12} md={3} lg={2}>
                    <Typography variant="h6" className={classes.h6Title} gutterBottom style={{float: 'left'}}>
                        {pulse.text.invoice.currency}
                    </Typography>
                    {currency &&
                    <Currency
                        handleCurrencyChange={(val) => handleCurrencyChange(val)}
                        disabled={disabled}
                        currency={currency}/>}
                    {is_correction && original && (
                        <TextField
                            disabled
                            helperText={pulse.text.default_correction_value}
                            defaultValue={original.currency}
                            className={classes.textField}
                            margin="dense"
                            variant="filled" hiddenLabel
                            fullWidth
                        />
                    )}
                </Grid>
                {pulse.user.role === 1 && (
                    <Grid item xs={12} md={2} xl={3} style={{textAlign: 'right'}}>
                        {/*VAT REVERSE CHARGE <br/>*/}
                        <Typography variant="h6" className={classes.h6Title} gutterBottom style={{float: 'left'}}>
                            EU VAT 0%
                        </Typography>
                        <FormControl component="fieldset" className={classes.formControl}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={disabled}
                                        checked={eu_vat}
                                        onChange={handleEuVat}
                                        value={eu_vat}
                                        color="primary"
                                    />
                                }
                                label="Tak"
                            />
                        </FormControl>
                        {is_correction && original && (
                            <FormControl component="fieldset" className={classes.formControl}>
                                <FormControlLabel
                                    label={pulse.text.default_correction_value}
                                    disabled
                                    control={<Checkbox checked={original.eu_vat} checked={original.eu_vat}/>}
                                />
                            </FormControl>
                        )}

                    </Grid>
                )}
                {/* field */}

                {/* field */}
                {invoice_type == '1' ? (
                    <ProjectUsers
                        invoice_id={parseInt(match)}
                        invoice_type={invoice_type}
                        disabled={disabled}
                        invoice_type_id={invoice_type_id}/>
                ) : (
                    <>
                        {pulse.user.role === 1 && (
                            <Grid item xs={12}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={12}>
                                        <Typography component="div" style={{margin: '16px 0px'}}>
                                            <Paper className={classes.grayPaper}>
                                                <Grid component="label" container alignItems="center" spacing={1}>
                                                    <Grid item><Button disabled>Liczba godzin</Button></Grid>
                                                    <Grid item>
                                                        <Switch
                                                            disabled={disabled}
                                                            checked={is_fixed}
                                                            onChange={handleChangeFixedPrice('is_fixed')}
                                                            value={is_fixed}
                                                            color="primary"
                                                        />
                                                    </Grid>
                                                    <Grid item><Button disabled>Stała stawka</Button></Grid>
                                                </Grid>
                                            </Paper>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        {!is_fixed && (
                            <Grid item xs={12}>
                                <Grid container spacing={2} alignItems="flex-start">
                                    <Grid item xs={12} style={{marginBottom: -10}}>
                                        <Typography variant="h6" className={classes.h6Title} gutterBottom
                                                    style={{float: 'left'}}>
                                            {pulse.text.invoice.hours_value}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={3}>
                                        <TextField
                                            disabled={disabled}
                                            label={pulse.text.invoice.hours_value}
                                            required={true}
                                            name="hours_value"
                                            type="number"
                                            variant="outlined"
                                            margin="dense"
                                            fullWidth={true}
                                            value={hours_value}
                                            onChange={handleHoursValue}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        {is_correction && original && (
                                            <TextField
                                                disabled
                                                helperText={pulse.text.default_correction_value}
                                                defaultValue={original.hours_value}
                                                className={classes.textField}
                                                margin="dense"
                                                variant="filled" hiddenLabel
                                                fullWidth
                                            />
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={3}>
                                        <TextField
                                            id="hours_value_netto"
                                            name="hours_value_netto"
                                            type="number"
                                            disabled
                                            label={pulse.text.invoice.hours_value_netto}
                                            value={hours_value_netto}
                                            className=""
                                            variant="outlined"
                                            margin="dense"
                                            fullWidth={true}
                                            InputProps={{
                                                startAdornment: <InputAdornment
                                                    position="start">{currency}</InputAdornment>,
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        {is_correction && original && (
                                            <TextField
                                                disabled
                                                helperText={pulse.text.default_correction_value}
                                                defaultValue={original.hours_value_netto}
                                                className={classes.textField}
                                                margin="dense"
                                                variant="filled" hiddenLabel
                                                fullWidth
                                            />
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={3}>
                                        <TextField
                                            id="hours_value_gross"
                                            name="hours_value_gross"
                                            type="number"
                                            disabled
                                            label={pulse.text.invoice.hours_value_gross}
                                            value={hours_value_gross}
                                            className={classes.grossValue}
                                            variant="outlined"
                                            margin="dense"
                                            fullWidth={true}
                                            InputProps={{
                                                startAdornment: <InputAdornment
                                                    position="start">{currency}</InputAdornment>
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        {is_correction && original && (
                                            <TextField
                                                disabled
                                                helperText={pulse.text.default_correction_value}
                                                defaultValue={original.hours_value_gross}
                                                className={classes.textField}
                                                margin="dense"
                                                variant="filled" hiddenLabel
                                                fullWidth
                                            />
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4} lg={3}>
                                        <TextField
                                            id="hours_value_vat"
                                            name="hours_value_vat"
                                            type="number"
                                            disabled
                                            label="VAT"
                                            value={vat_value_calculated}
                                            className=""
                                            variant="outlined"
                                            margin="dense"
                                            fullWidth={true}
                                            InputProps={{
                                                startAdornment: <InputAdornment
                                                    position="start">{currency}</InputAdornment>,
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        {is_correction && original && (
                                            <TextField
                                                disabled
                                                helperText={pulse.text.default_correction_value}
                                                defaultValue={original.hours_value_vat}
                                                className={classes.textField}
                                                margin="dense"
                                                variant="filled" hiddenLabel
                                                fullWidth
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </>
                )}

                {/* field */}

                {/* field */}
                {is_fixed && (
                    <Grid item xs={12} style={{marginTop: 0, marginBottom: 0}}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} style={{marginBottom: -10}}>
                                <Typography variant="h6" className={classes.h6Title} gutterBottom
                                            style={{float: 'left'}}>
                                    {pulse.text.invoice.fixed_price}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    disabled={disabled}
                                    id="fixed_priced"
                                    name="fixed_priced"
                                    label={pulse.text.invoice.hours_value_netto}
                                    type="number"
                                    value={fixed_price}
                                    onChange={fixed_price_change}
                                    className=""
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth={true}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                {is_correction && original && (
                                    <TextField
                                        disabled
                                        helperText={pulse.text.default_correction_value}
                                        defaultValue={original.fixed_price}
                                        className={classes.textField}
                                        margin="dense"
                                        variant="filled" hiddenLabel
                                        fullWidth
                                    />
                                )}
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="fixed_price_gross"
                                    name="fixed_price_gross"
                                    type="number"
                                    disabled
                                    label={pulse.text.invoice.hours_value_gross}
                                    value={fixed_price_gross}
                                    className=""
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth={true}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                {is_correction && original && (
                                    <TextField
                                        disabled
                                        helperText={pulse.text.default_correction_value}
                                        defaultValue={original.fixed_price_gross}
                                        className={classes.textField}
                                        margin="dense"
                                        variant="filled" hiddenLabel
                                        fullWidth
                                    />
                                )}
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="fixed_price_vat"
                                    name="fixed_price_vat"
                                    type="number"
                                    disabled
                                    label="VAT"
                                    value={fixed_price_vat}
                                    className=""
                                    variant="outlined"
                                    margin="dense"
                                    fullWidth={true}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,

                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                {is_correction && original && (
                                    <TextField
                                        disabled
                                        helperText={pulse.text.default_correction_value}
                                        defaultValue={original.fixed_price_vat}
                                        className={classes.textField}
                                        margin="dense"
                                        variant="filled" hiddenLabel
                                        fullWidth
                                    />
                                )}
                            </Grid>
                            {/*<Grid item xs={1}>*/}
                            {/*    <Tooltip*/}
                            {/*        classes={{*/}
                            {/*            popper: classes.htmlPopper,*/}
                            {/*            tooltip: classes.htmlTooltip,*/}
                            {/*        }}*/}
                            {/*        title={*/}
                            {/*            <React.Fragment>*/}
                            {/*                <Typography color="inherit">UNIT of measure- Regular HOURS/ monthly*/}
                            {/*                    fixed*/}
                            {/*                    price.*/}
                            {/*                    Kontraktor uzupełnia przepracowane godziny</Typography>*/}
                            {/*            </React.Fragment>*/}
                            {/*        }*/}
                            {/*        aria-label="Add"*/}
                            {/*        placement="top">*/}
                            {/*        <IconButton aria-label="Delete">*/}
                            {/*            <HelpRounded/>*/}
                            {/*        </IconButton>*/}
                            {/*    </Tooltip>*/}
                            {/*</Grid>*/}
                        </Grid>
                    </Grid>
                )}
                {/* field */}

                {is_correction ? (
                    <Grid item xs={12}>
                        <Paper className={classes.grayPaper}>
                            <Typography variant="h6" className={classes.h6Title} gutterBottom style={{float: 'left'}}>
                                {pulse.text.correction_reason}
                            </Typography>
                            <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                <Select
                                    disabled={disabled}
                                    native
                                    value={correction_description}
                                    onChange={(el) => handleCorrectionDescription(el)}
                                    inputProps={{
                                        name: 'correction_description',
                                        id: 'correction_description',
                                    }}>
                                    <option value="0">Błędna stawka</option>
                                    <option value="1">Błędna ilość godzin</option>
                                    <option value="2">Błędna wartość netto</option>
                                    {correction_description !== '0' && correction_description !== '1' && correction_description !== '2' ? (
                                        <option value={correction_description}>Inna</option>
                                    ) : (
                                        <option value="">Inna</option>
                                    )}

                                </Select>

                                {/* TODO: TO DO */}
                                {correction_description !== '0' && correction_description !== '1' && correction_description !== '2' && (
                                    <TextField
                                        disabled={disabled}
                                        style={{marginTop: 20}}
                                        label={pulse.text.correction_reason}
                                        className={classes.textField}
                                        value={correction_description}
                                        onChange={(el) => handleCorrectionDescription(el)}
                                        margin="dense"
                                    />
                                )}

                            </FormControl>

                        </Paper>
                    </Grid>
                ) : (<></>)}

                {(!has_overtime && !has_oncall_10 && !has_oncall_30 && !has_travel && !has_others) ? (
                    <Grid item xs={12}>
                        {!disabled && (
                            <LongMenu overtime={has_overtime}
                                      oncall_10={has_oncall_10}
                                      oncall_30={has_oncall_30}
                                      travels={has_travel}
                                      others={has_others}
                                      action={longMenuHandler}
                                      has_oncall={[user.oncall_10, user.oncall_30]}
                            />
                        )}
                    </Grid>
                ) : (<></>)}

                {(has_overtime || has_oncall_10 || has_oncall_30 || has_travel || has_others) ? (
                    <Grid item xs={12}>
                        {!disabled && (
                            <LongMenu overtime={has_overtime}
                                      oncall_10={has_oncall_10}
                                      oncall_30={has_oncall_30}
                                      travels={has_travel}
                                      others={has_others}
                                      action={longMenuHandler}
                                      has_oncall={[user.oncall_10, user.oncall_30]}/>
                        )}
                    </Grid>
                ) : (<></>)}


                {/* Overtime */}
                {has_overtime && (
                    <Grid item xs={12} style={{marginTop: 30, marginBottom: 0}}>
                        <Paper className={classes.grayPaper}>
                            <Grid container spacing={5} alignItems="center">
                                <Grid item xs={12} style={{marginBottom: -30}}>
                                    <Typography variant="h6" className={classes.h6Title} gutterBottom
                                                style={{float: 'left'}}>
                                        {pulse.text.overtime}
                                    </Typography>
                                </Grid>
                                {/* field */}
                                <Grid item>
                                    <Fab disabled={disabled} onClick={removeOvertime} size="small" color="secondary"
                                         className={classes.button}>
                                        <DeleteIcon/>
                                    </Fab>
                                </Grid>
                                <Grid item md={2} xs={3}>
                                    <TextField
                                        disabled={disabled}
                                        id="overtime_value"
                                        name="overtime_value"
                                        label={pulse.text.invoice.hours_value}
                                        type="number"
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        value={overtime_value}
                                        fullWidth={true}
                                        onChange={handleOvertimeHoursValue}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="overtime_value_netto"
                                        name="overtime_value_netto"
                                        disabled
                                        type="number"
                                        label={pulse.text.invoice.hours_value_netto}
                                        value={overtime_value_netto}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputProps={{
                                            startAdornment: <InputAdornment
                                                position="start">{currency}</InputAdornment>,
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="overtime_value_gross"
                                        name="overtime_value_gross"
                                        disabled
                                        type="number"
                                        label={pulse.text.invoice.hours_value_gross}
                                        value={overtime_value_gross}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputProps={{
                                            startAdornment: <InputAdornment
                                                position="start">{currency}</InputAdornment>,
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="overtime_value_gross"
                                        name="overtime_value_gross"
                                        disabled
                                        type="number"
                                        label="VAT"
                                        value={overtime_value_vat}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputProps={{
                                            startAdornment: <InputAdornment
                                                position="start">{currency}</InputAdornment>,
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )}
                {/* Overtime */}


                {/* on-call 10 */}
                {has_oncall_10 && user.oncall_10 == "1" && (
                    <Grid item xs={12} style={{marginTop: 30, marginBottom: 0}}>
                        <Paper className={classes.grayPaper}>
                            <Grid container spacing={5} alignItems="center">
                                <Grid item xs={12} style={{marginBottom: -30}}>
                                    <Badge color="secondary"
                                           badgeContent={'+10%'}>
                                        <Typography variant="h6" className={classes.h6Title} gutterBottom
                                                    style={{marginRight: 20}}>On-call</Typography>
                                    </Badge>
                                </Grid>
                                {/* field */}
                                <Grid item>
                                    <Fab disabled={disabled} onClick={removeOncall_10} size="small" color="secondary"
                                         className={classes.button}>
                                        <DeleteIcon/>
                                    </Fab>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        disabled={disabled}
                                        id="oncall_value"
                                        name="oncall_value"
                                        label={pulse.text.invoice.hours_value}
                                        type="number"
                                        onChange={handleOnCallValue_10}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        value={oncall_value_10}
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="oncall_value_netto"
                                        name="oncall_value_netto"
                                        disabled
                                        label={pulse.text.invoice.hours_value_netto}
                                        type="number"
                                        value={oncall_value_netto_10}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputProps={{
                                            startAdornment: <InputAdornment
                                                position="start">{currency}</InputAdornment>,
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="oncall_value_gross"
                                        name="oncall_value_gross"
                                        disabled
                                        label={pulse.text.invoice.hours_value_gross}
                                        type="number"
                                        value={oncall_value_gross_10}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputProps={{
                                            startAdornment: <InputAdornment
                                                position="start">{currency}</InputAdornment>,
                                            min: 1
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="oncall_value_vat"
                                        name="oncall_value_vat"
                                        disabled
                                        label="VAT"
                                        value={oncall_value_vat_10}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputProps={{
                                            startAdornment: <InputAdornment
                                                position="start">{currency}</InputAdornment>,
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <Tooltip
                                        classes={{
                                            popper: classes.htmlPopper,
                                            tooltip: classes.htmlTooltip,
                                        }}
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">UNIT of measure- Regular HOURS/
                                                    monthly
                                                    fixed price. Kontraktor uzupełnia przepracowane
                                                    godziny</Typography>
                                            </React.Fragment>
                                        }
                                        aria-label="Add"
                                        placement="top">
                                        <IconButton aria-label="Delete">
                                            <HelpRounded/>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                {/* field */}
                            </Grid>
                        </Paper>
                    </Grid>
                )}
                {/* on-call 10 */}

                {/* on-call 30 */}
                {has_oncall_30 && user.oncall_30 == "1" && (
                    <Grid item xs={12} style={{marginTop: 30, marginBottom: 0}}>
                        <Paper className={classes.grayPaper}>
                            <Grid container spacing={5} alignItems="center">
                                <Grid item xs={12} style={{marginBottom: -30}}>
                                    <Badge color="secondary"
                                           badgeContent={'+30%'}>
                                        <Typography variant="h6" className={classes.h6Title} gutterBottom
                                                    style={{marginRight: 20}}>On-call</Typography>
                                    </Badge>
                                </Grid>
                                {/* field */}
                                <Grid item>
                                    <Fab disabled={disabled} onClick={removeOncall_30} size="small" color="secondary"
                                         className={classes.button}>
                                        <DeleteIcon/>
                                    </Fab>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        disabled={disabled}
                                        id="oncall_value"
                                        name="oncall_value"
                                        label={pulse.text.invoice.hours_value}
                                        type="number"
                                        onChange={handleOnCallValue_30}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        value={oncall_value_30}
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="oncall_value_netto"
                                        name="oncall_value_netto"
                                        disabled
                                        label={pulse.text.invoice.hours_value_netto}
                                        type="number"
                                        value={oncall_value_netto_30}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputProps={{
                                            startAdornment: <InputAdornment
                                                position="start">{currency}</InputAdornment>,
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="oncall_value_gross"
                                        name="oncall_value_gross"
                                        disabled
                                        label={pulse.text.invoice.hours_value_gross}
                                        type="number"
                                        value={oncall_value_gross_30}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputProps={{
                                            startAdornment: <InputAdornment
                                                position="start">{currency}</InputAdornment>,
                                            min: 1
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="oncall_value_vat"
                                        name="oncall_value_vat"
                                        disabled
                                        label="VAT"
                                        value={oncall_value_vat_30}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputProps={{
                                            startAdornment: <InputAdornment
                                                position="start">{currency}</InputAdornment>,
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <Tooltip
                                        classes={{
                                            popper: classes.htmlPopper,
                                            tooltip: classes.htmlTooltip,
                                        }}
                                        title={
                                            <React.Fragment>
                                                <Typography color="inherit">UNIT of measure- Regular HOURS/
                                                    monthly
                                                    fixed price. Kontraktor uzupełnia przepracowane
                                                    godziny</Typography>
                                            </React.Fragment>
                                        }
                                        aria-label="Add"
                                        placement="top">
                                        <IconButton aria-label="Delete">
                                            <HelpRounded/>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                {/* field */}
                            </Grid>
                        </Paper>
                    </Grid>
                )}
                {/* on-call 30 */}

                {/* travel */}
                {has_travel && (
                    <Grid item xs={12} style={{marginTop: 30, marginBottom: 30}}>
                        <Paper className={classes.grayPaper}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} style={{marginBottom: -20}}>
                                    <Typography variant="h6" className={classes.h6Title} gutterBottom
                                                style={{float: 'left'}}>
                                        {pulse.text.invoice.travels}
                                    </Typography>
                                    <Fab size="small"
                                         variant="extended"
                                         disabled={disabled}
                                         style={{
                                             top: -8,
                                             marginLeft: 20,
                                             float: "right"
                                         }}
                                         onClick={setTravelsItemsCount}
                                         color="primary" className={classes.button}>
                                        <Add/> {pulse.text.invoice.travel_add}
                                    </Fab>
                                </Grid>
                                {/* field */}
                                <Paper style={{padding: '10px 0', margin: '10px 0', width: '100%'}}>
                                    {/* possible of items list */}
                                    {travels && travels.map((travel, index) => (
                                        <Grid key={index} container spacing={5} alignItems="center"
                                              style={{paddingLeft: 15}}>
                                            <Grid item xs={3} md={2}>
                                                <TextField
                                                    disabled={disabled}
                                                    label={pulse.text.invoice.value}
                                                    value={travel.value}
                                                    onChange={(e) => {
                                                        setTravelItemValue(e, index)
                                                    }}
                                                    className=""
                                                    type="number"
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth={true}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment
                                                            position="start">{currency}</InputAdornment>,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={3} md={2}>
                                                <VatSelect disabled={disabled} value={travel.vat}
                                                           onVatChange={(val) => {
                                                               onTravelVatChange(val, index)
                                                           }}/>
                                            </Grid>
                                            <Grid item xs={3} md={2}>
                                                <TextField
                                                    disabled
                                                    label={pulse.text.invoice.hours_value_gross}
                                                    value={travel.gross}
                                                    className=""
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth={true}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment
                                                            position="start">{currency}</InputAdornment>,

                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={3} md={2}>
                                                <TextField
                                                    disabled
                                                    label="VAT"
                                                    value={travel.cost_vat_only}
                                                    className=""
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth={true}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment
                                                            position="start">{currency}</InputAdornment>,

                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <TextField
                                                    label={pulse.text.invoice.invoice_desc}
                                                    value={travel.description}
                                                    onChange={(e) => {
                                                        setTravelItemDescription(e, index)
                                                    }}
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth={true}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Fab size="small"
                                                     disabled={disabled}
                                                     color="secondary"
                                                     style={{top: 3}}
                                                     className={classes.button}
                                                     onClick={() => {
                                                         handleRemoveTravel(index)
                                                     }}>
                                                    <DeleteIcon/>
                                                </Fab>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    {/* possible of items list */}

                                    {/* CORRECTION OLD VALS */}
                                    {is_correction && original && (
                                        <Paper className={classes.grayPaper} style={{margin: 10}}>
                                            <Typography variant="h6" className={classes.h6Title}
                                                        className={classes.smallTitle}>
                                                {pulse.text.default_correction_value}
                                            </Typography>

                                            {/* possible of items list */}
                                            {travelsOriginal && travelsOriginal.map((travel, index) => (
                                                <Grid key={index} container spacing={5} alignItems="center">
                                                    <Grid item xs={3} md={2}>
                                                        <TextField
                                                            disabled
                                                            label={pulse.text.invoice.value}
                                                            value={travel.value}
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth={true}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment
                                                                    position="start">{currency}</InputAdornment>,
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3} md={2}>
                                                        <TextField
                                                            disabled
                                                            label="VAT"
                                                            value={travel.vat}
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth={true}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3} md={2}>
                                                        <TextField
                                                            disabled
                                                            label={pulse.text.invoice.hours_value_gross}
                                                            value={travel.gross}
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth={true}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment
                                                                    position="start">{currency}</InputAdornment>,

                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3} md={2}>
                                                        <TextField
                                                            disabled
                                                            label="VAT"
                                                            value={travel.cost_vat_only}
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth={true}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment
                                                                    position="start">{currency}</InputAdornment>,

                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <TextField
                                                            disabled
                                                            label={pulse.text.invoice.invoice_desc}
                                                            value={travel.description}
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth={true}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            ))}
                                            {/* possible of items list */}

                                        </Paper>
                                    )}

                                </Paper>

                                <Grid item xs={12} style={{marginBottom: -20}}>
                                    <Typography variant="h6" className={classes.h6Title} gutterBottom
                                                style={{float: 'left'}}>
                                        {pulse.text.invoice.file_confirmations}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <DropzoneAreaExample
                                        files={files}
                                        type={2}
                                        source_id={match}
                                        source={1}
                                    />
                                </Grid>
                                {/* field */}
                            </Grid>
                        </Paper>
                    </Grid>
                )}
                {/* travel */}

                {/* inne */}
                {has_others && (
                    <Grid item xs={12} style={{marginTop: 30, marginBottom: 30}}>
                        <Paper className={classes.grayPaper}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} style={{marginBottom: -20}}>
                                    <Typography variant="h6" className={classes.h6Title} gutterBottom
                                                style={{float: 'left'}}>
                                        {pulse.text.invoice.other_costs}
                                    </Typography>
                                    <Fab size="small"
                                         disabled={disabled}
                                         variant="extended"
                                         style={{
                                             top: -8,
                                             marginLeft: 20,
                                             float: "right"
                                         }}
                                         onClick={setOthersItemsCount}
                                         color="primary" className={classes.button}>
                                        <Add/> {pulse.text.invoice.add_other_costs}
                                    </Fab>
                                </Grid>
                                {/* field */}
                                <Paper style={{padding: '10px 0', margin: '10px 0', width: '100%'}}>
                                    {/* possible of items list */}
                                    {others && others.map((other, index) => (
                                        <Grid key={index} container spacing={5} alignItems="center"
                                              style={{paddingLeft: 15}}>
                                            <Grid item xs={3} md={2}>
                                                <TextField
                                                    disabled={disabled}
                                                    label={pulse.text.invoice.value}
                                                    value={other.value}
                                                    onChange={(e) => {
                                                        setOtherItemValue(e, index)
                                                    }}
                                                    className=""
                                                    type="number"
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth={true}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment
                                                            position="start">{currency}</InputAdornment>,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={3} md={2}>
                                                <VatSelect disabled={disabled} value={other.vat} onVatChange={(val) => {
                                                    onOtherVatChange(val, index)
                                                }}/>
                                            </Grid>
                                            <Grid item xs={3} md={2}>
                                                <TextField
                                                    disabled
                                                    label={pulse.text.invoice.hours_value_gross}
                                                    value={other.gross}
                                                    className=""
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth={true}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={3} md={2}>
                                                <TextField
                                                    disabled
                                                    label="VAT"
                                                    value={other.cost_vat_only}
                                                    className=""
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth={true}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={2}>
                                                <TextField
                                                    label={pulse.text.invoice.description}
                                                    value={other.description}
                                                    onChange={(e) => {
                                                        setOtherItemDescription(e, index)
                                                    }}
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth={true}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Fab size="small"
                                                     disabled={disabled}
                                                     color="secondary"
                                                     style={{top: 3}}
                                                     className={classes.button}
                                                     onClick={() => {
                                                         handleRemoveOther(index)
                                                     }}>
                                                    <DeleteIcon/>
                                                </Fab>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    {/* possible of items list */}

                                    {/* CORRECTION OLD VALS */}
                                    {is_correction && original && (
                                        <Paper className={classes.grayPaper} style={{margin: 10}}>
                                            <Typography variant="h6" className={classes.h6Title}
                                                        className={classes.smallTitle}>
                                                {pulse.text.default_correction_value}
                                            </Typography>

                                            {/* possible of items list */}
                                            {othersOriginal && othersOriginal.map((other, index) => (
                                                <Grid key={index} container spacing={5} alignItems="center">
                                                    <Grid item xs={3} md={2}>
                                                        <TextField
                                                            disabled
                                                            label={pulse.text.invoice.value}
                                                            value={other.value}
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth={true}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment
                                                                    position="start">{currency}</InputAdornment>,
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3} md={2}>
                                                        <TextField
                                                            disabled
                                                            label="VAT"
                                                            value={other.vat}
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth={true}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3} md={2}>
                                                        <TextField
                                                            disabled
                                                            label={pulse.text.invoice.hours_value_gross}
                                                            value={other.gross}
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth={true}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment
                                                                    position="start">{currency}</InputAdornment>,

                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3} md={2}>
                                                        <TextField
                                                            disabled
                                                            label="VAT"
                                                            value={other.cost_vat_only}
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth={true}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment
                                                                    position="start">{currency}</InputAdornment>,

                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <TextField
                                                            disabled
                                                            label={pulse.text.invoice.invoice_desc}
                                                            value={other.description}
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth={true}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            ))}
                                            {/* possible of items list */}

                                        </Paper>
                                    )}
                                </Paper>

                                <Grid item xs={12} style={{marginBottom: -20}}>
                                    <Typography variant="h6" className={classes.h6Title} gutterBottom
                                                style={{float: 'left'}}>
                                        {pulse.text.invoice.file_confirmations}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <DropzoneAreaExample
                                        files={files}
                                        type={3}
                                        source_id={match}
                                        source={1}/>
                                </Grid>
                                {/* field */}
                            </Grid>
                        </Paper>
                    </Grid>
                )}
                {/* inne */}
            </Grid>

            {/* REMARKS and DISCOUNT */}
            <ExpansionPanel expanded style={{marginTop: 40}}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel0bh-content"
                    id="panel0bh-header">
                    <Typography className={classes.heading}>{pulse.text.invoice.remarks}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container spacing={0}>
                        <Grid item xs={12} style={{marginTop: 0}}>
                            {/*<Typography variant="h6" className={classes.h6Title} gutterBottom style={{float: 'left'}}>*/}
                            {/*    {pulse.text.invoice.remarks}*/}
                            {/*</Typography>*/}
                            <TextField
                                disabled={disabled}
                                id="remarks"
                                label={pulse.text.invoice.remarks}
                                name="remarks"
                                // helperText="Uwagi do faktury"
                                variant="outlined"
                                margin="dense"
                                onChange={handleRemarksChange}
                                value={remarks}
                                fullWidth={true}
                                style={{marginTop: 8}}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {is_correction && original && (
                                <TextField
                                    disabled
                                    helperText={pulse.text.default_correction_value}
                                    defaultValue={original.remarks}
                                    className={classes.textField}
                                    margin="dense"
                                    variant="filled" hiddenLabel
                                    fullWidth
                                />
                            )}
                        </Grid>
                        {pulse.user.role === 1 &&
                        <Grid item xs={12} style={{marginTop: 30}}>
                            {/*<Typography variant="h6" className={classes.h6Title} style={{marginBottom: 25}}*/}
                            {/*            gutterBottom>*/}
                            {/*    {pulse.text.invoice.discount}*/}
                            {/*</Typography>*/}
                            <Grid container spacing={2} alignItems="center" style={{position: 'relative', top: -20}}>
                                <Grid item xs={3}>
                                    <TextField
                                        disabled={disabled}
                                        label={pulse.text.invoice.value}
                                        value={discount}
                                        onChange={(e) => {
                                            handleDiscountChange(e)
                                        }}
                                        className=""
                                        type="number"
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {is_correction && original && (
                                        <TextField
                                            disabled
                                            helperText={pulse.text.default_correction_value}
                                            defaultValue={original.discount}
                                            className={classes.textField}
                                            margin="dense"
                                            variant="filled" hiddenLabel
                                            fullWidth
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        disabled
                                        label={pulse.text.invoice.hours_value_gross}
                                        value={discount_gross}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {is_correction && original && (
                                        <TextField
                                            disabled
                                            helperText={pulse.text.default_correction_value}
                                            defaultValue={original.discount_gross}
                                            className={classes.textField}
                                            margin="dense"
                                            variant="filled" hiddenLabel
                                            fullWidth
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        disabled
                                        label="VAT"
                                        value={discount_vat}
                                        className=""
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {is_correction && original && (
                                        <TextField
                                            disabled
                                            helperText={pulse.text.default_correction_value}
                                            defaultValue={original.discount_vat}
                                            className={classes.textField}
                                            margin="dense"
                                            variant="filled" hiddenLabel
                                            fullWidth
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        label={pulse.text.invoice.description}
                                        value={discount_description}
                                        onChange={(e) => {
                                            handleDiscountDescriptionChange(e)
                                        }}
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    {is_correction && original && (
                                        <TextField
                                            disabled
                                            helperText={pulse.text.default_correction_value}
                                            defaultValue={original.discount_description}
                                            className={classes.textField}
                                            margin="dense"
                                            variant="filled" hiddenLabel
                                            fullWidth
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                        }
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* REMARKS and DISCOUNT */}

            {pulse.user.id === creator ? (
                <Grid item xs={12} style={{marginTop: 50}}>
                    <Button disabled={saving || disabled}
                            fullWidth
                            size="large"
                            onClick={() => handleSave('update')}
                            variant="contained"
                            color="primary">{pulse.text.invoice.update}</Button>
                    {saving && (
                        <div style={{marginTop: 20}}>
                            <Typography>{pulse.text.saving}</Typography>
                            <LinearProgress/>
                        </div>
                    )}
                </Grid>
            ) : (
                <Grid item xs={12} style={{marginTop: 50}}>
                    Brak dostępu...
                </Grid>
            )}


        </div>
    )
}


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        // textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    grayPaper: {
        padding: theme.spacing(1),
        // textAlign: 'center',
        backgroundColor: '#f0f0f0',
        color: theme.palette.text.secondary,
    },
    button: {
        marginTop: theme.spacing(),
        marginBottom: theme.spacing(),
        marginRight: theme.spacing(),
    },
    actionsContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        // backgroundColor: '    #d0d0d0',
        padding: 5,
        borderRadius: 0
    },
    resetContainer: {
        padding: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(),
    },
    rightIcon: {
        marginLeft: theme.spacing(),
    },
    iconSmall: {
        fontSize: 16,
    },
    confirmBtn: {
        color: 'white',
        backgroundColor: 'green',
    },
    grossValue: {
        fontWeight: 'bold'
    },
    chip: {
        margin: 1,
    },
    heading: {
        fontSize: theme.typography.pxToRem(14),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(14),
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: '100%'
    },
    selectEmpty: {
        marginTop: theme.spacing(1),
    },
    h6Title: {
        fontSize: 15
    },
    smallTitle: {
        fontSize: 12,
        marginBottom: 20
    },
    tooltip: {
        padding: 0,
        top: -7,
        marginLeft: 10
    },
}));