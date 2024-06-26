import React from 'react';
const Assesment = React.lazy(() => import('../../components/Assesment/Assesment'));

const AssesmentPage = () => {
    return <Assesment />;
};

export default AssesmentPage;
