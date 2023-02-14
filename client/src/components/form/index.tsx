import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import { useFormik } from "formik";
import { socket } from "../../App";
import React from 'react';

import { DateRangePicker } from 'material-mui-date-range-picker'

export function Form({ config }: any) {  
  const formik = useFormik({
    initialValues: config.inputs.reduce((acc: any, { value, name }: any) =>({ ...acc, [name]: value }), {}),
    onSubmit() {}
  })

  return (
    <div style={{ display: 'flex', flexFlow: 'row wrap',  }}>
      <Card style={{ width: '100%' }}>
        <CardContent style={{ display: 'grid', gridTemplateColumns: `repeat(${config.columns || 3}, 1fr)`, gap: 15 }}>
          {config
            .inputs
            .map((input: any) => {
              if (['str', 'url', 'email', 'password'].includes(input.type)) {
                return (
                  <TextField 
                    label={input.label}
                    type={input.type === 'str' ? 'text' : input.type}
                    {...formik.getFieldProps(input.name)}
                  />
                );
              }

              if (input.type === 'num') {
                return (
                  <TextField 
                    label={input.label}
                    type="number"
                    {...formik.getFieldProps(input.name)}
                  />
                );
              }

              if (input.type === 'range') {
                const { values } = formik;
                const { value } =  formik.getFieldProps(input.name);

                return (
                  <div>
                    <Typography>{input.label} ({formik.values[input.name] || 0})</Typography>
                    <Slider 
                      step={input.step}
                      min={input.min}
                      max={input.max}
                      value={value}
                      onChange={(_, newValue) => formik.setValues({ ...values, [input.name]: newValue })}
                    />
                  </div>
                );
              }

              if (['check', 'switch'].includes(input.type)) {
                const { values } = formik;
                const { value } =  formik.getFieldProps(input.name);
                return (
                  <FormControlLabel
                    label={input.label}
                    control={
                      input.type === 'check'
                        ? <Checkbox 
                            checked={value} 
                            onChange={(e) => formik.setValues({ ...values, [input.name]: !value })}
                          /> 
                        : <Switch
                            checked={value} 
                            onChange={(e) => formik.setValues({ ...values, [input.name]: !value })}
                          />}
                  />
                );
              }

              if (input.type === 'select') {
                const values = input
                  .values
                  .map((val: any) => (
                    typeof val === 'string' ? { value: val, label: val } : val
                  ))
                
                return (
                  <TextField
                    select 
                    label={input.label}
                    {...formik.getFieldProps(input.name)}
                  >
                    {values.map(({ value, label }: any) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
                  </TextField>
                )
              }

              if (input.type === 'multiselect') {
                const options = input
                  .values
                  .map((val: any) => (
                    typeof val === 'string' ? { value: val, label: val } : val
                  ))

                const { values } = formik;
                
                return (
                  <FormControl>
                    <InputLabel>{input.label}</InputLabel>
                    <Select
                      multiple
                      value={values[input.name]}
                      onChange={({ target: { value } }) => {
                        formik.setFieldValue(
                          input.name,
                          typeof value === 'string'
                            ? value.split(',')
                            : value
                        );
                      }}
                    >
                      {options.map(({ value, label }: any) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
                    </Select>
                  </FormControl>
                )
              }

              if (input.type === 'date') {
                const value = formik.values[input.name];
                return (
                  <KeyboardDatePicker
                    label={input.label}
                    format="d MMM yyyy"
                    value={value instanceof Date ? new Date(value) : value}
                    onChange={(value) => formik.setFieldValue(input.name, value)}
                  />
                );
              }

              if (input.type === 'datetime') {
                const value = formik.values[input.name];
                return (
                  <KeyboardDateTimePicker
                    label={input.label}
                    format="d MMM yyyy hh:mm"
                    value={value instanceof Date ? new Date(value) : value}
                    onChange={(value) => formik.setFieldValue(input.name, value)}
                  />
                );
              }

              if (input.type === 'time') {
                const value = formik.values[input.name];
                return (
                  <KeyboardTimePicker
                    label={input.label}
                    format="hh:mm"
                    value={value instanceof Date ? new Date(value) : value}
                    onChange={(value) => formik.setFieldValue(input.name, value)}
                  />
                );
              }

              // if (input.type === 'daterange') {
              //   return (
              //     <DateRangePicker
              //       startText={input.startText || 'С'}
              //       endText={input.endText || 'По'}
              //       value={formik.values[input.name] || [new Date(), new Date()]}
              //       onChange={(value: any) => formik.setFieldValue(input.name, value)}
              //       renderInput={(startProps: any, endProps: any) => (
              //         <React.Fragment>
              //           <TextField {...startProps} />
              //           <span style={{ padding: '0 15px' }}> to </span>
              //           <TextField {...endProps} />
              //         </React.Fragment>
              //       )}
              //     />
              //   );
              // }
            })}
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          {config
            .buttons
            .map((btn: any) => (
              <Button 
                color={btn.type}
                variant="contained"
                onClick={() => {
                  socket.emit('admin-message', { target: 'action', actionId: btn.handler, params: formik.values })
                }}
              >
                {btn.label}
              </Button>
            ))}
        </CardActions>
      </Card>
    </div>
  );
}