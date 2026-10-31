"use client";

import { Autocomplete, Checkbox, CircularProgress, TextField } from "@mui/material";

// Territory / Area / Store / Department picker for the Add / Edit User sheet.
//  - multiple = true  -> checkbox list + chips (only the level that matches the role)
//  - multiple = false -> plain list, one value (all other levels, and Store always)
//
// `options`  : array of label strings (already built in Employees.jsx)
// `selected` : array of label strings (always an array, even in single mode)
// `onChange` : receives the next array of labels (single mode sends [] or [label])
// `parentTitle` : set while the parent field is empty -> field is disabled
export function AssignmentAutocomplete({
  fieldKey,
  title,
  options,
  selected,
  loading,
  parentTitle,
  multiple,
  onChange,
}) {
  const disabled = Boolean(parentTitle);

  const sharedProps = {
    id: `user-${fieldKey}`,
    size: "small",
    fullWidth: true,
    options,
    loading,
    disabled,
    // IMPORTANT: render the list inside the sheet. A portaled list sits outside the
    // Radix Sheet, so its clicks count as "outside" and the sheet closes / ignores them.
    disablePortal: true,
    noOptionsText: "No options available",
    loadingText: `Loading ${title.toLowerCase()}...`,
    sx: {
      "& .MuiInputBase-root": { fontSize: "0.75rem" },
      "& .MuiInputLabel-root": { fontSize: "0.75rem" },
      "& .MuiAutocomplete-tag": { maxWidth: "110px" },
    },
    slotProps: {
      listbox: { sx: { maxHeight: 240, fontSize: "0.75rem" } },
    },
    renderInput: (params) => {
      // MUI v6+/v7 passes the input config in params.slotProps.input;
      // MUI v5 passes it in params.InputProps. Support both.
      const inputConfig = params.slotProps?.input ?? params.InputProps ?? {};
      const inputWithSpinner = {
        ...inputConfig,
        endAdornment: (
          <>
            {loading && <CircularProgress color="inherit" size={16} />}
            {inputConfig.endAdornment}
          </>
        ),
      };
      const fieldProps = params.slotProps
        ? { ...params, slotProps: { ...params.slotProps, input: inputWithSpinner } }
        : { ...params, InputProps: inputWithSpinner };

      return (
        <TextField
          {...fieldProps}
          label={title}
          helperText={disabled ? `Select ${parentTitle.toLowerCase()} first` : undefined}
        />
      );
    },
  };

  if (!multiple) {
    return (
      <Autocomplete
        {...sharedProps}
        value={selected[0] ?? null}
        onChange={(_, next) => onChange(next ? [next] : [])}
        renderOption={(props, option) => {
          const { key, ...rest } = props;
          return (
            <li key={key} {...rest} style={{ fontSize: "0.75rem" }}>
              {option}
            </li>
          );
        }}
      />
    );
  }

  return (
    <Autocomplete
      {...sharedProps}
      multiple
      limitTags={2}
      disableCloseOnSelect
      value={selected}
      onChange={(_, next) => onChange(next)}
      renderOption={(props, option, { selected: isSelected }) => {
        const { key, ...rest } = props;
        return (
          <li key={key} {...rest} style={{ fontSize: "0.75rem", paddingTop: 0, paddingBottom: 0 }}>
            <Checkbox size="small" sx={{ marginLeft: -1 }} checked={isSelected} />
            {option}
          </li>
        );
      }}
    />
  );
}