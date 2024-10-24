/* eslint-disable no-unused-vars */
import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';

import { Moon, Sun, Home, Car, PenSquare, BarChart2, Link, Search, Filter, Calendar, Palette, Tag, Clock, Plus, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown, CarFront, Sparkles, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toast, ToastProvider, ToastTitle } from "@/components/ui/toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from 'framer-motion'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import Header from '@/components/Header';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

// Tema context
const ThemeContext = createContext({ isDark: false, toggleTheme: () => { } })

// Datos de ejemplo
const initialCars = [
    { id: 1, brand: 'Toyota', model: 'Corolla', version: 'LE', year: 2022, color: '#FFFFFF', type: 'Básico', addedDate: '2023-01-15', image: 'https://example.com/toyota-corolla.jpg' },
    { id: 2, brand: 'Honda', model: 'Civic', version: 'Touring', year: 2023, color: '#0000FF', type: 'Premium', addedDate: '2023-02-20', image: 'https://example.com/honda-civic.jpg' },
    { id: 3, brand: 'Ford', model: 'Mustang', version: 'GT', year: 2021, color: '#FF0000', type: 'Premium', addedDate: '2023-03-10', image: 'https://img.remediosdigitales.com/473795/ford-mustang-shelby-gt500-mexico_/840_560.jpg' },
    { id: 4, brand: 'Chevrolet', model: 'Spark', version: 'LT', year: 2022, color: '#00FF00', type: 'Básico', addedDate: '2023-04-05', image: 'https://example.com/chevrolet-spark.jpg' },
    { id: 5, brand: 'Nissan', model: 'Sentra', version: 'SV', year: 2023, color: '#808080', type: 'Básico', addedDate: '2023-05-12', image: 'https://example.com/nissan-sentra.jpg' },
    { id: 6, brand: 'Mazda', model: '3', version: 'Sedan', year: 2021, color: '#FF5733', type: 'Premium', addedDate: '2023-06-08', image: 'https://example.com/mazda-3.jpg' },
    { id: 7, brand: 'Subaru', model: 'Impreza', version: 'WRX', year: 2020, color: '#1C1C1C', type: 'Premium', addedDate: '2023-07-01', image: 'https://example.com/subaru-impreza.jpg' },
    { id: 8, brand: 'Volkswagen', model: 'Jetta', version: 'GLI', year: 2022, color: '#3333FF', type: 'Básico', addedDate: '2023-08-12', image: 'https://example.com/volkswagen-jetta.jpg' },
    { id: 9, brand: 'Tesla', model: 'Model 3', version: 'Performance', year: 2023, color: '#D4AF37', type: 'Premium', addedDate: '2023-09-03', image: 'https://example.com/tesla-model-3.jpg' },
    { id: 10, brand: 'BMW', model: 'M3', version: 'Competition', year: 2023, color: '#FF69B4', type: 'Premium', addedDate: '2023-10-06', image: 'https://example.com/bmw-m3.jpg' },
    { id: 11, brand: 'Audi', model: 'A4', version: 'Quattro', year: 2021, color: '#C0C0C0', type: 'Básico', addedDate: '2023-10-15', image: 'https://example.com/audi-a4.jpg' },
    { id: 12, brand: 'Hyundai', model: 'Elantra', version: 'SEL', year: 2022, color: '#000080', type: 'Básico', addedDate: '2023-11-01', image: 'https://example.com/hyundai-elantra.jpg' },
    { id: 13, brand: 'Kia', model: 'Stinger', version: 'GT', year: 2023, color: '#FFA500', type: 'Premium', addedDate: '2023-11-22', image: 'https://example.com/kia-stinger.jpg' },
    { id: 14, brand: 'Mercedes-Benz', model: 'C-Class', version: 'AMG', year: 2021, color: '#800080', type: 'Premium', addedDate: '2023-12-05', image: 'https://example.com/mercedes-c-class.jpg' },
    { id: 15, brand: 'Porsche', model: '911', version: 'Turbo S', year: 2020, color: '#FFD700', type: 'Premium', addedDate: '2023-12-25', image: 'https://example.com/porsche-911.jpg' },
    { id: 16, brand: 'Jaguar', model: 'F-Type', version: 'R', year: 2021, color: '#ADD8E6', type: 'Premium', addedDate: '2024-01-10', image: 'https://example.com/jaguar-f-type.jpg' },
    { id: 17, brand: 'Lamborghini', model: 'Huracan', version: 'EVO', year: 2022, color: '#FF4500', type: 'Premium', addedDate: '2024-01-25', image: 'https://example.com/lamborghini-huracan.jpg' },
    { id: 18, brand: 'Ferrari', model: 'Roma', version: 'Coupe', year: 2023, color: '#8B0000', type: 'Premium', addedDate: '2024-02-10', image: 'https://example.com/ferrari-roma.jpg' },
    { id: 19, brand: 'McLaren', model: '720S', version: 'Spider', year: 2022, color: '#00FFFF', type: 'Premium', addedDate: '2024-02-25', image: 'https://example.com/mclaren-720s.jpg' },
    { id: 20, brand: 'Aston Martin', model: 'Vantage', version: 'AMR', year: 2021, color: '#32CD32', type: 'Premium', addedDate: '2024-03-05', image: 'https://example.com/aston-vantage.jpg' },
    { id: 21, brand: 'Chevrolet', model: 'Camaro', version: 'SS', year: 2023, color: '#FFD700', type: 'Básico', addedDate: '2024-03-20', image: 'https://example.com/chevrolet-camaro.jpg' },
    { id: 22, brand: 'Dodge', model: 'Charger', version: 'Hellcat', year: 2022, color: '#8A2BE2', type: 'Premium', addedDate: '2024-04-10', image: 'https://example.com/dodge-charger.jpg' },
    { id: 23, brand: 'Jeep', model: 'Wrangler', version: 'Rubicon', year: 2021, color: '#228B22', type: 'Básico', addedDate: '2024-05-01', image: 'https://example.com/jeep-wrangler.jpg' },
    { id: 24, brand: 'Ford', model: 'Bronco', version: 'Wildtrak', year: 2023, color: '#FF6347', type: 'Premium', addedDate: '2024-05-15', image: 'https://example.com/ford-bronco.jpg' },
    { id: 25, brand: 'Ram', model: '1500', version: 'Rebel', year: 2022, color: '#708090', type: 'Básico', addedDate: '2024-06-01', image: 'https://example.com/ram-1500.jpg' },
];


