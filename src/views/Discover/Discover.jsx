import React from 'react';
const DiscoverPage = React.lazy(() => import('../../components/DiscoverSentance/DiscoverSentance'));

const Discover = () => {
    return <DiscoverPage />;
};

export default Discover;
