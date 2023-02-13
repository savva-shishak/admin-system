import { Button, FormControl, InputLabel, Select, TextField } from "@material-ui/core";
import { useState } from "react";
import { StringFilter, NumberFilter, DateFilter, EnumFilter } from "./types";

export type StateValue<Data> = { value?: Data, setValue: (v: Data) => any, onClear: () => void }

export function StringFilterForm(
  {
    value = { name: 'str', search: '', notInclude: '' },
    setValue,
    onClear
  }: StateValue<StringFilter>
) {
  const [notInclude, setNotInclude] = useState<string>(value.notInclude);
  const [search, setSearch] = useState<string>(value.search);
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setValue({ name: 'str', search, notInclude })
    }}>
      <div style={{ display: 'flex', gap: 10, flexFlow: 'column' }}>
        <TextField label="Искать" value={search} onChange={(e) => setSearch(e.target.value)} />
        <TextField label="Исключить" value={notInclude} onChange={(e) => setNotInclude(e.target.value)} />
        <div style={{ display: 'flex', gap: 10 }}>
          <Button size="small" type="submit">Применить</Button>
          <Button size="small" type="button" onClick={onClear}>Очистить</Button>
        </div>
      </div>
    </form>
  );
}

export function NumberFilterForm(
  {
    value = { name: 'num', from: 0, to: 0 },
    setValue,
    onClear
  }: StateValue<NumberFilter>
) {
  const [from, setFrom] = useState<string>(value.from + '');
  const [to, setTo] = useState<string>(value.to + '');
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setValue({ name: 'num', to: +to, from: +from })
    }}>
      <div style={{ display: 'flex', gap: 10, flexFlow: 'column' }}>
        <TextField label="От" type="number" onChange={(e) => setFrom(e.target.value)} />
        <TextField label="До" type="number" onChange={(e) => setTo(e.target.value)} />
        <div style={{ display: 'flex', gap: 10 }}>
          <Button size="small" type="submit">Применить</Button>
          <Button size="small" type="button" onClick={onClear}>Очистить</Button>
        </div>
      </div>
    </form>
  );
}

export function DateFilterForm(
  {
    value = { name: 'date', from: new Date(), to: new Date() },
    setValue,
    onClear
  }: StateValue<DateFilter>
) {
  const [from, setFrom] = useState<string>(value.from + '');
  const [to, setTo] = useState<string>(value.to + '');
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setValue({ name: 'date', to: new Date(from), from: new Date(to) })
    }}>
      <div style={{ display: 'flex', gap: 10, flexFlow: 'column' }}>
        <TextField label="От" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <TextField label="До" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <div style={{ display: 'flex', gap: 10 }}>
          <Button size="small" type="submit">Применить</Button>
          <Button size="small" type="button" onClick={onClear}>Очистить</Button>
        </div>
      </div>
    </form>
  );
}

export function EnumFilterForm(
  {
    value = {
      name: 'enum',
      filter: [],
      values: ['item 1', 'item 2'],
    },
    setValue,
    onClear
  }: StateValue<EnumFilter>
) {
  const [filter, setFilter] = useState(value.filter);
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setValue({ ...value, filter })
    }}>
      <div style={{ display: 'flex', gap: 10, flexFlow: 'column' }}>

        <FormControl>
          <InputLabel>
            Выберите допустимые значения:
          </InputLabel>
          <Select
            style={{ width: '100%' }}
            multiple
            onChange={({ target }) => {
              setFilter((target.value as string).split(','));
            }}
          >
            {value.values?.map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
        </FormControl>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button type="submit">Применить</Button>
          <Button type="button" onClick={onClear}>Очистить</Button>
        </div>
      </div>
    </form>
  );
}