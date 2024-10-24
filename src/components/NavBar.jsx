
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { BarChart2, Home, PenSquare } from 'lucide-react';

// eslint-disable-next-line react/prop-types
function NavBar({ activeTab, setActiveTab }) {

    return (
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
                    <Button variant="ghost" size="icon" onClick={() => { setActiveTab('add');}}>
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
    );
}

export default NavBar;