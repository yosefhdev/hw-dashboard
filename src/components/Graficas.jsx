/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from 'framer-motion'
import { Bar, Pie } from 'react-chartjs-2'

function Graficas({ cars, carTypes }) {

    const carsByType = carTypes.map(type => cars.filter(car => car.type === type).length)
    const carsByYear = Object.entries(cars.reduce((acc, car) => {
        acc[car.year] = (acc[car.year] || 0) + 1
        return acc
    }, {})).sort((a, b) => a[0] - b[0])
    const carsByBrand = Object.entries(cars.reduce((acc, car) => {
        acc[car.brand] = (acc[car.brand] || 0) + 1
        return acc
    }, {})).sort((a, b) => b[1] - a[1])


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
            <Card className='col-span-1'>
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
    );
}

export default Graficas;