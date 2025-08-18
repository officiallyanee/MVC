import { useState, useEffect } from "react";
import axios from "axios";

function Orders() {
    const [orders, setOrders] = useState([]);
    const paidStyle="w-24 h-8 left-[30px] top-[234px] absolute text-center justify-center text-yellow-300 text-2xl font-normal font-['Pompiere'] tracking-wide"
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/orders');
                const data = await response.data;
                console.log(data);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }
        fetchOrders();
    },[])
    const handleReceive = async (order_id) => {
        try {
            const  received_time= new Date().toISOString().slice(0, 19).replace('T', ' ')
            const response = await axios.patch(`http://localhost:8080/orders`, {
                order_id: order_id,
                received_time: received_time
            }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
            if(response.status === 200){
                setOrders(prevOrders => prevOrders.map(order => {
                    if (order.order_id === order_id) {
                        return { ...order, received_time: {Time: received_time, Valid: true } };
                    }
                    return order;
                })) 
            }
        } catch (error) {
            console.error('Error updating received time:', error);
        }
    }
    return (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center top-[160px] absolute">
            {orders.map((order,index) => (
            <div key={order.order_id} className="w-68 h-72 relative mr-2">
                <div className="w-68 h-72 bg-gradient-to-b from-black/25 to-black/30 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_2px_2px_0px_rgba(255,255,255,0.08)] outline outline-1 outline-offset-[-0.50px] outline-white/10 backdrop-blur-[2px]" >
                <div className="text-center text-yellow-300 text-3xl font-normal font-['Pompiere'] tracking-wide pt-4">Order #{order.order_id.slice(-4)}</div>
                <div className="w-44 h-0  outline outline-1 outline-offset-[-0.50px] outline-green-950" />
                <div className="w-68  top-[90px]  max-h-36 p-2 overflow-y-auto pt-2">
                {order.item_list.map((item) => (
                    <div key={item.item_id} className="w-60 inline-flex justify-between items-start mb-2 px-2">
                        <div className="w-40 h-12 justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">{item.item_name}({item.quantity})</div>
                        <div className="w-12 self-stretch text-right justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">${item.price}</div>
                    </div>
                ))}
                </div>
                {(!order.received_time || !order.received_time.Valid)?(
                    <button className="w-24 h-10 left-[24px] top-[234px] cursor-pointer absolute bg-stone-900 rounded-3xl overflow-hidden" onClick={() => handleReceive(order.order_id)}>
                        <div className="w-20 h-8 text-center text-yellow-300 text-2xl font-normal font-['Pompiere'] tracking-wide">Received?</div>
                    </button>):
                    (<div className={paidStyle}>Received</div>)}
                <div className="w-40 h-0 left-[54px] top-[220px] absolute outline outline-1 outline-offset-[-0.50px] outline-green-950"></div>
                <div className="w-20 left-[142px] top-[237px] absolute inline-flex justify-start items-start">
                    <div className="justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">Total: </div>
                    <div className="w-10 self-stretch text-right justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">${order.total_fare}</div>
                </div>
                </div>
            </div>
            ))}
        </div>  
        </>
    );
}

export default Orders;