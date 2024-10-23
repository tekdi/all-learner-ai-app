import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isApiDone: false,
        isOtpVerified: false,
        username: '',
        id: 0,
        mobile: '',
        otpSent: false,
        userId: null,
    },
    reducers: {
        setUser(state, action) {
            const userData = action.payload;
            state.isApiDone = true;
            state.isOtpVerified = false;
            state.id = userData.id;
            state.mobile = userData.mobile;
        },
        setIsDone(state, action) {
            state.isApiDone = action.payload.isApiDone;
        },
        setOTPSent(state, action) {
            state.otpSent = action.payload.otpSent;
        },
        generateOTP(state, action) {},
        signinUser(state, action) {},
        verifyOtp(state, action) {},
        setOtpVerified(state, action) {
            state.isOtpVerified = action.payload.isOtpVerified;
        },
        setUserId(state, action) {
            state.userId = action.payload;
        },
    },
});

export const {
    getUser,
    setUser,
    signinUser,
    setIsDone,
    setOTPSent,
    generateOTP,
    setOtpVerified,
    verifyOtp,
    isOtpVerified,
    setUserId,
} = userSlice.actions;

export default userSlice.reducer;
