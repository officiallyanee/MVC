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
                        return { ...order, received_time: received_time };
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 place-items-center left-[131px] top-[184px] absolute">
            {orders.map((order,index) => (
            <div key={order.order_id} className="w-68 h-72 ">
                <div className="w-68 h-72 left-0 top-0 absolute bg-gradient-to-b from-black/25 to-black/30 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_2px_2px_0px_rgba(255,255,255,0.08)] outline outline-1 outline-offset-[-0.50px] outline-white/10 backdrop-blur-[2px]" />
                <div className="w-8 h-8 left-0 top-0 absolute bg-black/30" />
                <div className="left-[91.50px] top-[24px] absolute text-center justify-start text-yellow-300 text-3xl font-normal font-['Pompiere'] tracking-wide">Order #{index+1}</div>
                <div className="w-44 h-0 left-[54px] top-[80px] absolute outline outline-1 outline-offset-[-0.50px] outline-green-950" />
                <div className="w-52 left-[36px] top-[90px]  max-h-32 absolute overflow-y-auto">
                {order.item_list.map((item) => (
                    <div key={item.item_id} className="w-52 inline-flex justify-between items-start mb-2">
                        <div className="w-40 h-12 justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">{item.item_name}({item.quantity})</div>
                        <div className="w-12 self-stretch text-right justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">${item.price}</div>
                    </div>
                ))}
                </div>
                {(!order.received_time || !order.received_time.Valid)?(
                    <button className="w-24 h-8 left-[30px] top-[234px] absolute bg-stone-900 rounded-3xl overflow-hidden" onClick={() => handleReceive(order.order_id)}>
                        <div className="w-18 h-4 left-[30px] text-center justify-center text-yellow-300 text-2xl font-normal font-['Pompiere'] tracking-wide">Received?</div>
                    </button>):
                    (<div className={paidStyle}>Received</div>)}
                <div className="w-40 h-0 left-[54px] top-[220px] absolute outline outline-1 outline-offset-[-0.50px] outline-green-950"></div>
                <div className="w-20 left-[142px] top-[237px] absolute inline-flex justify-start items-start">
                    <div className="justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">Total: </div>
                    <div className="w-10 self-stretch text-right justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">${order.total_fare}</div>
                </div>
            </div>
            ))}
        </div>  
        </>
    );
}

export default Orders