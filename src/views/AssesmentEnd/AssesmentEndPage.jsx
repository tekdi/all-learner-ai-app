import React from 'react';
// import AssesmentEnd from '../../components/AssesmentEnd/AssesmentEnd';
const AssesmentEnd = React.lazy(() => import('../../components/AssesmentEnd/AssesmentEnd'));

const AssesmentEndPage = () => {
    return <AssesmentEnd />;
};

export default AssesmentEndPage;
