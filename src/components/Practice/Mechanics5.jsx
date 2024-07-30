import { Box } from '@mui/material';
import React, { createRef, useState } from 'react';
import seePictureAndTell from '../../assets/images/seePictureAndTell.png';
import VoiceAnalyser from '../../utils/VoiceAnalyser';
import MainLayout from '../Layouts.jsx/MainLayout';
import { Grid } from '../../../node_modules/@mui/material/index';
import { PlayAudioButton, StopAudioButton } from '../../utils/constants';
import v11 from '../../assets/audio/V10.mp3';

// const sectionStyle = {
//     width: '100%',
//     backgroundImage: `url(${practicebg})`,
//     backgroundSize: 'cover', // Cover the entire viewport
//     backgroundPosition: 'center center', // Center the image
//     backgroundRepeat: 'no-repeat', // Do not repeat the image
//     height: '100vh',
//     padding: '20px 100px',
//     boxSizing: 'border-box',
// };

const Mechanics5 = ({ page, setPage, setVoiceText, setRecordedAudio, setVoiceAnimate, storyLine }) => {
    const [sentences, setSentences] = useState([
        'What is the boy doing in picture.?',
        'Kids are eating breakfast',
        'The kids are playing with the small dog',
        'The elephant is drinking water',
    ]);

    const audioRef = createRef(null);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = React.useState(false);

    const [isPlaying, setIsPlaying] = React.useState(false);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };
    const [currrentProgress, setCurrrentProgress] = React.useState(0);
    // const progressBarWidth = isNaN(currrentProgress / duration) ? 0 : currrentProgress / duration;

    return (
        <MainLayout level={1}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid container sx={{ width: '80%', justifyContent: 'center', mb: 2, mt: 8 }}>
                    <Grid xs={5}>
                        <img src={seePictureAndTell} style={{ borderRadius: '20px' }} alt='' />
                    </Grid>
                    <Grid xs={7}>
                        {sentences?.map((elem, i) => (
                            <Box mt={i > 0 && 3} sx={{ display: 'flex' }}>
                                <audio
                                    ref={audioRef}
                                    preload="metadata"
                                    onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                                    onCanPlay={(e) => {
                                        setIsReady(true);
                                    }}
                                    onPlaying={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onTimeUpdate={(e) => {
                                        setCurrrentProgress(e.currentTarget.currentTime);
                                    }}
                                >
                                    <source type="audio/mp3" src={v11} />
                                </audio>
                                <Box
                                    mt={'1px'}
                                    mx={1}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        togglePlayPause();
                                    }}
                                >
                                    {isReady && (
                                        <>
                                            {isPlaying ? (
                                                <StopAudioButton size={35} color={'#1CB0F6'} />
                                            ) : (
                                                <PlayAudioButton size={35} color={'#1CB0F6'} />
                                            )}
                                        </>
                                    )}
                                </Box>
                                <span
                                    style={{
                                        color: '#262649',
                                        fontWeight: 600,
                                        fontSize: '26px',
                                        fontFamily: 'Quicksand',
                                    }}
                                >
                                    {elem}
                                </span>
                            </Box>
                        ))}
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <VoiceAnalyser
                    setVoiceText={setVoiceText}
                    setRecordedAudio={setRecordedAudio}
                    setVoiceAnimate={setVoiceAnimate}
                    storyLine={storyLine}
                    dontShowListen={true}
                    // updateStory={updateStory}
                />
            </Box>
        </MainLayout>
    );
};

export default Mechanics5;
