import { AppConstants } from "@/common/AppConstants";
import { AppUtil } from "@/utils/AppUtil";
import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";

const DashboardSpend = ({ data }) => {
  const categories = data.categories || [];

  // sort category based on amount
  categories.sort((a, b) => b.amt - a.amt);

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
      <CardContent>
        {/* Top section: Today + Total */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Today’s Spends
            </Typography>
            <Typography variant="h6" color="primary">
              {AppUtil.formatMoney(data?.todaySpends)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Month's Spends
            </Typography>
            <Typography variant="h6" color="error">
              {AppUtil.formatMoney(data?.totalSpends)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: AppConstants.GAP, mt: AppConstants.GAP }} />

        {/* Categories List */}
        <Grid container spacing={2}>
          {categories.map((cat, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, textAlign: "center" }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {cat.title}
                </Typography>
                <Typography variant="subtitle1">
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
