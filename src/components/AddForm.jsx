/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/db/supabase"
import { motion } from 'framer-motion'
import { Calendar, Car, Palette, PenSquare, Plus, Tag } from 'lucide-react'
import { useEffect, useState } from "react"

function AddForm({ setNotification, errors, setErrors, setActiveTab, validateCar }) {

    const [newCar, setNewCar] = useState({ brand: '', model: '', version: '', year: '', color: '#000000', type: '', addedDate: new Date(), image: '' })
    const [marcas, setMarcas] = useState()
    const [marcaToAdd, setMarcaToAdd] = useState()
    const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false)

    useEffect(() => {
        getMarcas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const addCar = async () => {
        const newErrors = validateCar(newCar)
        if (Object.keys(newErrors).length === 0) {

            const { data, error } = await supabase
                .from('cars')
                .insert([
                    { created_at: new Date() },
                    { marca: newCar.brand },
                    { modelo: newCar.model },
                    { version: newCar.version },
                    { anio: newCar.year },
                    { color: newCar.color },
                    { image: newCar.image }
                ])
                .select()

            if (data && data.length > 0) {
                setNotification({ message: 'Coche añadido con éxito', success: true })
                setNewCar({ brand: '', model: '', version: '', year: '', color: '#000000', type: '', addedDate: new Date(), image: '' })
                setActiveTab('home')
            }

            if (error) {
                setNotification({ message: 'Error al añador coche', success: false })
            }
        } else {
            setErrors(newErrors)
        }
    }

    const getMarcas = async () => {
        try {
            let { data: marcas, error } = await supabase
                .from('marcas')
                .select('*')

            if (marcas) {
                setMarcas(marcas)
            } else {
                setMarcas(null)
            }

            if (error) {
                console.log("Error al obtener marcas: " + error)
            }
        } catch (e) {
            setNotification({ message: 'No se puedieron obtener las marcas: ' + e, success: false })
        }
    }

    const addMarca = async () => {

        try {
            const { data, error } = await supabase
                .from('marcas')
                .insert([
                    { marca: marcaToAdd },
                ])
                .select()
            console.log("🚀 ~ addMarca ~ data:", data)
            if (data) {
                setIsAddBrandModalOpen(false)
                setNotification({ message: 'Marca añadida con éxito', success: true })
                getMarcas()
            } else {
                setNotification({ message: 'La marca no se puso agregar: ' + error, success: true })
            }

        } catch (e) {
            setNotification({ message: 'No se pudo agregar la marca: ' + e, success: false })
        }

    }



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Agregar Nuevo Auto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); addCar(); }} className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4" />
                            {/* <Input
                                placeholder="Marca"
                                value={newCar.brand}
                                onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                                required
                            /> */}
                            <Select
                                onValueChange={(value) => setNewCar({ ...newCar, brand: value })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Mapear las marcas obtenidas */}
                                    {marcas ? marcas.map((marca) => (
                                        <SelectItem key={marca.id} value={marca.marca}>
                                            {marca.marca}
                                        </SelectItem>
                                    )) : (
                                        <SelectItem value="0">
                                            Sin Marcas
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <Button type="button" onClick={() => setIsAddBrandModalOpen(true)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
                        <div className="flex items-center space-x-2">
                            <PenSquare className="h-4 w-4" />
                            <Input
                                placeholder="Modelo"
                                value={newCar.model}
                                onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                                required
                            />
                        </div>
                        {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
                        <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4" />
                            <Input
                                placeholder="Versión"
                                value={newCar.version}
                                onChange={(e) => setNewCar({ ...newCar, version: e.target.value })}
                                required
                            />
                        </div>
                        {errors.version && <p className="text-red-500 text-sm">{errors.version}</p>}
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <Input
                                placeholder="Año"
                                type="number"
                                value={newCar.year}
                                onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Palette className="h-4 w-4" />
                            <Input
                                type="color"
                                value={newCar.color}
                                onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
                                required
                            />
                        </div>
                        {errors.color && <p className="text-red-500 text-sm">{errors.color}</p>}
                        <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4" />
                            <Select onValueChange={(value) => setNewCar({ ...newCar, type: value })} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Básico">Básico</SelectItem>
                                    <SelectItem value="Premium">Premium</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                        <div className="flex items-center space-x-2">
                            <Input
                                placeholder="URL de la imagen"
                                value={newCar.image}
                                onChange={(e) => setNewCar({ ...newCar, image: e.target.value })}
                                required
                            />
                        </div>
                        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                        <Button type="submit">
                            <Plus className="mr-2 h-4 w-4" /> Agregar Auto
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Dialog open={isAddBrandModalOpen} onOpenChange={setIsAddBrandModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Añadir Nueva Marca</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); addMarca(); }} className="space-y-4">
                        <div>
                            <Label htmlFor="new-brand">Nombre de la Marca</Label>
                            <Input
                                id="new-brand"
                                value={marcaToAdd}
                                onChange={(e) => setMarcaToAdd(e.target.value)}
                                placeholder="Ingrese el nombre de la nueva marca"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Añadir Marca</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}

export default AddForm;