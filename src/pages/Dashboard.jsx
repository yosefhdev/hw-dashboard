/* eslint-disable no-unused-vars */
import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';

import { Moon, Sun, Home, Car, PenSquare, BarChart2, Settings, Search, Plus, Edit, Trash2, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toast } from "@/components/ui/toast"
import { Bar, Pie } from 'react-chartjs-2'
import { Checkbox } from "@/components/ui/checkbox"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

// Tema context
const ThemeContext = createContext({ isDark: false, toggleTheme: () => { } })

const initialCars = [
    { id: 1, brand: 'Toyota', model: 'Corolla', version: 'LE', year: 2022, color: 'Blanco', type: 'Básico', addedDate: '2023-01-15' },
    { id: 2, brand: 'Honda', model: 'Civic', version: 'Touring', year: 2023, color: 'Azul', type: 'Premium', addedDate: '2023-02-20' },
    { id: 3, brand: 'Ford', model: 'Mustang', version: 'GT', year: 2021, color: 'Rojo', type: 'Premium', addedDate: '2023-03-10' },
    { id: 4, brand: 'Chevrolet', model: 'Spark', version: 'LT', year: 2022, color: 'Verde', type: 'Básico', addedDate: '2023-04-05' },
    { id: 5, brand: 'Nissan', model: 'Sentra', version: 'SV', year: 2023, color: 'Gris', type: 'Básico', addedDate: '2023-05-12' },
]

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [cars, setCars] = useState(initialCars)
    const [activeTab, setActiveTab] = useState('home')
    const [isDark, setIsDark] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCar, setSelectedCar] = useState(null)
    const [isAddingCar, setIsAddingCar] = useState(false)
    const [newCar, setNewCar] = useState({ brand: '', model: '', version: '', year: '', color: '', type: '' })
    const [toast, setToast] = useState({ message: '', visible: false })
    const [filters, setFilters] = useState({ brands: [], years: [], types: [], colors: [] })

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    useEffect(() => {
        document.body.className = isDark ? 'dark' : 'light'
    }, [isDark])

    const filteredCars = cars.filter(car =>
        (searchTerm === '' || Object.values(car).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )) &&
        (filters.brands.length === 0 || filters.brands.includes(car.brand)) &&
        (filters.years.length === 0 || filters.years.includes(car.year.toString())) &&
        (filters.types.length === 0 || filters.types.includes(car.type)) &&
        (filters.colors.length === 0 || filters.colors.includes(car.color))
    )

    const addCar = () => {
        const id = cars.length + 1
        const addedDate = new Date().toISOString().split('T')[0]
        setCars([...cars, { ...newCar, id, addedDate }])
        setNewCar({ brand: '', model: '', version: '', year: '', color: '', type: '' })
        setIsAddingCar(false)
        showToast('Auto agregado con éxito')
    }

    const deleteCar = (id) => {
        setCars(cars.filter(car => car.id !== id))
        setSelectedCar(null)
        showToast('Auto eliminado con éxito')
    }

    const showToast = (message) => {
        setToast({ message, visible: true })
        setTimeout(() => setToast({ message: '', visible: false }), 3000)
    }

    const carTypes = ['Básico', 'Premium']
    const carsByType = carTypes.map(type => cars.filter(car => car.type === type).length)
    const carsByYear = Object.entries(cars.reduce((acc, car) => {
        acc[car.year] = (acc[car.year] || 0) + 1
        return acc
    }, {})).sort((a, b) => a[0] - b[0])
    const carsByBrand = Object.entries(cars.reduce((acc, car) => {
        acc[car.brand] = (acc[car.brand] || 0) + 1
        return acc
    }, {})).sort((a, b) => b[1] - a[1])

    const uniqueBrands = [...new Set(cars.map(car => car.brand))]
    const uniqueYears = [...new Set(cars.map(car => car.year))]
    const uniqueColors = [...new Set(cars.map(car => car.color))]

    const handleFilterChange = (filterType, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: prevFilters[filterType].includes(value)
                ? prevFilters[filterType].filter(item => item !== value)
                : [...prevFilters[filterType], value]
        }))
    }

    // ----------------------------------------------------------------

    useEffect(() => {
        // Obtener la información del usuario actual
        const getCurrentUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        getCurrentUser();
    }, []);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error.message);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <div className={`min-h-screen ${isDark ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
                <header className="bg-white dark:bg-gray-800 shadow-md">
                    <div className="container mx-auto px-4 py-4">
                        <h1 className="text-2xl font-bold">{
                            activeTab === 'home' ? 'Dashboard de Autos' :
                                activeTab === 'add' ? 'Agregar Nuevo Auto' :
                                    activeTab === 'stats' ? 'Estadísticas' :
                                        'Configuración'
                        }</h1>
                    </div>
                </header>

                <main className="container mx-auto p-4 pb-20">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsContent value="home" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total de Autos</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">{cars.length}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Autos Básicos</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">{carsByType[0]}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Autos Premium</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">{carsByType[1]}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-4">
                                <Input
                                    type="search"
                                    placeholder="Buscar autos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-grow"
                                />
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtros</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Filtros</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="mb-2 font-semibold">Marca</h3>
                                                {uniqueBrands.map(brand => (
                                                    <div key={brand} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`brand-${brand}`}
                                                            checked={filters.brands.includes(brand)}
                                                            onCheckedChange={() => handleFilterChange('brands', brand)}
                                                        />
                                                        <label htmlFor={`brand-${brand}`}>{brand}</label>
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                <h3 className="mb-2 font-semibold">Año</h3>
                                                {uniqueYears.map(year => (
                                                    <div key={year} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`year-${year}`}
                                                            checked={filters.years.includes(year.toString())}
                                                            onCheckedChange={() => handleFilterChange('years', year.toString())}
                                                        />
                                                        <label htmlFor={`year-${year}`}>{year}</label>
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                <h3 className="mb-2 font-semibold">Tipo</h3>
                                                {carTypes.map(type => (
                                                    <div key={type} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`type-${type}`}
                                                            checked={filters.types.includes(type)}
                                                            onCheckedChange={() => handleFilterChange('types', type)}
                                                        />
                                                        <label htmlFor={`type-${type}`}>{type}</label>
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                <h3 className="mb-2 font-semibold">Color</h3>
                                                {uniqueColors.map(color => (
                                                    <div key={color} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`color-${color}`}
                                                            checked={filters.colors.includes(color)}
                                                            onCheckedChange={() => handleFilterChange('colors', color)}
                                                        />
                                                        <label htmlFor={`color-${color}`}>{color}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Imagen</TableHead>
                                            <TableHead>Marca</TableHead>
                                            <TableHead>Modelo</TableHead>
                                            <TableHead>Año</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Color</TableHead>
                                            <TableHead>Fecha de Adición</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCars.map((car) => (
                                            <TableRow key={car.id}>
                                                <TableCell>
                                                    <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-12 h-12 object-cover rounded" />
                                                </TableCell>
                                                <TableCell>{car.brand}</TableCell>
                                                <TableCell>{car.model}</TableCell>
                                                <TableCell>{car.year}</TableCell>
                                                <TableCell>{car.type}</TableCell>
                                                <TableCell>{car.color}</TableCell>
                                                <TableCell>{car.addedDate}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedCar(car)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => deleteCar(car.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="add">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{isAddingCar ? 'Agregar Nuevo Auto' : 'Editar Auto'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => { e.preventDefault(); addCar(); }} className="space-y-4">
                                        <Input
                                            placeholder="Marca"
                                            value={newCar.brand}
                                            onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                                            required
                                        />
                                        <Input
                                            placeholder="Modelo"
                                            value={newCar.model}
                                            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                                            required
                                        />
                                        <Input
                                            placeholder="Versión"
                                            value={newCar.version}
                                            onChange={(e) => setNewCar({ ...newCar, version: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Año"
                                            type="number"
                                            value={newCar.year}
                                            onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                                            required
                                        />
                                        <Input
                                            placeholder="Color"
                                            value={newCar.color}
                                            onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
                                            required
                                        />
                                        <Select onValueChange={(value) => setNewCar({ ...newCar, type: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Básico">Básico</SelectItem>
                                                <SelectItem value="Premium">Premium</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button type="submit">
                                            {isAddingCar ? 'Agregar Auto' : 'Guardar Cambios'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="stats" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Distribución por Tipo</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Pie
                                            data={{
                                                labels: carTypes,
                                                datasets: [{
                                                    data: carsByType,
                                                    backgroundColor: ['#3b82f6', '#ef4444'],
                                                }],
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Autos por Año</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Bar
                                            data={{
                                                labels: carsByYear.map(([year]) => year),
                                                datasets: [{
                                                    label: 'Cantidad de Autos',
                                                    data: carsByYear.map(([, count]) => count),
                                                    backgroundColor: '#3b82f6',
                                                }],
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Autos por Marca</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Bar
                                            data={{
                                                labels: carsByBrand.map(([brand]) => brand),
                                                datasets: [{
                                                    label: 'Cantidad de Autos',
                                                    data: carsByBrand.map(([, count]) => count),
                                                    backgroundColor: '#10b981',
                                                }],
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>

                <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-around items-center h-16">
                            <Button variant="ghost" size="icon" onClick={() => setActiveTab('home')}>
                                <Home className={`h-6 w-6 ${activeTab === 'home' ? 'text-blue-500' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => { setActiveTab('add'); setIsAddingCar(true); }}>
                                <PenSquare className={`h-6 w-6 ${activeTab === 'add' ? 'text-blue-500' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setActiveTab('stats')}>
                                <BarChart2 className={`h-6 w-6 ${activeTab === 'stats' ? 'text-blue-500' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setActiveTab('settings')}>
                                <Settings className={`h-6 w-6 ${activeTab === 'settings' ? 'text-blue-500' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={toggleTheme}>
                                {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </nav>

                <Dialog open={selectedCar !== null} onOpenChange={() => setSelectedCar(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Detalles del Auto</DialogTitle>
                        </DialogHeader>
                        {selectedCar && (
                            <div className="space-y-2">
                                <img src={selectedCar.image} alt={`${selectedCar.brand} ${selectedCar.model}`} className="w-full h-48 object-cover rounded mb-4" />
                                <p><strong>Marca:</strong> {selectedCar.brand}</p>
                                <p><strong>Modelo:</strong> {selectedCar.model}</p>
                                <p><strong>Versión:</strong> {selectedCar.version}</p>
                                <p><strong>Año:</strong> {selectedCar.year}</p>
                                <p><strong>Color:</strong> {selectedCar.color}</p>
                                <p><strong>Tipo:</strong> {selectedCar.type}</p>
                                <p><strong>Fecha de Adición:</strong> {selectedCar.addedDate}</p>
                                <div className="flex justify-end space-x-2 mt-4">
                                    <Button onClick={() => { setActiveTab('add'); setNewCar(selectedCar); setSelectedCar(null); }}>
                                        Editar
                                    </Button>
                                    <Button variant="destructive" onClick={() => deleteCar(selectedCar.id)}>
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {toast.visible && (
                    <Toast className="fixed bottom-20 right-4">
                        {toast.message}
                    </Toast>
                )}
            </div>
        </ThemeContext.Provider>
    );
}

export default Dashboard;