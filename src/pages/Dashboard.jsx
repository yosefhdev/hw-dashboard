/* eslint-disable no-unused-vars */
import { supabase } from '@/db/supabase';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddForm from '@/components/AddForm';
import Graficas from '@/components/Graficas';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Toast, ToastProvider, ToastTitle } from "@/components/ui/toast";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, Car, CarFront, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Clock, Filter, Link, Palette, PenSquare, Search, Sparkles, Tag, X } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

// Tema context
const ThemeContext = createContext({ isDark: false, toggleTheme: () => { } })

// Datos de ejemplo
const initialCars = [
    { id: 1, brand: 'Toyota', model: 'Corolla', version: 'LE', year: 2022, color: '#FFFFFF', type: 'Básico', addedDate: '2023-01-15', image: 'https://img.remediosdigitales.com/267028/corolla-2022/1366_2000.jpg' },
    { id: 2, brand: 'Honda', model: 'Civic', version: 'Touring', year: 2023, color: '#0000FF', type: 'Premium', addedDate: '2023-02-20', image: 'https://www.louisvillehondaworld.com/assets/d3958/img/Honda-CIvic-Touring-Sedan-Morning-Mist-Metallic--1024x576.jpeg' },
    { id: 3, brand: 'Ford', model: 'Mustang', version: 'GT', year: 2021, color: '#FF0000', type: 'Premium', addedDate: '2023-03-10', image: 'https://img.remediosdigitales.com/473795/ford-mustang-shelby-gt500-mexico_/840_560.jpg' },
    { id: 4, brand: 'Chevrolet', model: 'Spark', version: 'LT', year: 2022, color: '#00FF00', type: 'Básico', addedDate: '2023-04-05', image: 'https://www.elcarrocolombiano.com/wp-content/uploads/2021/06/20210617-CHEVROLET-SPARK-2022-ESTADOS-UNIDOS-PRECIO-CARACTERISTICAS-02.jpg' },
    { id: 5, brand: 'Nissan', model: 'Sentra', version: 'SV', year: 2023, color: '#808080', type: 'Básico', addedDate: '2023-05-12', image: 'https://media.ed.edmunds-media.com/nissan/sentra/2022/oem/2022_nissan_sentra_sedan_sv_fq_oem_1_1280.jpg' },
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

// eslint-disable-next-line react/prop-types
function Notification({ message, success, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, 5000)

        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md flex items-center space-x-2 ${success ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {success ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message}</span>
        </div>
    )
}

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [cars, setCars] = useState(initialCars)
    const [activeTab, setActiveTab] = useState('home')
    const [isDark, setIsDark] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCar, setSelectedCar] = useState(null)
    const [open, setOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [filters, setFilters] = useState({ brands: [], years: [], types: [], colors: [] })
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [errors, setErrors] = useState({})
    const [notification, setNotification] = useState(null)


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

    const updateCar = async () => {
        const newErrors = validateCar(selectedCar)
        if (Object.keys(newErrors).length === 0) {
            setCars(cars.map(car => car.id === selectedCar.id ? selectedCar : car))
            setSelectedCar(null)
            setIsEditModalOpen(false)
            setNotification({ message: 'Coche actualizado con éxito', success: true })
        } else {
            setErrors(newErrors)
        }
    }

    const deleteCar = async (id) => {
        setCars(cars.filter(car => car.id !== id))
        setSelectedCar(null)
        setNotification({ message: 'Coche eliminado con éxito', success: true })
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
                    <Header activeTab='dashboard' isDark={isDark} toggleTheme={toggleTheme} />

                    <main className="container mx-auto p-4 pb-20">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsContent value="home" className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5"
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
                                            <Button variant="outline">
                                                <Filter className="mr-2 h-4 w-4" /> Filtros
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[750px] h-[80%]">
                                            <DialogHeader>
                                                <DialogTitle>Filtros</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid grid-cols-1 gap-4">
                                                <ScrollArea className="h-[90%] w-full rounded-md border p-4">
                                                    <div className="flex gap-20 justify-center">
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
                                <AddForm
                                    setNotification={setNotification}
                                    errors={errors}
                                    setErrors={setErrors}
                                    setActiveTab={setActiveTab}
                                    validateCar={validateCar}
                                />
                            </TabsContent>

                            {/* Graficas */}
                            <TabsContent value="stats" className="space-y-4">
                                <Graficas
                                    cars={cars}
                                    carTypes={carTypes}
                                />
                            </TabsContent>
                        </Tabs>
                    </main>

                    {/* Navbar */}
                    <NavBar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

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
            {notification && (
                <Notification
                    message={notification.message}
                    success={notification.success}
                    onClose={() => setNotification(null)}
                />
            )}
        </ThemeContext.Provider>
    );
}

export default Dashboard;