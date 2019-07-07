export interface TableListItem {
  id?: string | number;
  key?: string | number;
  disabled?: boolean;
  [name: string]: any;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  pagination: Partial<TableListPagination>;
  data: any;
  sorter?: string;
  status?: string;
  name?: string;
  pageSize?: number;
  currentPage?: number;
}
