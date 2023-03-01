import { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Drawer, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputAdornment, Radio, RadioGroup, Table as MUITable, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography } from '@material-ui/core';
import "./Table.scss"
import { JustFilter, TableFilter, TableSort, TableType } from "./types";
import LoadingPng from './loading.gif';
import { DateFilterForm, EnumFilterForm, NumberFilterForm, StringFilterForm } from "./filters";
import TuneIcon from '@material-ui/icons/Tune';
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage, Search, Update } from "@material-ui/icons";

export function Table<Data = any>({ columns, getData, itemRef }: TableType<Data>) {
  const [totalRows, setTotalRows] = useState(0);
  const [totalFiltredRows, setTotalFiltredRows] = useState(0);
  const [data, setData] = useState<Data[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TableFilter[]>([]);
  const [excludeNull, setExcludeNull] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState<string | number>(10);
  const [sort, setSort] = useState<TableSort[]>([]);
  const [loading, setLoading] = useState(false);

  const renderData = useCallback(async () => {
    setLoading(true);
    const { totalRows, totalFiltredRows, data } = await getData({
      limit: +limit,
      offset,
      sort,
      filter: [
        ...filter,
        ...excludeNull.map((columnKey) => ({
          columnKey,
          filter: { name: 'not-null' as 'not-null' }
        }))
      ],
      search,
    });
    setData(data);
    setTotalRows(totalRows);
    setTotalFiltredRows(totalFiltredRows);
    setLoading(false);
  }, [limit, offset, sort, filter, search, excludeNull]);

  const [overlayColumn, setOverlayColumn] = useState<string | null>(null);

  useEffect(() => {
    renderData();
  }, [renderData]);

  useEffect(() => {
    setOffset(0);
  }, [limit, totalFiltredRows]);

  useEffect(() => {
    if (itemRef) {
      itemRef.current = renderData;
    };    
  }, [])

  const inputFiltersProps = (columnKey: string) => {
    const column = columns.find(column => column.key === columnKey);
    const filterValue: any = filter.find(item => item.columnKey)?.filter;
    return ({
      value: (column?.type === "enum")
        ? (filterValue || { name: 'enum', filter: [], values: column.values })
        : filterValue as any,
      setValue: (value: JustFilter) => {
        setFilter(
          filter
            .filter(item => item.columnKey !== columnKey)
            .concat([{ columnKey: columnKey, filter: value }])
        );
      },
      onClear() {
        setFilter(filter.filter(item => item.columnKey !== columnKey));
      }
    })
  }

  const getSortRadio = (columnKey: string) => {
    const sortParam = sort.find((item) => item.columnKey === columnKey);

    if (sortParam) {
      return sortParam.desc ? 'desc' : 'asc'
    }

    return 'not';
  }

  const setSortRadio = (columnKey: string, value: 'not' | 'desc' | 'asc') => {
    setSort(
      sort
        .filter((item) => item.columnKey !== columnKey)
        .concat(value !== 'not'
          ? [{ columnKey, desc: value === 'desc' }]
          : []
        )
    )
  }

  return (
    <div className="table-container">
      <div className="table__header">
        <div className="table__settings">
          <form onSubmit={(e) => {
            e.preventDefault();
            setSearch((e.target as any).elements.search.value)
          }}>
            <TextField 
              name="search"
              label="Поиск"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </form>
          <IconButton onClick={renderData}>
            <Update />
          </IconButton>
        </div>
      </div>
      <div className="table__content">
        <MUITable>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} style={{ width: column.width }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    {column.title}
                    <IconButton
                      size="small"
                      color={(
                        sort.concat(filter as any).some(item => item.columnKey === column.key)
                        || excludeNull.includes(column.key)
                          ? "primary"
                          : "default"
                      )}
                      
                      onClick={() => setOverlayColumn(column.key)}
                    >
                      <TuneIcon />
                    </IconButton>
                    <Drawer
                      anchor="right"
                      open={overlayColumn === column.key}
                      onClose={() => setOverlayColumn(null)}
                    >
                      <div className="table__column-params">
                        <div className="table__prop">
                          <Typography variant="h5">
                            Параметры столбца <br/> "{column.title}""
                          </Typography>
                          <FormGroup>
                            <FormControl>
                              <FormLabel>Сотрировка</FormLabel>
                              <RadioGroup value={getSortRadio(column.key)} onChange={(e) => setSortRadio(column.key, e.target.value as any)}>
                                <FormControlLabel control={<Radio />} value="asc" label="от А до Я" />
                                <FormControlLabel control={<Radio />} value="desc" label="от Я до А" />
                                <FormControlLabel control={<Radio />} value="not" label="Нет" />
                              </RadioGroup>
                            </FormControl>
                            Фильтр
                            <FormControlLabel 
                              control={
                                <Checkbox
                                  checked={!excludeNull.includes(column.key)}
                                  onClick={() => {
                                    setExcludeNull(
                                      excludeNull.includes(column.key)
                                        ? excludeNull.filter(item => item !== column.key)
                                        : [...excludeNull, column.key]
                                    )
                                  }}
                                />
                              }
                              label="Показать пустые"
                              />
                            {['str', 'password'].includes(column.type) && (
                              <StringFilterForm {...inputFiltersProps(column.key)} />
                            )}
                            {column.type === 'num' && (
                              <NumberFilterForm {...inputFiltersProps(column.key)} />
                            )}
                            {column.type === 'date' && (
                              <DateFilterForm {...inputFiltersProps(column.key)} />
                            )}
                            {column.type === 'enum' && (
                              <EnumFilterForm {...inputFiltersProps(column.key)} />
                            )}
                          </FormGroup>
                        </div>
                      </div>
                    </Drawer>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {!loading && (
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key} style={{ width: column.width }}>
                      {column.render(item, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
          {loading
            && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', zIndex: +100 }}>
                <img style={{ height: 300 }} src={LoadingPng} alt="loading" />
              </div>
            )}
            <TableFooter>
            </TableFooter>
        </MUITable>
      </div>
      <div className="table__footer">
        Показывать строк: 
          <TextField 
            type="number"
            size="small"
            style={{ width: 50 }}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        <div>
          {offset + 1} - {Math.min(offset + +limit, totalFiltredRows)} из {totalFiltredRows}
        </div>
        <IconButton
          disabled={offset === 0}
          onClick={() => setOffset(0)}
        >
          <FirstPage />
        </IconButton>
        <IconButton
          disabled={offset === 0}
          onClick={() => setOffset(Math.max(offset - +limit, 0))}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          disabled={totalFiltredRows <= +offset + +limit}
          onClick={() => setOffset(offset + +limit)}
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          disabled={totalFiltredRows <= +offset + +limit}
          onClick={() => setOffset(totalFiltredRows - +limit)}
        >
          <LastPage />
        </IconButton>
      </div>
    </div>
  )
}