import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '../components/ui/checkbox'
import { Button } from '../components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'

// Generic columns definition
export const generateColumns = <T extends { id: number; title?: string; name?: string }>(
	contentType: 'posts' | 'comments'
): ColumnDef<T>[] => [
	{
		accessorFn: row => row.id,
		id: 'id',
		header: () => <div className="text-center mx-1 sm:mx-4 w-12 sm:w-[100px]">ID</div>,
		cell: ({ getValue }) => (
			<div className="text-center mx-4 w-12 sm:w-[100px]">{String(getValue())}</div> // Ensure getValue() is a string
		),
	},
	{
		accessorFn: row => (contentType === 'posts' ? row.title : row.name) || 'N/A',
		id: contentType === 'posts' ? 'title' : 'name',
		header: () => (
			<div className="text-start mx-1 sm:mx-4">{contentType === 'posts' ? 'Title' : 'Name'}</div>
		),
		cell: ({ getValue }) => (
			<div className="text-start mx-1 sm:mx-4">{String(getValue())}</div> // Ensure getValue() is a string
		),
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const item = row.original
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id.toString())}>
							Copy ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(item.title || item.name || 'No content')}
						>
							Copy Title/Name
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
