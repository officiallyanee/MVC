import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BackendUrlContext } from "../context/BackendUrl";
import CustomerOrder from "../components/CustomerOrder";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

function Orders() {
    const backendURL = useContext(BackendUrlContext)
    const [orders, setOrders] = useState([]);
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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(backendURL + '/orders');
                const data = await response.data;
                setOrders(data);
            } catch (error) {
                toast.error("Try again later", toastStyle);
            }
        }
        fetchOrders();
    }, [])

    const handleReceive = async (order_id) => {
        try {
            const received_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
            const response = await axios.patch(backendURL + `/orders`, {
                order_id: order_id,
                received_time: received_time
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setOrders(prevOrders => prevOrders.map(order => {
                    if (order.order_id === order_id) {
                        return { ...order, received_time: { Time: received_time, Valid: true } };
                    }
                    return order;
                }))
            }
        } catch (error) {
            toast.error("Try again later", toastStyle);
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={fromHome ? { delay: 2.6, duration: 0.5 } : { duration: 0.3 }}
                className="menu h-[calc(100vh-140px)] w-full px-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center top-[140px] absolute overflow-y-auto"
            >
                {!orders || orders.length === 0 ? (
                    <div className="col-span-full flex justify-center items-center h-64">
                        <div className="text-white text-2xl font-['Pompiere']">
                            No orders. Place an order!
                        </div>
                    </div>
                ) : (
                    orders.map((order) => (
                        <CustomerOrder key={order.order_id} order={order} handleReceive={handleReceive} />
                    ))
                )}
            </motion.div>
        </>
    );
}

export default Orders;