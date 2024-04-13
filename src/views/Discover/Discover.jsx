import React from 'react';
// import DiscoverPage from '../../components/DiscoverSentance/DiscoverSentance';
const DiscoverPage = React.lazy(() => import('../../components/DiscoverSentance/DiscoverSentance'));

const Discover = () => {
    return <DiscoverPage />;
};

export default Discover;
