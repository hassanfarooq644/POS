'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DataTable } from '@/components/ui/DataTable'
import { Modal } from '@/components/ui/Modal'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'

interface Category {
    id: string
    name: string
    createdAt: string
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [name, setName] = useState('')

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data.categories || [])
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            if (editingCategory) {
                await fetch(`/api/categories/${editingCategory.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                })
            } else {
                await fetch('/api/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                })
            }

            fetchCategories()
            setIsModalOpen(false)
            setName('')
            setEditingCategory(null)
        } catch (error) {
            console.error('Error saving category:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return

        try {
            await fetch(`/api/categories/${id}`, { method: 'DELETE' })
            fetchCategories()
        } catch (error) {
            console.error('Error deleting category:', error)
        }
    }

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setName(category.name)
        setIsModalOpen(true)
    }

    const columns = [
        { key: 'name', label: 'Category Name' },
        {
            key: 'actions',
            label: 'Actions',
            render: (category: Category) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                        <FiEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(category.id)}>
                        <FiTrash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-1">Manage product categories</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingCategory(null)
                        setName('')
                        setIsModalOpen(true)
                    }}
                >
                    <FiPlus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <DataTable data={categories} columns={columns} keyExtractor={(c) => c.id} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Edit Category' : 'Add Category'}
            >
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <div className="mt-4">
                        <Button type="submit">{editingCategory ? 'Save' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
