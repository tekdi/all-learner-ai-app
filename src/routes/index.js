/* Route declarations for the app */

import * as reviews from "../views";

const routData = [
  {
    id: "route-002",
    path: "/discover",
    component: reviews.Discover,
    requiresAuth: true,
  },
  {
    id: "route-003",
    path: "/discover-start",
    component: reviews.DiscoverStart,
    requiresAuth: true,
  },
  {
    id: "route-004",
    path: "/discover-end",
    component: reviews.DiscoverEnd,
    requiresAuth: true,
  },
  {
    id: "route-005",
    path: "/practice",
    component: reviews.PracticePage,
    requiresAuth: true,
  },

  {
    id: "route-006",
    path: "/assesment",
    component: reviews.Assesment,
    requiresAuth: true,
  },
  {
    id: "route-007",
    path: "/assesment-end",
    component: reviews.AssesmentEnd,
    requiresAuth: true,
  },

  {
    id: "route-008",
    path: "/level-page",
    component: reviews.HomePage,
    requiresAuth: true,
  },
  {
    id: "route-009",
    path: "/_practice",
    component: reviews.PracticeRedirectPage,
    requiresAuth: true,
  },
];

// add login route for test rig
if (process.env.REACT_APP_IS_APP_TEST_RIG === 'true') {
  routData.push(
  {
    id: "route-001",
    path: "/",
    component: reviews.LoginPage,
    requiresAuth: true,
  },
  {
    id: "route-000",
    path: "*",
    component: reviews.LoginPage,
    requiresAuth: false,
  },
  );
}else {
  routData.push(
    {
    id: "route-001",
    path: "/",
    component: reviews.DiscoverStart,
    requiresAuth: false,
  },
  {
    id: "route-000",
    path: "*",
    component: reviews.DiscoverStart,
    requiresAuth: false,
  },
  );
}

export default routData;
