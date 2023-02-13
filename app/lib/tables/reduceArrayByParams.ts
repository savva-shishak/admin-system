import moment from "moment";
import { GetDataParams } from "../types";

export const reduceArrayByParams = <Data extends object>(getData: () => Data[]) => async (params: GetDataParams) => {
  const { search, filter: filterArray, limit, offset, sort } = params;
  const allData = getData();
  const data = allData
    .filter((item: any) => {
      if (!search) {
        return true;
      }
      for (const key of Object.keys(item)) {
        const value = item[key];
        if (typeof value === 'string' && value.includes(search)) {
          return true;
        }
        if (typeof value === 'number' && ('' + value).includes(search)) {
          return true;
        }
      }
      return false;
    })
    .filter((item: any) => {
      for (const { columnKey, filter } of filterArray) {
        const value = item[columnKey];

        if (!value && value !== 0 && value !== '0') {
          if (filter.name === 'not-null') {
            return false;
          } else {
            continue; 
          }
        }

        if (filter.name === 'str' && (!value.includes(filter.search) || (!!filter.notInclude || value.includes(filter.notInclude)))) {
          return false;
        }
        if (filter.name === 'num' && ((!filter.from || value < filter.from) || (!filter.to || value > filter.to))) {
          return false;
        }
        if (filter.name === 'date' && ((!filter.from || moment(value).isAfter(filter.from)) || (!filter.to || moment(value).isBefore(filter.to)))) {
          return false;
        }
        if (filter.name === 'enum' && (!filter.filter.length || !filter.filter.includes(value))) {
          return false;
        }
      }
      return true;
    })
    .sort((a: any, b: any) => {      
      for (const { columnKey, desc } of sort) {
        if (a[columnKey] === b[columnKey]) {
          continue;
        } else {
          return (((a[columnKey] < b[columnKey]) || !a[columnKey]) ? -1 : 1) * (desc ? -1 : 1);
        }
      }

      return 0;
    })

  return {
    data: data
      .filter((_, id) => id >= offset)
      .filter((_, id) => id < limit),
    totalRows: allData.length,
    totalFiltredRows: data.length,
  };
}