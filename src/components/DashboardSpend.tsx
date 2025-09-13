import React from "react";
import { Card, CardContent, Typography, Grid, Divider } from "@mui/material";
import { AppUtil } from "@/utils/AppUtil";

const DashboardSpend = ({ data }) => {
  const categories = data.categories || [];

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
      <CardContent>
        {/* <Typography variant="h6" gutterBottom>
          Dashboard
        </Typography> */}

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {AppUtil.formatMoney(data.totalSpends)}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          {categories.map((cat, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, textAlign: "center" }}
              >
                <Typography variant="body1">{cat.title}</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {AppUtil.formatMoney(cat.amt)}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DashboardSpend;
