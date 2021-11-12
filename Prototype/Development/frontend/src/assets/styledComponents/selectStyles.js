export const filterTableSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    background: state.isFocused ? "#fff" : "#fff",
    borderWidth: 1,
    borderRadius: "8px",
    borderColor: state.isFocused ? "#28a745" : "#E5E8F5",
    boxShadow: state.isFocused ? null : null,
    fontSize: "14px",
    "&:hover": {
      borderColor: state.isFocused ? "#28a745" : null,
    },
  }),
  dropdownIndicator: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    width: "32px",
    color: "#142433",
  }),
  menu: (base) => ({
    ...base,
    fontSize: "13px",
    border: "1px solid #f1f3f6",
    boxShadow: "none",
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected ? "#f1f3f6" : "#fff",
    color: "#151B26",
    "&:hover": {
      background: "#f1f3f6",
      color: "#151B26",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#142433",
  }),
  clearIndicator: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
};