import React from 'react';
import { Box, Card, CardContent, Button, Typography, IconButton, Divider } from '@mui/material';
import back from '../../assets/images/back-arrow.svg';
import speak from '../../assets/images/ic-speak.svg';
import listen from '../../assets/images/ic-listen.svg';
import arrow from '../../assets/images/ic-arrow.svg';
import level from '../../assets/images/level.svg';
import timer from '../../assets/images/timer.svg';
import practicebg from '../../assets/images/practice-bg.svg';

const sectionStyle = {
    width: '100%',
    backgroundImage: `url(${practicebg})`,
    backgroundSize: 'cover', // Cover the entire viewport
    backgroundPosition: 'center center', // Center the image
    backgroundRepeat: 'no-repeat', // Do not repeat the image
    height: '100vh',
    padding: '20px 100px', 
    boxSizing: 'border-box'
};

const Mechanics1 = ({page, setPage}) => {

  return (
    <Box sx={sectionStyle}>
      <IconButton>
        <img src={back} alt='back' style={{ height: '30px' }} />
      </IconButton>

      <Card sx={{ width: '85vw', height: '80vh', borderRadius: '15px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <CardContent>
          <img src={timer} alt='timer' height='40px'/>

          <Typography variant="h5" component="h4" sx={{ mb: 4, mt: 4, fontSize: '20px', color: '#333F61', textAlign: 'center', fontFamily:'Quicksand' }}>
            Speak the below word
          </Typography>
          <Typography variant="h4" component="p" sx={{ mb: 4, color: '#333F61', textAlign: 'center', fontSize: '30px',paddingX: '140px', lineHeight: 'normal', fontWeight: 700, fontFamily:'Quicksand'}}>
            CAPABILITY
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" sx={{  background: 'linear-gradient(45deg, #A856FF 30%, #710EDC 90%)', color: 'white', m: 1, textTransform: 'none', width: '100px' }}>
              <img src={listen} alt='listen' height='15px' /><span  style={{marginLeft:'4px', fontFamily:'Quicksand'}}>Listen</span>
            </Button>
            <Button variant="contained" sx={{ background: 'linear-gradient(45deg, #84F630 30%, #409500 90%)', color: 'white', m: 1, textTransform: 'none', width: '100px' }}>
              <img src={speak} alt='speak' height='15px' /><span style={{marginLeft:'4px', fontFamily:'Quicksand'}}>Speak</span>
            </Button>
          </Box>
        </CardContent>
        <Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{position:'relative', right:'60px'}}>
          <img src={level} alt='level' height='100px'/>
          </Box>
          <Button variant="contained" onClick={()=> setPage(page+1)} sx={{  background: 'linear-gradient(45deg, #FF9050 30%, #E15404 90%)', color: 'white', mt: 4,mr:4, textTransform: 'none', width: '90px', height:'35px' }}>
            <span style={{marginRight:'4px'}}>Next</span><img src={arrow} alt='arrow' height='15px' />
          </Button>
        </Box>
        </Box>
      </Card>

    </Box>
  );
};

export default Mechanics1;
