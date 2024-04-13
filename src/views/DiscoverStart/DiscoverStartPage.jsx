import React from 'react';
// import Assesment from '../../components/Assesment/Assesment';
const Assesment = React.lazy(() => import('../../components/Assesment/Assesment'));

const DiscoverStart = () => {
    return <Assesment discoverStart />;
};

export default DiscoverStart;
