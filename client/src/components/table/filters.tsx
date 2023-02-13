import { Button, Form, Stack } from "react-bootstrap";
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
      <Stack direction="vertical" gap={2}>
        <Form.Group>
          <Form.Label>Искать:</Form.Label>
          <Form.Control value={search} onChange={(e) => setSearch(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Исключить:</Form.Label>
          <Form.Control value={notInclude} onChange={(e) => setNotInclude(e.target.value)} />
        </Form.Group>
        <Stack direction="horizontal" gap={1}>
          <Button size="sm" type="submit">Применить</Button>
          <Button size="sm" type="button" onClick={onClear}>Очистить</Button>
        </Stack>
      </Stack>
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
      <Stack direction="vertical" gap={2}>
        <Form.Group>
          <Form.Label>От:</Form.Label>
          <Form.Control type="number" onChange={(e) => setFrom(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>До:</Form.Label>
          <Form.Control type="number" onChange={(e) => setTo(e.target.value)} />
        </Form.Group>
        <Stack direction="horizontal" gap={1}>
          <Button size="sm" type="submit">Применить</Button>
          <Button size="sm" type="button" onClick={onClear}>Очистить</Button>
        </Stack>
      </Stack>
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
      <Stack direction="vertical" gap={2}>
        <Form.Group>
          <Form.Label>От:</Form.Label>
          <Form.Control type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>До:</Form.Label>
          <Form.Control type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </Form.Group>
        <Stack direction="horizontal" gap={1}>
          <Button size="sm" type="submit">Применить</Button>
          <Button size="sm" type="button" onClick={onClear}>Очистить</Button>
        </Stack>
      </Stack>
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
      <Stack direction="vertical" gap={2}>
      <Form.Group>
        <Form.Label>
          Выберите допустимые значения:
        </Form.Label>
        <Form.Select
          style={{ width: '100%' }}
          multiple
          onChange={({ target }) => {
            setFilter(Array.from(target.options).filter((opt) => opt.selected).map((opt) => opt.value))
          }}
        >
          {value.values?.map((item) => <option key={item} value={item}>{item}</option>)}
        </Form.Select>
      </Form.Group>
      <Stack direction="horizontal" gap={1}>
        <Button type="submit">Применить</Button>
        <Button type="button" onClick={onClear}>Очистить</Button>
      </Stack>
      </Stack>
    </form>
  );
}