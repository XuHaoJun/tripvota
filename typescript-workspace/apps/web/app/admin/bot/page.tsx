'use client';

import { useState } from 'react';

import { List } from '@refinedev/antd';
import type { CrudFilter } from '@refinedev/core';
import { Table } from 'antd';

import { useBotList } from '@/hooks/bot/use-bot-list';

export default function BotListPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);

  const filters: CrudFilter[] = [
    ...(searchText
      ? [
          {
            field: 'name',
            operator: 'contains' as const,
            value: searchText,
          } as CrudFilter,
        ]
      : []),
    ...(statusFilter !== undefined
      ? [
          {
            field: 'isActive',
            operator: 'eq' as const,
            value: statusFilter,
          } as CrudFilter,
        ]
      : []),
  ];

  const { tableProps } = useBotList({
    filters,
    sorters: [
      {
        field: 'updatedAt',
        order: 'desc',
      },
    ],
    pagination: {
      pageSize: 20,
    },
  });

  return (
    <div className="container mx-auto p-6">
      <List
        headerProps={{
          title: 'Bots',
        }}
      >
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search by name or display name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <select
            value={statusFilter === undefined ? 'all' : statusFilter ? 'active' : 'inactive'}
            onChange={(e) => {
              const value = e.target.value;
              setStatusFilter(value === 'all' ? undefined : value === 'active');
            }}
            className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="relative">
          {tableProps.loading && (
            <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          )}
          {tableProps.dataSource?.length === 0 && !tableProps.loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No bots found in your realm.</p>
              <p className="text-muted-foreground mt-2 text-sm">Create your first bot to get started.</p>
            </div>
          ) : (
            <Table
              {...tableProps}
              rowKey="id"
              loading={false}
              className="rounded-md border"
              pagination={{
                ...tableProps.pagination,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bots`,
              }}
            >
              <Table.Column
                dataIndex="displayName"
                title="Display Name"
                render={(value, record: any) => (
                  <div>
                    <div className="font-medium">{value}</div>
                    <div className="text-muted-foreground text-sm">{record.name}</div>
                  </div>
                )}
              />
              <Table.Column
                dataIndex="isActive"
                title="Status"
                render={(value: boolean) => (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      value
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {value ? 'Active' : 'Inactive'}
                  </span>
                )}
              />
              <Table.Column
                dataIndex="createdAt"
                title="Created At"
                render={(value: string) => new Date(value).toLocaleDateString()}
              />
            </Table>
          )}
        </div>
      </List>
    </div>
  );
}
