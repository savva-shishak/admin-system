import { Op, ModelStatic } from 'sequelize';
import { GetDataParams, JustFilter } from '../types';

export const sequlizeQueryByParams = (model: ModelStatic<any>, searchFields: string[], map: (v: any) => any = (v) => v) => async ({ sort, limit = 0, offset = 1, filter: arrayFilters, search }: GetDataParams) => {
  const allColumns = Array.from(new Set(arrayFilters.map((item) => item.columnKey)));

    const where: any = {
      [Op.or]: {
        ...searchFields.reduce((acc, field) => ({ ...acc, [field]: { [Op.like]: `%${search}%` } }), {}),
      },
      ...allColumns.reduce((acc, columnName) => ({
        ...acc,
        [columnName]: (
          arrayFilters
            .filter(({ columnKey }) => columnKey === columnName)
            .map(({ filter }) => filter).reduce((acc, filter: JustFilter) => {
              const res: any = {};
              if (filter.name === 'str' && filter.search) {
                res[Op.like] = `%${filter.search}%`;
              }
              if (filter.name === 'str' && filter.notInclude) {
                res[Op.notLike] = `%${filter.notInclude}%`;
              }
              if ((filter.name === 'num' && !isNaN(filter.to)) || (filter.name === 'date' && filter.to)) {
                res[Op.lte] = filter.to
              }
              if ((filter.name === 'num' && !isNaN(filter.from)) || (filter.name === 'date' && filter.from)) {
                res[Op.gte] = filter.from
              }
              if (filter.name === 'enum' && filter.filter.length) {
                res[Op.in] = filter.filter;
              }
              if (filter.name === 'not-null') {
                res[Op.not] = null;
              }
              return {
                ...acc,
                ...res,
              }
            }, {})
        ),
      }), {})
    };

    const [
      data,
      totalRows,
      totalFiltredRows,
    ] = await Promise.all([
      await model.findAll({
        limit,
        offset,
        where,
        order: sort.map(({ columnKey, desc }) => [columnKey, desc ? 'DESC' : 'ASC'])
      }).then((data) => data.map(map)),
      await model.count({ }),
      await model.count({ where }),
    ]);

    return {
      data,
      totalRows,
      totalFiltredRows,
    }
}