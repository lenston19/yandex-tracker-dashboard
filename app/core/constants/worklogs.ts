export const WORKLOG_COLUMNS = [
  {
    accessorKey: 'name',
    header: 'Наименование задачи'
  },
  {
    accessorKey: 'time',
    header: 'Потраченное время'
  },
  {
    accessorKey: 'dateCreatedAt',
    header: 'Дата'
  },
  {
    accessorKey: 'timeCreatedAt',
    header: 'Время'
  },
  {
    accessorKey: 'comment',
    header: 'Комментарий'
  }
]

export const GROUPED_WORKLOG_COLUMNS = [
  {
    id: 'expand'
  },
  {
    accessorKey: 'key',
    header: 'Задача'
  },
  {
    accessorKey: 'totalTime',
    header: 'Всего времени'
  }
]
