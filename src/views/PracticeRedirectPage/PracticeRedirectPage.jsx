import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PracticeRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/practice");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      className="no-page-found"
    ></Grid>
  );
};

export default PracticeRedirectPage;
