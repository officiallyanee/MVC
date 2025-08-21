import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify"; 
import axios from "axios";
import { BackendUrlContext } from "../context/BackendUrl";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Chef() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const fromHome = location.state?.from === 'home';
    const toastStyle = {
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

    const isItemDone = (item) => {
        return item.chef_id && item.chef_id.Valid && item.chef_id.String !== "";
    };

    const isOrderComplete = (orderData) => {
        return orderData.sub_orders.every(item => isItemDone(item));
    };

    const fetchAllPendingOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(backendURL + '/chef');
            const allOrders = response.data || [];
            
            const pendingOrders = allOrders.filter(orderData => !isOrderComplete(orderData));
            
            setOrders(pendingOrders);
        } catch (error) {
            toast.error(error.response?.data || 'Error fetching orders', toastStyle);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPendingOrders();
    }, []);

    const handleUpdateChef = async (orderId, itemId) => {
        try {
            const response = await axios.patch(backendURL + `/chef`,{
                    order_id: orderId,
                    item_id: itemId
                }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                setOrders(prevOrders => {
                    return prevOrders.map(order => {
                        if (order.order.order_id === orderId) {
                            const updatedSubOrders = order.sub_orders.map(item => {
                                if (item.item_id === itemId) {
                                    return {
                                        ...item,
                                        chef_id: { String: "current_chef_id", Valid: true }
                                    };
                                }
                                return item;
                            });

                            const allItemsDone = updatedSubOrders.every(item => 
                                item.chef_id && item.chef_id.Valid
                            );

                            if (allItemsDone) {
                                return null;
                            }

                            return {
                                ...order,
                                sub_orders: updatedSubOrders
                            };
                        }
                        return order;
                    }).filter(order => order !== null); 
                });
            }
        } catch (error) {
            toast.error(error.response?.data || 'Error updating Chef', toastStyle);
        }
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
                <div className="text-center mb-8">
                    <p className="text-white font-['Pompiere'] text-xl">
                        {loading ? "Loading..." : ``}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-white text-2xl font-['Pompiere']">Loading orders...</div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-white text-2xl font-['Pompiere']">
                            🎉 All orders completed! Great job!
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {orders.map((orderData) => (
                            <div key={orderData.order.order_id} className="relative">
                                <div className="w-72 h-auto min-h-90 relative pb-6">
                                    <div className="w-full h-full absolute bg-gradient-to-b from-black/25 to-black/30 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_2px_2px_0px_rgba(255,255,255,0.08)] outline outline-1 outline-offset-[-0.50px] outline-white/10 backdrop-blur-[2px] rounded-lg" />
                                    
                                    <div className="relative z-10 p-4">
                                        <div className="text-center mb-4">
                                            <div className="text-yellow-300 text-2xl font-normal font-['Pompiere'] tracking-wide">
                                                Order #{orderData.order.order_id.slice(-8)}
                                            </div>
                                            <div className="text-green-300 text-lg font-normal font-['Pompiere'] tracking-wide">
                                                Table {orderData.order.table_no}
                                            </div>
                                        </div>

                                        <div className="w-full h-0 mb-4 outline outline-1 outline-offset-[-0.50px] outline-green-950" />
                                        <div className="text-white text-sm font-['Pompiere'] mb-4">
                                            <span className="text-yellow-300">Ordered:</span> {formatDateTime(orderData.order.ordered_time)}
                                        </div>
                                        {orderData.order.specifications && (
                                            <div className="text-white text-sm font-['Pompiere'] mb-4">
                                                <span className="text-orange-300">Special Instructions:</span> {orderData.order.specifications}
                                            </div>
                                        )}
                                        <div className="space-y-3 mb-4">
                                            {orderData.sub_orders.map((item) => (
                                                <div key={item.item_id} className="bg-black/20 rounded-lg p-3 ">
                                                    <div className="flex justify-between items-start  ">
                                                        <div className="flex-1">
                                                            <div className="text-white text-lg font-['Pompiere'] tracking-wide">
                                                                {item.name} ({item.quantity})
                                                            </div>
                                                        </div>
                                                    <div className="flex justify-center">
                                                        {isItemDone(item) ? (
                                                            <div className="px-4 py-2 bg-green-600 rounded-full text-white text-sm font-['Pompiere'] flex items-center space-x-2">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                <span>Done</span>
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-full text-white text-sm font-['Pompiere'] transition-colors flex items-center space-x-2"
                                                                onClick={() => handleUpdateChef(orderData.order.order_id, item.item_id)}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                </svg>
                                                                <span>Mark Done</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                    
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm font-['Pompiere'] mb-2">
                                                <span className="text-white">Progress</span>
                                                <span className="text-white">
                                                    {orderData.sub_orders.filter(item => isItemDone(item)).length} / {orderData.sub_orders.length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div 
                                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${(orderData.sub_orders.filter(item => isItemDone(item)).length / orderData.sub_orders.length) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
    );
}

export default Chef;