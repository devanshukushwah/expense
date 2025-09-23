import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useApiDispatch, useApiState } from "@/context/ApiStateContext";
import { ApiContextType } from "@/common/ApiContextType";

export default function ConfirmDialog() {
  const { dialog } = useApiState();
  const dispatch = useApiDispatch();
  const title = dialog?.title || "Confirm";
  const message =
    dialog?.message || "Are you sure you want to delete this item?";

  const handleClose = () => {
    dispatch({ type: ApiContextType.CLOSE_DIALOG });
  };

  return (
    <Dialog open={dialog.isOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          color="error"
          variant="contained"
          onClick={dialog.onConfirmCallback}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
