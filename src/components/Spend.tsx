import { getCurrentUTCDateTimeLocal } from "@/utils/DateUtils";
import { DisabledByDefault } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { displayPersonName } from "@/utils/PersonUtils";
import { AppConstants } from "../common/AppConstants";
import { Spend } from "@/collection/Spend.collection";

const defaultValue = (): Spend => ({
  desc: "",
  amt: null,
  catId: null,
});

function Spend({ categories, onSubmit, loading, item = null }) {
  const [spend, setSpend] = React.useState<Spend>(null);

  const handleChange = (e) => {
    setSpend({ ...spend, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const spendData = { ...spend };
    if (item?._id) {
      spendData._id = item._id;
    }
    onSubmit(spendData);
  };

  useEffect(() => {
    if (item) {
      setSpend({
        ...item,
      });
    } else {
      setSpend(defaultValue());
    }
  }, [item]);

  return (
    <Stack spacing={2} sx={{ mt: AppConstants.GAP }}>
      <TextField
        label="Amount"
        name="amt"
        type="number"
        fullWidth
        variant="outlined"
        value={spend?.amt}
        onChange={handleChange}
        InputProps={{ inputProps: { min: 0 } }}
        size="small"
        autoFocus
      />
      <TextField
        label="Category"
        name="catId"
        fullWidth
        select
        variant="outlined"
        value={spend?.catId}
        onChange={handleChange}
        size="small"
      >
        {categories?.map((category) => (
          <MenuItem key={category.catId} value={category.catId}>
            <ListItemText primary={category.title} />
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Description (Optional)"
        name="desc"
        fullWidth
        variant="outlined"
        value={spend?.desc}
        onChange={handleChange}
        size="small"
      />
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        loading={loading}
        disabled={!spend?.catId || !spend?.amt}
      >
        {item ? "Save Changes" : "Add Spend"}
      </Button>
    </Stack>
  );
}

export default Spend;
