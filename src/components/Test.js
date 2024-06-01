import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Button, Modal, Box, Typography, ToggleButtonGroup, ToggleButton, TextField, MenuItem, Select } from '@mui/material'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { FloatButton, notification, Space } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined, FileTextOutlined } from '@ant-design/icons';
import { Avatar, Card, List, Skeleton } from 'antd';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import '../styles/Trip.css';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
const port = "http://localhost:3100"
const { Meta } = Card;
function Test() {
    const [api, contextHolder] = notification.useNotification();
    const [createTripModalOpen, setCreateTripModalOpen] = React.useState(false);
    const [expensesModal, setExpensesModal] = React.useState(false);
    const [username, setUsername] = useState("")
    const [activeTrip, setActiveTrip] = useState([])
    const [expenseList, setExpenseList] = useState([])
    const [tripName, setTripName] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [currency, setCurrency] = useState("")
    const [tripType, setTripType] = React.useState('solo');
    const [addExpensesDesp, setAddExpensesDesp] = React.useState("");
    const [addExpensesCat, setAddExpensesCat] = React.useState("");
    const [addExpensesDate, setAddExpensesDate] = React.useState("");
    const [addExpensesAmount, setAddExpensesAmount] = React.useState("");
    const [addExpensesPayType, setAddExpensesPayType] = React.useState("");
    useEffect(() => {
        getActiveTrip()
    }, [0]);
    const style = {
        "createTripStyle": {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: "90vw",
            height: "100vh",
            bgcolor: 'black',
            border: '1px solid #fff',
            color: "white",
            boxShadow: 24,
            p: 4,
        }, "addExpenseStyle": {
            // margin: 20,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: "90vw",
            height: "100vh",
            bgcolor: 'black',
            border: '1px solid #fff',
            color: "white",
            boxShadow: 24,
            p: 4,
        }
    }
    const getActiveTrip = async () => {
        let data = JSON.parse(localStorage.getItem("user"))
        console.log("🚀 ~ file: Test.js:14 ~ getActiveTrip ~ data:", data?.trips)
        setActiveTrip(data.trips)
        setUsername(data.username)

    }
    const getExpensesList = async () => {
        const response = await axios.get(`${port}/tripExpense?trip_id=${activeTrip[0].trip_uuid}`, {});
        console.log("🚀 ~ file: Test.js:71 ~ getExpensesList ~ response:", response.data.tripResult.expenses)
        setExpenseList(response.data.tripResult.expenses)
        // setExpenseList(data.trips)
        // setUsername(data.username)

    }
    const handleChange = (event, type) => {
        setTripType(type);
    };
    const openNotificationWithIcon = (type, msg, des, placement) => {
        console.log("🚀 ~ file: Test.js:57 ~ openNotificationWithIcon ~ type, msg, des, placement:", type, msg, des, placement)
        try {
            api[type]({ message: msg, description: des, placement });
        } catch (error) {
            console.log("🚀 ~ file: Home.js:90 ~ openNotificationWithIcon ~ error:", error)

        }
    };
    const createTripModalhandleOpen = () => setCreateTripModalOpen(true);
    const createTripModalhandleClose = () => setCreateTripModalOpen(false);
    const addExpenseModalhandleOpen = () => setExpensesModal(true);
    const addExpenseModalhandleClose = () => setExpensesModal(false);
    const submit = async () => {
        try {
            const data = {
                "tripName": tripName,
                "tripMode": tripType,
                "statrData": startDate,
                "endDate": endDate,
                "currency": currency
            };
            if (tripName && tripType && startDate && endDate && currency) {
                const response = await axios.post(`${port}/createTrip/?username=${username}`, data);
                console.log("🚀 ~ file: Test.js:622 ~ submit ~ response:", response)
                createTripModalhandleClose()
                await openNotificationWithIcon('success', 'Done', ` Trip ${tripName} is created`, 'top')
                localStorage.setItem("user", JSON.stringify(response.data.message))
                getActiveTrip()

            } else {
                await openNotificationWithIcon('warning', 'WARNING', 'Required Field is Missing', 'top')

            }
        } catch (error) {
            console.log("🚀 ~ file: Test.js:622 ~ submit ~ error:", error)
            await openNotificationWithIcon('error', 'ERROR while creating Trip', `${error.response.data.message}`, 'top')
        }
    }
    const addExpensesubmit = async () => {
        console.log("🚀 ~ file: Test.js:147 ~ addExpensesubmit ~ addExpensesDesp", addExpensesDesp, addExpensesCat, addExpensesDate, addExpensesAmount, addExpensesPayType)

        try {
            const data = {
                "amount": addExpensesAmount,
                "tag": addExpensesCat,
                "note": addExpensesDesp,
                "date": addExpensesDate,
                "payment_mode": addExpensesPayType
            };
            if (addExpensesDesp && addExpensesCat && addExpensesDate && addExpensesAmount && addExpensesPayType) {

                const response = await axios.post(`${port}/addExpense/?id=${activeTrip[0].trip_uuid}`, data);
                console.log("🚀 ~ file: Test.js:622 ~ submit ~ response:", response)
                // handleClose()
                await openNotificationWithIcon('success', 'Done', ` ${response.data.message}`, 'top')
                getExpensesList()
                addExpenseModalhandleClose()

            } else {
                await openNotificationWithIcon('warning', 'WARNING', 'Required Field is Missing', 'top')

            }
            // localStorage.setItem("user", JSON.stringify(response.data.message))
            // getActiveTrip()


        } catch (error) {
            console.log("🚀 ~ file: Test.js:622 ~ submit ~ error:", error.response.data.message)
            await openNotificationWithIcon('error', 'ERROR while creating Trip', `${error.response.data.message}`, 'top')
        }
    }
    return (
        <>
            {activeTrip.length > 0 ?
                <>
                    {contextHolder}

                    <Card
                        style={{ width: "100vw", backgroundColor: "", colorTextHeading: "white" }}
                        actions={[
                            <SettingOutlined key="setting" />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            style={{ color: "white" }}
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                            title={activeTrip[0].tripName}
                        />
                    </Card>
                    <FloatButton
                        icon={<FileTextOutlined />}
                        description="ADD EXPENSES"
                        shape="square"
                        style={{
                            // right: 100,
                            width: "30vw"
                        }}
                        onClick={addExpenseModalhandleOpen}
                    />
                    {expenseList.length > 0 ?
                        <>
                            <List
                                className="demo-loadmore-list"
                                // loading={initLoading}
                                itemLayout="horizontal"
                                // loadMore={loadMore}
                                dataSource={expenseList}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
                                    >
                                        <Skeleton avatar title={false} loading={item.loading} active>
                                            <List.Item.Meta
                                                avatar={<Avatar src="https://randomuser.me/api/portraits/women/24.jpg" />}
                                                title={<a href="https://ant.design">{item?.note}</a>}
                                                description={item?.date} />
                                            <div>content</div>
                                        </Skeleton>
                                    </List.Item>
                                )}
                            />
                        </>
                        :
                        <>
                            <h1 style={{ color: "white" }}>add your first expenses</h1>
                        </>
                    }
                    <Button variant="contained" color="warning" onClick={getExpensesList}>Refresh</Button>

                    <Modal
                        open={expensesModal}
                        onClose={addExpenseModalhandleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style.addExpenseStyle}>
                            <TextField sx={{ marginTop: 20, color: "black", backgroundColor: "white" }} id="filled-basic" label="Description" variant="filled"
                                onChange={(e) => setAddExpensesDesp(e.target.value)}
                            />
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={addExpensesCat}
                                label="Catogory"
                                // defaultValue="SELECT"
                                sx={{ border: "1px solid white", color: "black", backgroundColor: "white", marginTop: 5, width: "50vw" }}
                                onChange={(e) => setAddExpensesCat(e.target.value)}
                            >
                                <MenuItem value={"Transport"}>Transport</MenuItem>
                                <MenuItem value={"Accomadation"}>Accomadation</MenuItem>
                                <MenuItem value={"Food"}>Food</MenuItem>
                                <MenuItem value={"MISC"}>MISC</MenuItem>
                            </Select>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                    components={[
                                        'DatePicker'
                                    ]}
                                >
                                    <DemoItem label="Date">
                                        <DatePicker sx={{ backgroundColor: "white" }}
                                            onChange={(newValue) => setAddExpensesDate(newValue?.$d)}
                                        />
                                    </DemoItem>

                                </DemoContainer>
                            </LocalizationProvider>
                            <TextField sx={{ marginTop: 5, border: "1px solid white", color: "white", backgroundColor: "white" }} id="filled-basic" label="Amount" type="number" variant="filled"
                                onChange={(e) => setAddExpensesAmount(e.target.value)}
                            />
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={addExpensesPayType}
                                label="Catogory"
                                // defaultValue="SELECT"
                                sx={{ border: "1px solid white", color: "black", backgroundColor: "white", marginTop: 5, width: "50vw" }}
                                onChange={(e) => setAddExpensesPayType(e.target.value)}
                            >
                                <MenuItem value={"UPI"}>UPI</MenuItem>
                                <MenuItem value={"Card"}>Card</MenuItem>
                                <MenuItem value={"Cash"}>Cash</MenuItem>
                            </Select>
                            <Box sx={{ marginTop: 5 }}>
                                <Button variant="contained" color="success" onClick={addExpensesubmit}>Create</Button>
                                <Button variant="contained" color="error" onClick={addExpenseModalhandleClose}>Cancel</Button>
                            </Box>
                        </Box>
                    </Modal>

                </>
                :
                <>
                    <div className='createTripDiv'>
                        {contextHolder}
                        <Button variant="outlined" color="error" onClick={createTripModalhandleOpen}>Create Trip</Button>
                        <Modal
                            open={createTripModalOpen}
                            onClose={createTripModalhandleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style.createTripStyle}>
                                <ToggleButtonGroup
                                    color="warning"
                                    value={tripType}
                                    exclusive
                                    onChange={handleChange}
                                    aria-label="Platform"
                                    sx={{
                                        borderBottom: "1px solid white", marginBottom: 5, padding: 5, display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center"
                                    }}
                                >
                                    <ToggleButton value="solo" sx={{ color: "white", border: "1px solid white" }}>Solo Trip</ToggleButton>
                                    <ToggleButton value="group" sx={{ color: "white", border: "1px solid white" }}>Group Trip</ToggleButton>
                                </ToggleButtonGroup>
                                <TextField sx={{ border: "1px solid white", color: "white", backgroundColor: "white" }} id="filled-basic" label="TripName" variant="filled" onChange={(e) => setTripName(e.target.value)} />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'DatePicker',
                                        ]}
                                    >

                                        <DemoItem label="startDate">
                                            <DatePicker sx={{ backgroundColor: "white" }} onChange={(newValue) => setStartDate(newValue.$d)} />
                                        </DemoItem>
                                        <DemoItem label="endDate">
                                            <DatePicker sx={{ backgroundColor: "white" }} onChange={(newValue) => setEndDate(newValue.$d)} />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currency}
                                    label="Age"
                                    defaultValue="SELECT"
                                    sx={{ border: "1px solid white", color: "black", backgroundColor: "white", marginTop: 5, width: "50vw" }}
                                    onChange={(e) => setCurrency(e.target.value)}                                >
                                    <MenuItem value={"AED"}>AED</MenuItem>
                                    <MenuItem value={"AFN"}>AFN</MenuItem>
                                    <MenuItem value={"ALL"}>ALL</MenuItem>
                                    <MenuItem value={"AOA"}>AOA</MenuItem>
                                    <MenuItem value={"ARS"}>ARS</MenuItem>
                                    <MenuItem value={"AUD"}>AUD</MenuItem>
                                    <MenuItem value={"AWG"}>AWG</MenuItem>
                                    <MenuItem value={"AZN"}>AZN</MenuItem>
                                    <MenuItem value={"BAM"}>BAM</MenuItem>
                                    <MenuItem value={"BBD"}>BBD</MenuItem>
                                    <MenuItem value={"BDT"}>BDT</MenuItem>
                                    <MenuItem value={"BGN"}>BGN</MenuItem>
                                    <MenuItem value={"BHD"}>BHD</MenuItem>
                                    <MenuItem value={"BIF"}>BIF</MenuItem>
                                    <MenuItem value={"BMD"}>BMD</MenuItem>
                                    <MenuItem value={"BND"}>BND</MenuItem>
                                    <MenuItem value={"BOB"}>BOB</MenuItem>
                                    <MenuItem value={"BRL"}>BRL</MenuItem>
                                    <MenuItem value={"BSD"}>BSD</MenuItem>
                                    <MenuItem value={"BTN"}>BTN</MenuItem>
                                    <MenuItem value={"BWP"}>BWP</MenuItem>
                                    <MenuItem value={"BYN"}>BYN</MenuItem>
                                    <MenuItem value={"BZD"}>BZD</MenuItem>
                                    <MenuItem value={"CAD"}>CAD</MenuItem>
                                    <MenuItem value={"CDF"}>CDF</MenuItem>
                                    <MenuItem value={"CHF"}>CHF</MenuItem>
                                    <MenuItem value={"CLP"}>CLP</MenuItem>
                                    <MenuItem value={"CNY"}>CNY</MenuItem>
                                    <MenuItem value={"COP"}>COP</MenuItem>
                                    <MenuItem value={"CRC"}>CRC</MenuItem>
                                    <MenuItem value={"CUC"}>CUC</MenuItem>
                                    <MenuItem value={"CUP"}>CUP</MenuItem>
                                    <MenuItem value={"CVE"}>CVE</MenuItem>
                                    <MenuItem value={"CZK"}>CZK</MenuItem>
                                    <MenuItem value={"DJF"}>DJF</MenuItem>
                                    <MenuItem value={"DKK"}>DKK</MenuItem>
                                    <MenuItem value={"DOP"}>DOP</MenuItem>
                                    <MenuItem value={"DZD"}>DZD</MenuItem>
                                    <MenuItem value={"EGP"}>EGP</MenuItem>
                                    <MenuItem value={"ERN"}>ERN</MenuItem>
                                    <MenuItem value={"ETB"}>ETB</MenuItem>
                                    <MenuItem value={"EUR"}>EUR</MenuItem>
                                    <MenuItem value={"FJD"}>FJD</MenuItem>
                                    <MenuItem value={"FKP"}>FKP</MenuItem>
                                    <MenuItem value={"FOK"}>FOK</MenuItem>
                                    <MenuItem value={"GBP"}>GBP</MenuItem>
                                    <MenuItem value={"GEL"}>GEL</MenuItem>
                                    <MenuItem value={"GGP"}>GGP</MenuItem>
                                    <MenuItem value={"GHS"}>GHS</MenuItem>
                                    <MenuItem value={"GIP"}>GIP</MenuItem>
                                    <MenuItem value={"GMD"}>GMD</MenuItem>
                                    <MenuItem value={"GNF"}>GNF</MenuItem>
                                    <MenuItem value={"GTQ"}>GTQ</MenuItem>
                                    <MenuItem value={"GYD"}>GYD</MenuItem>
                                    <MenuItem value={"HKD"}>HKD</MenuItem>
                                    <MenuItem value={"HNL"}>HNL</MenuItem>
                                    <MenuItem value={"HRK"}>HRK</MenuItem>
                                    <MenuItem value={"HTG"}>HTG</MenuItem>
                                    <MenuItem value={"HUF"}>HUF</MenuItem>
                                    <MenuItem value={"IDR"}>IDR</MenuItem>
                                    <MenuItem value={"ILS"}>ILS</MenuItem>
                                    <MenuItem value={"IMP"}>IMP</MenuItem>
                                    <MenuItem value={"INR"}>INR</MenuItem>
                                    <MenuItem value={"IQD"}>IQD</MenuItem>
                                    <MenuItem value={"IRR"}>IRR</MenuItem>
                                    <MenuItem value={"ISK"}>ISK</MenuItem>
                                    <MenuItem value={"JEP"}>JEP</MenuItem>
                                    <MenuItem value={"JMD"}>JMD</MenuItem>
                                    <MenuItem value={"JOD"}>JOD</MenuItem>
                                    <MenuItem value={"JPY"}>JPY</MenuItem>
                                    <MenuItem value={"KES"}>KES</MenuItem>
                                    <MenuItem value={"KGS"}>KGS</MenuItem>
                                    <MenuItem value={"KHR"}>KHR</MenuItem>
                                    <MenuItem value={"KID"}>KID</MenuItem>
                                    <MenuItem value={"KMF"}>KMF</MenuItem>
                                    <MenuItem value={"KRW"}>KRW</MenuItem>
                                    <MenuItem value={"KWD"}>KWD</MenuItem>
                                    <MenuItem value={"KYD"}>KYD</MenuItem>
                                    <MenuItem value={"KZT"}>KZT</MenuItem>
                                    <MenuItem value={"LAK"}>LAK</MenuItem>
                                    <MenuItem value={"LBP"}>LBP</MenuItem>
                                    <MenuItem value={"LKR"}>LKR</MenuItem>
                                    <MenuItem value={"LRD"}>LRD</MenuItem>
                                    <MenuItem value={"LSL"}>LSL</MenuItem>
                                    <MenuItem value={"LYD"}>LYD</MenuItem>
                                    <MenuItem value={"MAD"}>MAD</MenuItem>
                                    <MenuItem value={"MDL"}>MDL</MenuItem>
                                    <MenuItem value={"MGA"}>MGA</MenuItem>
                                    <MenuItem value={"MKD"}>MKD</MenuItem>
                                    <MenuItem value={"MMK"}>MMK</MenuItem>
                                    <MenuItem value={"MNT"}>MNT</MenuItem>
                                    <MenuItem value={"MOP"}>MOP</MenuItem>
                                    <MenuItem value={"MRU"}>MRU</MenuItem>
                                    <MenuItem value={"MUR"}>MUR</MenuItem>
                                    <MenuItem value={"MVR"}>MVR</MenuItem>
                                    <MenuItem value={"MWK"}>MWK</MenuItem>
                                    <MenuItem value={"MXN"}>MXN</MenuItem>
                                    <MenuItem value={"MYR"}>MYR</MenuItem>
                                    <MenuItem value={"MZN"}>MZN</MenuItem>
                                    <MenuItem value={"NAD"}>NAD</MenuItem>
                                    <MenuItem value={"NGN"}>NGN</MenuItem>
                                    <MenuItem value={"NIO"}>NIO</MenuItem>
                                    <MenuItem value={"NOK"}>NOK</MenuItem>
                                    <MenuItem value={"NPR"}>NPR</MenuItem>
                                    <MenuItem value={"NZD"}>NZD</MenuItem>
                                    <MenuItem value={"OMR"}>OMR</MenuItem>
                                    <MenuItem value={"PAB"}>PAB</MenuItem>
                                    <MenuItem value={"PEN"}>PEN</MenuItem>
                                    <MenuItem value={"PGK"}>PGK</MenuItem>
                                    <MenuItem value={"PHP"}>PHP</MenuItem>
                                    <MenuItem value={"PKR"}>PKR</MenuItem>
                                    <MenuItem value={"PLN"}>PLN</MenuItem>
                                    <MenuItem value={"PYG"}>PYG</MenuItem>
                                    <MenuItem value={"QAR"}>QAR</MenuItem>
                                    <MenuItem value={"RON"}>RON</MenuItem>
                                    <MenuItem value={"RSD"}>RSD</MenuItem>
                                    <MenuItem value={"RUB"}>RUB</MenuItem>
                                    <MenuItem value={"RWF"}>RWF</MenuItem>
                                    <MenuItem value={"SAR"}>SAR</MenuItem>
                                    <MenuItem value={"SBD"}>SBD</MenuItem>
                                    <MenuItem value={"SCR"}>SCR</MenuItem>
                                    <MenuItem value={"SDG"}>SDG</MenuItem>
                                    <MenuItem value={"SEK"}>SEK</MenuItem>
                                    <MenuItem value={"SGD"}>SGD</MenuItem>
                                    <MenuItem value={"SHP"}>SHP</MenuItem>
                                    <MenuItem value={"SLL"}>SLL</MenuItem>
                                    <MenuItem value={"SOS"}>SOS</MenuItem>
                                    <MenuItem value={"SRD"}>SRD</MenuItem>
                                    <MenuItem value={"SSP"}>SSP</MenuItem>
                                    <MenuItem value={"STN"}>STN</MenuItem>
                                    <MenuItem value={"SYP"}>SYP</MenuItem>
                                    <MenuItem value={"SZL"}>SZL</MenuItem>
                                    <MenuItem value={"THB"}>THB</MenuItem>
                                    <MenuItem value={"TJS"}>TJS</MenuItem>
                                    <MenuItem value={"TMT"}>TMT</MenuItem>
                                    <MenuItem value={"TND"}>TND</MenuItem>
                                    <MenuItem value={"TOP"}>TOP</MenuItem>
                                    <MenuItem value={"TRY"}>TRY</MenuItem>
                                    <MenuItem value={"TTD"}>TTD</MenuItem>
                                    <MenuItem value={"TVD"}>TVD</MenuItem>
                                    <MenuItem value={"TWD"}>TWD</MenuItem>
                                    <MenuItem value={"TZS"}>TZS</MenuItem>
                                    <MenuItem value={"UAH"}>UAH</MenuItem>
                                    <MenuItem value={"UGX"}>UGX</MenuItem>
                                    <MenuItem value={"USD"}>USD</MenuItem>
                                    <MenuItem value={"UYU"}>UYU</MenuItem>
                                    <MenuItem value={"UZS"}>UZS</MenuItem>
                                    <MenuItem value={"VES"}>VES</MenuItem>
                                    <MenuItem value={"VND"}>VND</MenuItem>
                                    <MenuItem value={"VUV"}>VUV</MenuItem>
                                    <MenuItem value={"WST"}>WST</MenuItem>
                                    <MenuItem value={"XAF"}>XAF</MenuItem>
                                    <MenuItem value={"XCD"}>XCD</MenuItem>
                                    <MenuItem value={"XDR"}>XDR</MenuItem>
                                    <MenuItem value={"XOF"}>XOF</MenuItem>
                                    <MenuItem value={"XPF"}>XPF</MenuItem>
                                    <MenuItem value={"YER"}>YER</MenuItem>
                                    <MenuItem value={"ZAR"}>ZAR</MenuItem>
                                    <MenuItem value={"ZMW"}>ZMW</MenuItem>
                                    <MenuItem value={"ZWL"}>ZWL</MenuItem>


                                </Select>
                                <Box sx={{ marginTop: 5 }}>
                                    <Button variant="contained" color="success" onClick={submit}>Create</Button>
                                    <Button variant="contained" color="error" onClick={createTripModalhandleClose}>Cancel</Button>
                                </Box>
                            </Box>
                        </Modal>
                    </div >
                </>}
        </>

    )
}

export default Test