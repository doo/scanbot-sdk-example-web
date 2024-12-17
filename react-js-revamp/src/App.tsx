import { Box, List } from "@mui/material";
import { useNavigate } from 'react-router-dom';

import { Code, DirectionsCar, DocumentScanner, QrCodeScanner, TextIncrease } from "@mui/icons-material";

import FeatureListItem from "./subviews/FeatureListItem.tsx";
import SectionHeader from "./subviews/SectionHeader.tsx";


function App() {

    const navigate = useNavigate();

    return (
        <Box style={{width: "100vw", height: "100vh"}}>
            <List sx={{}}>

                <SectionHeader title={"Classic Scanners"} />
                <FeatureListItem icon={DocumentScanner} text='Document Scanner View' onClick={() => {
                    navigate('document-scanner');
                }} />
                <FeatureListItem icon={QrCodeScanner} text='Barcode Scanner View' onClick={() => {
                    navigate('barcode-scanner');
                }} />
                <FeatureListItem icon={Code} text='MRZ Scanner View' onClick={() => {
                    navigate('mrz-scanner');
                }} />
                <FeatureListItem icon={TextIncrease} text='Text Pattern Scanner View' onClick={() => {
                    navigate('text-pattern-scanner');
                }} />
                <FeatureListItem icon={DirectionsCar} text='VIN Scanner View' onClick={() => {
                    navigate('vin-scanner');
                }} />

            </List>
        </Box>
    )
}

export default App
