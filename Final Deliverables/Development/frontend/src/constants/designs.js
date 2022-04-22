// file containing designs that are being used constantly
export const customRoleControlStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 50,
    background: state.isFocused ? "#fff" : "#fff",
    borderWidth: 1,
    borderRadius: "8px",
    borderColor: state.isFocused ? "#28a745" : "#E5E8F5",
    boxShadow: state.isFocused ? null : null,
    fontSize: "12px",
    "&:hover": {
      borderColor: state.isFocused ? "#28a745" : null,
    },
  }),
  dropdownIndicator: (base) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: "5px",
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
    color: "#A8B9CD",
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
