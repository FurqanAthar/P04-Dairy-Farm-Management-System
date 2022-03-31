export const filterTableStyles = {
  header: {
    style: {
      padding: "0",
      minHeight: "inherit",
    },
  },
  subHeader: {
    style: {
      padding: "0",
      justifyContent: "flex-start",
      display: "block",
      border: "1px solid #E5E8F5",
      borderBottom: "none",
      borderRadius: "6px 6px 0 0",
    },
  },
  tableWrapper: {
    style: {
      border: "1px solid #E5E8F5",
      borderTop: "none",
    },
  },
  headRow: {
    style: {
      color: "#43536D",
      borderColor: "#E5E8F5",
      borderStyle: "solid",
      borderWidth: "1px",
      borderLeftWidth: "0",
      borderRightWidth: "0",
      backgroundColor: "#FCFCFF",
    },
  },
  headCells: {
    style: {
      fontSize: "13px",
      fontWeight: "normal",
      color: "#767778",
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: "#fff",
      },
    },
  },
  rows: {
    style: {
      minHeight: "65px",
      "&:not(:last-of-type)": {
        borderBottomStyle: "solid",
        borderBottomWidth: "1px",
        borderBottomColor: "#E5E8F5",
      },
    },
  },
  cells: {
    style: {
      minHeight: "65px",
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: "#fff",
      },
    },
  },
  pagination: {
    style: {
      border: "1px solid #E5E8F5",
      borderTop: "none",
      borderRadius: "0 0 6px 6px",
    },
  },
};