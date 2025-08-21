import { useContext, useEffect, useState } from "react";
import { BackendUrlContext } from "../context/BackendUrl";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Admin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const location = useLocation();
    const fromHome = location.state?.from === 'home';
    const errorStyle = {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }
    const backendURL = useContext(BackendUrlContext);

    const fetchOrders = async (search = "", page = 1) => {
        try {
            setLoading(true);
            const searchParam = search.trim() || "all";
            const response = await axios.get(backendURL+`/admin/${searchParam}/${page}`, {
                credentials: 'include'
            });
            const data = await response.data;
            
            setOrders(data.orders || []);
            setTotalOrders(data.total_pages || 0);
        } catch (error) {
            toast.error((error.response?.data || "Try again later"), errorStyle);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(searchTerm, currentPage);
    }, [searchTerm, currentPage]);

    const handleUpdatePaymentStatus = async (orderId) => {
        try {
            const response = await axios.patch(backendURL+`/admin`, {
                    order_id: orderId
                }, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success(response.data.message, errorStyle);
             setOrders(prevOrders => prevOrders.map(orderItem => 
            orderItem.order.order_id === orderId ? 
                {
                    ...orderItem,  
                    order: {
                        ...orderItem.order, 
                        payment_status: "Paid"  
                    }
                } : 
                orderItem
            ));
        } catch (error) {
            toast.error(error.response?.data || "Unable to update payment status", errorStyle);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "Not set";
        try {
            return new Date(dateTimeString).toLocaleString();
        } catch {
            return "Invalid date";
        }
    };

    return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={fromHome ? { delay: 2.6, duration: 0.5 } : { duration: 0.3 }}
                className="max-w-7xl mx-auto"
            >
                <div className="absolute top-30 left-1/2 transform -translate-x-1/2 mb-8 flex justify-center">
                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Search by customer name..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-4 py-3 pl-12 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-white text-2xl font-['Pompiere']">Loading orders...</div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-white text-2xl font-['Pompiere']">
                            {searchTerm ? `No orders found for "${searchTerm}"` : "No orders found"}
                        </div>
                    </div>
                ) : (
                    <div className="menu grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6  px-16 py-4 absolute bottom-0 left-0 right-0 overflow-y-auto h-130 mt-12">
                        {orders.map((order, index) => (
                            <div key={order.order?.order_id || index} className="relative">
                                <div className="w-70 h-80 relative">
                                    <div className="w-full h-full absolute bg-gradient-to-b from-black/25 to-black/30 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_2px_2px_0px_rgba(255,255,255,0.08)] outline outline-1 outline-offset-[-0.50px] outline-white/10 backdrop-blur-[2px] rounded-lg" />
                                    <div className="absolute w-full top-4 left-1/2 transform -translate-x-1/2 text-center text-yellow-300 text-2xl font-normal font-['Pompiere'] tracking-wide">
                                        Order #{order.order.order_id.slice(-8)}
                                    </div>
                                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center text-green-300 text-lg font-normal font-['Pompiere'] tracking-wide">
                                        Customer: {order.order?.customer_name}
                                    </div>
                                    <div className="w-56 h-0 absolute left-1/2 transform -translate-x-1/2 top-20 outline outline-1 outline-offset-[-0.50px] outline-green-950" />
                                    
                                    <div className="itemlist w-64 absolute left-1/2 transform -translate-x-1/2 top-20 py-1 max-h-30 overflow-y-auto px-2">
                                        {order.sub_orders?.map((item) => (
                                            <div key={item.item_id} className="w-full flex justify-between items-start mb-2">
                                                <div className="flex-1 text-white text-lg font-normal font-['Pompiere'] tracking-wide">
                                                    {item.name} ({item.quantity})
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute top-53 left-4 right-4">
                                        <div className="text-white text-sm font-['Pompiere'] mb-1">
                                            <span className="text-yellow-300">Ordered:</span> {formatDateTime(order.order?.ordered_time)}
                                        </div>
                                        <div className="text-white text-sm font-['Pompiere']">
                                            <span className="text-blue-300">Received:</span> {
                                                order.order?.received_time.Valid ? formatDateTime(order.order.received_time.Time) : "Not received"
                                            }
                                        </div>
                                    </div>
                                    <div className="w-56 h-0 absolute left-1/2 transform -translate-x-1/2 bottom-12 outline outline-1 outline-offset-[-0.50px] outline-green-950" />
                                     <div className="absolute bottom-4 left-4">
                                        {order.order.payment_status === 'pending' ? (
                                            <button 
                                                className="px-4 py-2 bg-red-600 rounded-3xl text-white text-sm font-['Pompiere'] hover:bg-red-500 transition-colors" 
                                                onClick={() => handleUpdatePaymentStatus(order.order.order_id)}
                                            >
                                                Mark Paid
                                            </button>
                                        ) : (
                                            <div className="px-4 py-2 bg-green-600 rounded-3xl text-white text-sm font-['Pompiere']">
                                                Paid
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-4 right-4 transform -translate-x-1/2 flex justify-center items-center">
                                        <div className="text-white text-xl font-normal font-['Pompiere'] tracking-wide">Total: </div>
                                        <div className="text-white text-xl font-normal font-['Pompiere'] tracking-wide ml-2">
                                            ${order.order?.total_fare || '0.00'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && totalOrders > 8 && (
                    <div className="flex absolute top-[100px] right-[20px] justify-center mt-8 space-x-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-yellow-600 text-white rounded disabled:bg-gray-600 disabled:cursor-not-allowed font-['Pompiere']"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-white font-['Pompiere']">
                            Page {currentPage} of {Math.ceil(totalOrders / 8)}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalOrders / 8)))}
                            disabled={currentPage >= Math.ceil(totalOrders / 8)}
                            className="px-4 py-2 bg-yellow-600 text-white rounded disabled:bg-gray-600 disabled:cursor-not-allowed font-['Pompiere']"
                        >
                            Next
                        </button>
                    </div>
                )}
            </motion.div>
    );
}

export default Admin;