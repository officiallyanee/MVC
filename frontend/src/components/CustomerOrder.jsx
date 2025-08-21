
export default function CustomerOrder({order, handleReceive}) {
    return(
    <div key={order.order_id} className="w-70 h-82 p-2 relative mr-2">
        <div className="w-68 h-80 bg-gradient-to-b from-black/25 to-black/30 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_2px_2px_0px_rgba(255,255,255,0.08)] outline outline-1 outline-offset-[-0.50px] outline-white/10 backdrop-blur-[2px]" >
        <div className="text-center text-yellow-300 text-3xl font-normal font-['Pompiere'] tracking-wide pt-4">Order #{order.order_id.slice(-4)}</div>
        <div className="w-56 sm:w-60 lg:w-56 h-[1px] absolute left-1/2 transform -translate-x-1/2  bg-gradient-to-r from-[#312719] via-[#FFE74C] to-[#312719] mt-2 mb-2"></div>
        <div className="orders w-68 mt-4 pl-3 max-h-40 p-2 overflow-y-auto pt-4 mb-2">
        {order.item_list.map((item) => (
            <div key={item.item_id} className="w-60 inline-flex justify-between items-start mb-2 px-2">
                <div className="w-40 h-12 justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">{item.item_name}({item.quantity})</div>
                <div className="w-12 self-stretch text-right justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">${item.price*item.quantity}</div>
            </div>
        ))}
        </div>
        <div className="w-56 bottom-[64px] sm:w-60 lg:w-56 h-[1px] absolute left-1/2 transform -translate-x-1/2  bg-gradient-to-r from-[#312719] via-[#FFFFFF] to-[#312719] mt-2 mb-2"></div>
        {(!order.received_time || !order.received_time.Valid)?(
            <button className="w-24 h-10 left-[24px] bottom-[20px] cursor-pointer absolute bg-stone-900 rounded-3xl overflow-hidden" onClick={() => handleReceive(order.order_id)}>
                <div className="w-24 h-8 bottom-0 absolute justify-center text-center text-yellow-300 text-2xl font-normal font-['Pompiere'] tracking-wide">Received?</div>
            </button>):
            (<div className="w-24 h-8 left-[30px] bottom-[20px] absolute text-center justify-center text-yellow-300 text-2xl font-normal font-['Pompiere'] tracking-wide">Received</div>)}
        <div className="w-20 left-[142px] bottom-[20px] absolute inline-flex justify-start items-start">
            <div className="justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">Total: </div>
            <div className="w-10 self-stretch text-right justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">${order.total_fare}</div>
        </div>
        </div>
    </div>
    )
}