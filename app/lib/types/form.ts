import { Promised } from ".";

export type Input<ValueType = string> = {
  label: string;
  value: ValueType;
  name: string,
}

export type StrInput = Input & {
  type: 'str' | 'url' | 'markdown' | 'color' | 'phone' | 'email' | 'password',
  mask?: string,
  maxLength?: number,
}

export type RangeInput = Input & {
  type: 'range',
  step?: number,
}

export type NumInput = Input & {
  type: 'num',
  mask?: string,
  max?: number,
  min?: number,
};

export type FileInput = Input & {
  type: 'file',
  accept?: string,
};

export type DateInput = Input<Date> & {
  type: 'date' | 'datetime' | 'time' | 'week' | 'month',
};

export type SelectInput = Input & {
  type: 'select',
  getValues: (string | { label: string, value: string })[],
};

export type MultiSelectInput = Input<string[]> & {
  type: 'multiselect',
  getValues: (string | { label: string, value: string })[],
};

export type CheckInput = Input<boolean> & {
  type: 'check' | 'switch',
};

export type InputForm = (
  StrInput
  | NumInput
  | FileInput
  | DateInput
  | SelectInput
  | CheckInput
  | RangeInput
);

export type FormType = {
  inputs: InputForm[];
  columns?: number,
  buttons: {
    label: string,
    onClick: (...params: any) => Promised<void>,
    type: 'primary' | 'secondary' | 'danger',
  }[];
};
