'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DataTable } from '@/components/ui/DataTable'
import { Modal } from '@/components/ui/Modal'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import {
    useGetItemTypesQuery,
    useCreateItemTypeMutation,
    useUpdateItemTypeMutation,
    useDeleteItemTypeMutation,
} from '@/lib/features/api/itemTypes.api'

interface ItemType {
    id: string
    name: string
}

export default function ItemTypesPage() {
    const { data, isLoading } = useGetItemTypesQuery(undefined)
    const [createItemType] = useCreateItemTypeMutation()
    const [updateItemType] = useUpdateItemTypeMutation()
    const [deleteItemType] = useDeleteItemTypeMutation()

    const itemTypes = data?.itemTypes || []

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingType, setEditingType] = useState<ItemType | null>(null)
    const [name, setName] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            if (editingType) {
                await updateItemType({ id: editingType.id, name }).unwrap()
            } else {
                await createItemType({ name }).unwrap()
            }

            setIsModalOpen(false)
            setName('')
            setEditingType(null)
        } catch (error) {
            console.error('Error saving item type:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return

        try {
            await deleteItemType(id).unwrap()
        } catch (error) {
            console.error('Error deleting item type:', error)
        }
    }

    const handleEdit = (type: ItemType) => {
        setEditingType(type)
        setName(type.name)
        setIsModalOpen(true)
    }

    const columns = [
        { key: 'name', label: 'Item Type' },
        {
            key: 'actions',
            label: 'Actions',
            render: (type: ItemType) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(type)}>
                        <FiEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(type.id)}>
                        <FiTrash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ]

    if (isLoading) {
        return <div className="flex justify-center py-12">Loading...</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Item Types</h1>
                    <p className="text-gray-600 mt-1">Manage product types</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingType(null)
                        setName('')
                        setIsModalOpen(true)
                    }}
                >
                    <FiPlus className="h-4 w-4 mr-2" />
                    Add Item Type
                </Button>
            </div>

            <DataTable data={itemTypes} columns={columns} keyExtractor={(t) => t.id} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingType ? 'Edit Item Type' : 'Add Item Type'}
            >
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Item Type Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <div className="mt-4">
                        <Button type="submit">{editingType ? 'Save' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
