'use client'

import * as React from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

import {
	ColumnDef,
	ColumnFiltersState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
	getPaginationRowModel,
	SortingState,
	getSortedRowModel,
} from '@tanstack/react-table'

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../components/ui/table'

type DataTableProps<T> = {
	data: T[]
	columns: ColumnDef<T>[]
}

export const DataTable = <T,>({ data, columns }: DataTableProps<T>) => {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})

	const [filterText, setFilterText] = React.useState('')

	// Define a custom filter function for text input filtering
	const filteredData = React.useMemo(() => {
		if (!filterText) return data // If no filter text, return the data as is

		console.log('Filter Text:', filterText) // Log the filter text
		console.log('Data:', data) // Log the raw data

		return data.filter((row: any) => {
			// Log the row and available keys for better debugging
			console.log('Row:', row)
			console.log('Row Keys:', Object.keys(row))

			// Find the column to filter by (either title or name)
			const filterColumn = columns.find(column => column.id === 'title' || column.id === 'name')

			// Log the filterColumn to see if it's correctly defined
			console.log('filterColumn:', filterColumn)

			// Ensure filterColumn and row[filterColumn.id] are defined before proceeding
			if (filterColumn && filterColumn.id && row[filterColumn.id] !== undefined) {
				const cellValue = row[filterColumn.id]?.toString().toLowerCase() || ''
				return cellValue.includes(filterText.toLowerCase()) // Case-insensitive filtering
			} else {
				console.log('Condition not met for filterColumn or row[filterColumn.id]')
			}

			return true
		})
	}, [data, columns, filterText])

	// Set up table with sorting, filtering, etc.
	const table = useReactTable({
		data: filteredData, // Use filtered data
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	return (
		<div>
			<div className="flex items-center py-4">
				{/* Filter Input for title or name */}
				<Input
					placeholder="Filter by title or name..."
					value={filterText}
					onChange={event => setFilterText(event.target.value)}
					className="max-w-sm"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter(column => column.getCanHide())
							.map(column => (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={value => column.toggleVisibility(!!value)}
								>
									{column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	)
}
