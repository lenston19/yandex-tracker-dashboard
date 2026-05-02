export const WORKLOG_COLUMNS = [
  {
    accessorKey: 'time',
    header: 'Время'
  },
  {
    accessorKey: 'dateCreatedAt',
    header: 'Дата'
  },
  {
    accessorKey: 'timeCreatedAt',
    header: 'Начало'
  },
  {
    accessorKey: 'comment',
    header: 'Комментарий'
  },
  {
    id: 'actions',
    header: 'Действия'
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
    id: 'name',
    header: 'Наименование'
  },
  {
    accessorKey: 'totalTime',
    header: 'Всего'
  }
]
