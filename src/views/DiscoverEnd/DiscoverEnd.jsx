import React from 'react';
// import DiscoverEndPage from '../../components/DiscoverEnd/DiscoverEnd';
const DiscoverEndPage = React.lazy(() => import('../../components/DiscoverEnd/DiscoverEnd'));

const DiscoverEnd = () => {
    return <DiscoverEndPage />;
};

export default DiscoverEnd;
