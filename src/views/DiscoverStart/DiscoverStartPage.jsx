import React from 'react';
const Assesment = React.lazy(() => import('../../components/Assesment/Assesment'));


const DiscoverStart = () => {
    return <Assesment discoverStart />;
};

export default DiscoverStart;