function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [cars, setCars] = useState(initialCars)
    const [activeTab, setActiveTab] = useState('home')
    const [isDark, setIsDark] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCar, setSelectedCar] = useState(null)
    const [isAddingCar, setIsAddingCar] = useState(false)
    const [newCar, setNewCar] = useState({ brand: '', model: '', version: '', year: '', color: '#000000', type: '', addedDate: '', image: '' })
    const [open, setOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [filters, setFilters] = useState({ brands: [], years: [], types: [], colors: [] })
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [errors, setErrors] = useState({})


    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    const sortedCars = [...cars].sort((a, b) => {
        if (sortConfig.key !== null) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1
            }
        }
        return 0
    })

    const filteredCars = sortedCars.filter(car =>
        (searchTerm === '' || Object.values(car).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )) &&
        (filters.brands.length === 0 || filters.brands.includes(car.brand)) &&
        (filters.years.length === 0 || filters.years.includes(car.year.toString())) &&
        (filters.types.length === 0 || filters.types.includes(car.type)) &&
        (filters.colors.length === 0 || filters.colors.includes(car.color))
    )

    const paginatedCars = filteredCars.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const totalPages = Math.ceil(filteredCars.length / itemsPerPage)

    const validateCar = (car) => {
        const newErrors = {}
        if (!car.brand) newErrors.brand = 'La marca es requerida'
        if (!car.model) newErrors.model = 'El modelo es requerido'
        if (!car.version) newErrors.version = 'La versión es requerida'
        if (!car.color) newErrors.color = 'El color es requerido'
        if (!car.type) newErrors.type = 'El tipo es requerido'
        if (!car.addedDate) newErrors.addedDate = 'La fecha de adición es requerida'
        if (!car.image) newErrors.image = 'La imagen es requerida'
        return newErrors
    }

    const addCar = () => {
        const newErrors = validateCar(newCar)
        if (Object.keys(newErrors).length === 0) {
            const id = cars.length + 1
            setCars([...cars, { ...newCar, id }])
            setNewCar({ brand: '', model: '', version: '', year: '', color: '#000000', type: '', addedDate: '', image: '' })
            setIsAddingCar(false)
            showToast('Auto agregado con éxito')
        } else {
            setErrors(newErrors)
        }
    }

    const updateCar = () => {
        const newErrors = validateCar(selectedCar)
        if (Object.keys(newErrors).length === 0) {
            setCars(cars.map(car => car.id === selectedCar.id ? selectedCar : car))
            setSelectedCar(null)
            setIsEditModalOpen(false)
            showToast('Auto actualizado con éxito')
        } else {
            setErrors(newErrors)
        }
    }

    const deleteCar = (id) => {
        setCars(cars.filter(car => car.id !== id))
        setSelectedCar(null)
        showToast('Auto eliminado con éxito')
    }

    const showToast = (message) => {
        setToastMessage(message)
        setOpen(true)
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

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const options = { day: '2-digit', month: 'long', year: 'numeric' }
        return date.toLocaleDateString('es-MX', options)
    }

    const requestSort = (key) => {
        let direction = 'ascending'
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    const getSortIcon = (columnName) => {
        if (sortConfig.key === columnName) {
            return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        }
        return null
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

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <ToastProvider>
                <div className={`min-h-screen ${isDark ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
                    {/* Header */}
                    <Header activeTab='dashboard' isDark={isDark} />

                    <main className="container mx-auto p-4 pb-20">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsContent value="home" className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                                >
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total de Autos</CardTitle>
                                            <Car className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{cars.length}</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Autos Básicos</CardTitle>
                                            <CarFront className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{carsByType[0]}</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Autos Premium</CardTitle>
                                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{carsByType[1]}</div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <div className="flex flex-wrap gap-4 mb-4">
                                    <div className="flex-grow relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <Input
                                            type="search"
                                            placeholder="Buscar autos..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>

                                            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtros</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[750px]">
                                            <DialogHeader>
                                                <DialogTitle>Filtros</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid grid-cols-1 gap-4">
                                                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                                                    <div className="flex gap-10">
                                                        <div>
                                                            <h3 className="mb-2 font-semibold flex items-center"><Car className="mr-2 h-4 w-4" /> Marca</h3>
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
                                                        <div className='flex flex-col gap-5'>
                                                            <div>
                                                                <h3 className="mb-2 font-semibold flex items-center"><Calendar className="mr-2 h-4 w-4" /> Año</h3>
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
                                                                <h3 className="mb-2 font-semibold flex items-center"><Tag className="mr-2 h-4 w-4" /> Tipo</h3>
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
                                                        </div>
                                                        <div>
                                                            <h3 className="mb-2 font-semibold flex items-center"><Palette className="mr-2 h-4 w-4" /> Color</h3>
                                                            {uniqueColors.map(color => (
                                                                <div key={color} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`color-${color}`}
                                                                        checked={filters.colors.includes(color)}
                                                                        onCheckedChange={() => handleFilterChange('colors', color)}
                                                                    />
                                                                    <label htmlFor={`color-${color}`} className="flex items-center">
                                                                        <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                                                                        {color}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </ScrollArea>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Imagen</TableHead>
                                                <TableHead onClick={() => requestSort('brand')} className="cursor-pointer">
                                                    <div className='flex items-center justify-center'>
                                                        <Car className="inline-block mr-2 h-4 w-4" />Marca {getSortIcon('brand')}
                                                    </div>
                                                </TableHead>
                                                <TableHead onClick={() => requestSort('model')} className="cursor-pointer">
                                                    <div className='flex items-center justify-center'>
                                                        <PenSquare className="inline-block mr-2 h-4 w-4" />Modelo {getSortIcon('model')}
                                                    </div>
                                                </TableHead>
                                                <TableHead onClick={() => requestSort('version')} className="cursor-pointer">
                                                    <div className='flex items-center justify-center'>
                                                        <Tag className="inline-block mr-2 h-4 w-4" />Versión {getSortIcon('version')}
                                                    </div>
                                                </TableHead>
                                                <TableHead onClick={() => requestSort('year')} className="cursor-pointer">
                                                    <div className='flex items-center justify-center'>
                                                        <Calendar className="inline-block mr-2 h-4 w-4" />Año{getSortIcon('year')}
                                                    </div>
                                                </TableHead>
                                                <TableHead onClick={() => requestSort('type')} className="cursor-pointer">
                                                    <div className='flex items-center justify-center'>
                                                        <Tag className="inline-block mr-2 h-4 w-4" />Tipo {getSortIcon('type')}
                                                    </div>
                                                </TableHead>
                                                <TableHead>
                                                    <div className='flex items-center justify-center'>
                                                        <Palette className="inline-block mr-2 h-4 w-4" />Color
                                                    </div>
                                                </TableHead>
                                                <TableHead onClick={() => requestSort('addedDate')} className="cursor-pointer">
                                                    <div className='flex items-center justify-center'>
                                                        <Clock className="inline-block mr-2 h-4 w-4" />Fecha de Adición {getSortIcon('addedDate')}
                                                    </div>
                                                </TableHead>
                                                <TableHead>Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedCars.map((car) => (
                                                <TableRow key={car.id}>
                                                    <TableCell>
                                                        <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-10 h-10 object-cover rounded" />
                                                    </TableCell>
                                                    <TableCell>{car.brand}</TableCell>
                                                    <TableCell>{car.model}</TableCell>
                                                    <TableCell>{car.version}</TableCell>
                                                    <TableCell>{car.year}</TableCell>
                                                    <TableCell>{car.type}</TableCell>
                                                    <TableCell>
                                                        <span className="w-6 h-6 rounded-full inline-block mr-2" style={{ backgroundColor: car.color }}></span>
                                                        {car.color}
                                                    </TableCell>
                                                    <TableCell>{formatDate(car.addedDate)}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm" onClick={() => { setSelectedCar(car); setIsEditModalOpen(true); }}>
                                                            <PenSquare className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => deleteCar(car.id)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center space-x-2">
                                        <span>Autos por página:</span>
                                        <Select
                                            value={itemsPerPage.toString()}
                                            onValueChange={(value) => {
                                                setItemsPerPage(Number(value));
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-[70px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[5, 10, 20, 50].map((value) => (
                                                    <SelectItem key={value} value={value.toString()}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span>
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Add form */}
                            <TabsContent value="add">
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
                                                    <Input
                                                        placeholder="Marca"
                                                        value={newCar.brand}
                                                        onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                                                        required
                                                    />
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
                                                    <Calendar className="h-4 w-4" />
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline">
                                                                {newCar.addedDate ? format(new Date(newCar.addedDate), "dd 'de' MMMM 'de' yyyy", { locale: es }) : "Seleccionar fecha"}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <CalendarComponent
                                                                mode="single"
                                                                selected={newCar.addedDate ? new Date(newCar.addedDate) : undefined}
                                                                onSelect={(date) => setNewCar({ ...newCar, addedDate: date ? date.toISOString().split('T')[0] : '' })}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                {errors.addedDate && <p className="text-red-500 text-sm">{errors.addedDate}</p>}
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
                                </motion.div>
                            </TabsContent>

                            {/* Graficas */}
                            <TabsContent value="stats" className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
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
                                    <Card className='col-span-2'>
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
                                </motion.div>
                            </TabsContent>
                        </Tabs>
                    </main>

                    {/* Navbar */}
                    <motion.nav
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300"
                    >
                        <div className="container mx-auto px-4">
                            <div className="flex justify-around items-center h-16 relative">
                                <Button variant="ghost" size="icon" onClick={() => setActiveTab('home')}>
                                    <Home className={`h-6 w-6 ${activeTab === 'home' ? 'text-blue-500' : ''}`} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => { setActiveTab('add'); setIsAddingCar(true); }}>
                                    <PenSquare className={`h-6 w-6 ${activeTab === 'add' ? 'text-blue-500' : ''}`} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setActiveTab('stats')}>
                                    <BarChart2 className={`h-6 w-6 ${activeTab === 'stats' ? 'text-blue-500' : ''}`} />
                                </Button>
                                <motion.div
                                    className="absolute bottom-0 h-1 bg-blue-500"
                                    initial={false}
                                    animate={{
                                        left: `${(activeTab === 'home' ? 0 : activeTab === 'add' ? 33.33 : 66.66)}%`,
                                        width: '33.33%'
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            </div>
                        </div>
                    </motion.nav>

                    {/* Edit form modal */}
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogContent className="max-w-4xl w-full">
                            <DialogHeader>
                                <DialogTitle>Editar Auto</DialogTitle>
                            </DialogHeader>
                            {selectedCar && (
                                <form onSubmit={(e) => { e.preventDefault(); updateCar(); }} className="flex flex-col md:flex-row gap-8">
                                    <div className="w-full md:w-1/2 space-y-4 ">
                                        <div className="aspect-[5/6] overflow-hidden rounded-lg">
                                            {/* <div className="aspect-[6/7] overflow-hidden rounded-lg"> */}
                                            <img
                                                src={selectedCar.image}
                                                alt={`${selectedCar.brand} ${selectedCar.model}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                    </div>
                                    <div className="w-full md:w-1/2 space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Car className="h-4 w-4" />
                                            <Input
                                                placeholder="Marca"
                                                value={selectedCar.brand}
                                                onChange={(e) => setSelectedCar({ ...selectedCar, brand: e.target.value })}
                                                required
                                            />
                                        </div>
                                        {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}

                                        <div className="flex items-center space-x-2">
                                            <PenSquare className="h-4 w-4" />
                                            <Input
                                                placeholder="Modelo"
                                                value={selectedCar.model}
                                                onChange={(e) => setSelectedCar({ ...selectedCar, model: e.target.value })}
                                                required
                                            />
                                        </div>
                                        {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}

                                        <div className="flex items-center space-x-2">
                                            <Tag className="h-4 w-4" />
                                            <Input
                                                placeholder="Versión"
                                                value={selectedCar.version}
                                                onChange={(e) => setSelectedCar({ ...selectedCar, version: e.target.value })}
                                                required
                                            />
                                        </div>
                                        {errors.version && <p className="text-red-500 text-sm">{errors.version}</p>}

                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4" />
                                            <Input
                                                placeholder="Año"
                                                type="number"
                                                value={selectedCar.year}
                                                onChange={(e) => setSelectedCar({ ...selectedCar, year: e.target.value })}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Palette className="h-4 w-4" />
                                            <Input
                                                type="color"
                                                value={selectedCar.color}
                                                onChange={(e) => setSelectedCar({ ...selectedCar, color: e.target.value })}
                                                required
                                            />
                                        </div>
                                        {errors.color && <p className="text-red-500 text-sm">{errors.color}</p>}

                                        <div className="flex items-center space-x-2">
                                            <Tag className="h-4 w-4" />
                                            <Select
                                                value={selectedCar.type}
                                                onValueChange={(value) => setSelectedCar({ ...selectedCar, type: value })}
                                                required
                                            >
                                                <SelectTrigger className="w-full">
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
                                            <Calendar className="h-4 w-4" />
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                        {selectedCar.addedDate
                                                            ? format(new Date(selectedCar.addedDate), "dd 'de' MMMM 'de' yyyy", { locale: es })
                                                            : "Seleccionar fecha"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={selectedCar.addedDate ? new Date(selectedCar.addedDate) : undefined}
                                                        onSelect={(date) => setSelectedCar({ ...selectedCar, addedDate: date ? date.toISOString().split('T')[0] : '' })}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        {errors.addedDate && <p className="text-red-500 text-sm">{errors.addedDate}</p>}

                                        <div className="flex items-center space-x-2">
                                            <Link className="h-4 w-4" />
                                            <Input
                                                placeholder="URL de la imagen"
                                                value={selectedCar.image}
                                                onChange={(e) => setSelectedCar({ ...selectedCar, image: e.target.value })}
                                                required
                                            />
                                        </div>
                                        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

                                        <Button type="submit" className="w-full mt-auto">Guardar Cambios</Button>
                                    </div>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Toast open={open} onOpenChange={setOpen}>
                        <ToastTitle>{toastMessage}</ToastTitle>
                    </Toast>
                </div>
            </ToastProvider>
        </ThemeContext.Provider>
    );
}

export default Dashboard;