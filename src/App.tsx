import React, { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Skeleton } from './components/ui/skeleton'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './components/ui/select'
import { useToast } from './hooks/use-toast'
import { Card } from './components/ui/card'

import axios from 'axios'
import { DataTable } from './data-table/data-table'
import { generateColumns } from './data-table/columns'
import { Button } from './components/ui/button'

const FormSchema = z.object({
	content_type: z.string({
		required_error: 'Please select a content type to display.',
	}),
})

export type commentsType = {
	postId: number
	id: number
	name: string
	email: string
	body: string
}

export type postType = {
	userId: number
	id: number
	title: string
	body: string
}

const App: React.FC = () => {
	const [postData, setPostData] = useState<postType[] | commentsType[] | null>(null)
	const [contentType, setContentType] = useState<'posts' | 'comments'>('posts')
	const [loading, setLoading] = useState<boolean>(false)

	const { toast } = useToast()
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			content_type: 'posts',
		},
	})

	const fetchData = async (type: 'posts' | 'comments') => {
		setLoading(true)
		try {
			const res = await axios.get(`https://jsonplaceholder.typicode.com/${type}`)
			setPostData(res.data)
		} catch (error) {
			console.error('Error fetching postData:', error)
		}
		setLoading(false)
	}

	useEffect(() => {
		fetchData(contentType)
	}, [contentType])

	const handleSelectChange = (value: 'posts' | 'comments') => {
		setContentType(value)
	}

	function onSubmit(formData: z.infer<typeof FormSchema>) {
		toast({
			title: 'You submitted the following values:',
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(formData, null, 2)}</code>
				</pre>
			),
		})
	}

	return (
		<div className="bg-primary-foreground min-h-screen">
			<h1 className="text-3xl py-4 px-10 bg-white border-b shadow-sm">Dynamic Content Manager</h1>
			<div className="space-y-4">
				<p className="m-4 px-6 bg-white font-bold py-4">Fetch Content</p>
				<div className="mx-4">
					<Card className="py-4 px-6 max-w-sm">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-40">
								<FormField
									control={form.control}
									name="content_type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Select Content Type</FormLabel>
											<Select
												onValueChange={value => handleSelectChange(value as 'posts' | 'comments')}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select Content Type" />
													</SelectTrigger>
												</FormControl>
												<FormMessage />
												<SelectContent>
													<SelectItem value="posts">Posts</SelectItem>
													<SelectItem value="comments">Comments</SelectItem>
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
							</form>
						</Form>
					</Card>
				</div>
				<Card className="mx-4 py-6 px-10 bg-white">
					<p className="font-bold mb-4">Displaying Content</p>
					{!loading ? (
						postData && (
							<DataTable
								data={postData as (postType | commentsType)[]}
								columns={generateColumns<(typeof postData)[0]>(contentType)}
							/>
						)
					) : (
						<p>loading data...</p>
					)}
					<div className="w-full flex justify-center items-center">
						<Button
							className="mx-auto bg-blue-500/70 hover:bg-blue-500/80 text-black"
							onClick={() => {
								if (postData) {
									const blob = new Blob([JSON.stringify(postData, null, 2)], {
										type: 'application/json',
									})
									const url = URL.createObjectURL(blob)
									const a = document.createElement('a')
									a.href = url
									a.download = `${contentType}-data.json`
									document.body.appendChild(a)
									a.click()
									document.body.removeChild(a)
									URL.revokeObjectURL(url)
								} else {
									toast({
										title: 'No data available to download',
										description: 'Please fetch some data before downloading.',
									})
								}
							}}
						>
							Download
						</Button>
					</div>
				</Card>
			</div>
		</div>
	)
}

export default App
