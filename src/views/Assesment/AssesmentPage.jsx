import React from 'react';
// import Assesment from '../../components/Assesment/Assesment';
const Assesment = React.lazy(() => import('../../components/Assesment/Assesment'));

const AssesmentPage = () => {
    return <Assesment />;
};

export default AssesmentPage;
