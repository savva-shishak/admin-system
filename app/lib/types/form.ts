import { Promised } from ".";

export type Input<ValueType = string> = {
  label: string;
  value: ValueType | null | undefined;
  name: string,
}

export type StrInput = Input & {
  type: 'str' | 'url' | 'email' | 'password',
}

export type RangeInput = Input & {
  type: 'range',
  step?: number,
  min?: number,
  max?: number,
}

export type NumInput = Input<number> & {
  type: 'num',
};

export type FileInput = Input & {
  type: 'file',
  accept?: string,
};

export type DateInput = Input<Date> & {
  type: 'date' | 'datetime' | 'time' | 'range',
};

export type DateRangeInput = Input<[Date | null, Date | null]> & {
  type: 'daterange',
  startText?: string,
  endText?: string,
  middleText?: string,
}

export type SelectInput = Input & {
  type: 'select',
  values: (string | { label: string, value: string })[],
};

export type MultiSelectInput = Input<string[]> & {
  type: 'multiselect',
  values: (string | { label: string, value: string })[],
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
  | SelectInput
  | MultiSelectInput
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
