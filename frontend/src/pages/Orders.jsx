function Orders() {
    return (
        <div className="w-[1440px] h-[1024px] relative overflow-hidden">
            <div className="left-[413px] top-[41px] absolute inline-flex justify-start items-center gap-10">
                <div className="w-28 h-10 text-center justify-center text-white text-5xl font-normal font-['Pompiere'] tracking-wide">HOME</div>
                <div className="w-28 h-10 text-center justify-center text-white text-5xl font-normal font-['Pompiere'] tracking-wide">MENU</div>
                <div className="text-center justify-center text-yellow-300 text-5xl font-normal font-['Pompiere'] tracking-wide">ORDERS</div>
                <div className="text-center justify-center text-white text-5xl font-normal font-['Pompiere'] tracking-wide">ITEMLIST</div>
            </div>
            <div className="w-40 h-12 left-[50.55px] top-[34.42px] absolute justify-start text-yellow-300 text-4xl font-normal font-['Notable'] tracking-wide">Amor</div>
            <div className="w-[1440px] h-28 left-0 top-[910px] absolute bg-stone-900" />
            <div className="w-64 h-72 left-[131px] top-[184px] absolute">
                <div className="w-64 h-80 left-0 top-0 absolute bg-gradient-to-b from-black/25 to-black/30 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_2px_2px_0px_rgba(255,255,255,0.08)] outline outline-1 outline-offset-[-0.50px] outline-white/10 backdrop-blur-[2px]" />
                <div className="w-8 h-8 left-0 top-0 absolute bg-black/30" />
                <div className="left-[91.50px] top-[24px] absolute text-center justify-start text-yellow-300 text-3xl font-normal font-['Pompiere'] tracking-wide">Order #1</div>
                <div className="w-40 h-0 left-[54px] top-[80px] absolute outline outline-1 outline-offset-[-0.50px] outline-green-950" />
                <div className="w-44 left-[44px] top-[90px] absolute inline-flex justify-between items-start">
                    <div className="w-28 h-12 justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">Panee Tikka</div>
                    <div className="w-11 self-stretch text-right justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">$10</div>
                </div>
                <div className="w-20 h-8 left-[39px] top-[234px] absolute bg-stone-900 rounded-3xl overflow-hidden">
                    <div className="w-11 h-4 left-[18px] top-[10px] absolute text-center justify-center text-yellow-300 text-2xl font-normal font-['Pompiere'] tracking-wide">PAY</div>
                </div>
                <div className="w-40 h-0 left-[54px] top-[220px] absolute outline outline-1 outline-offset-[-0.50px] outline-green-950"></div>
                <div className="w-20 left-[142px] top-[237px] absolute inline-flex justify-start items-start">
                    <div className="justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">Total:</div>
                    <div className="w-10 self-stretch text-right justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">$10</div>
                </div>
            </div>
            <div className="w-64 h-72 left-[457px] top-[184px] absolute">
                <div className="w-64 h-80 left-0 top-0 absolute bg-gradient-to-b from-black/25 to-black/30 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_2px_2px_0px_rgba(255,255,255,0.08)] outline outline-1 outline-offset-[-0.50px] outline-white/10 backdrop-blur-[2px]" />
                <div className="w-8 h-8 left-0 top-0 absolute bg-black/25" />
                <div className="left-[89.50px] top-[24px] absolute text-center justify-start text-yellow-300 text-3xl font-normal font-['Pompiere'] tracking-wide">Order #2</div>
                <div className="w-40 h-0 left-[54px] top-[80px] absolute outline outline-1 outline-offset-[-0.50px] outline-green-950" />
                <div className="w-44 left-[44px] top-[90px] absolute inline-flex justify-between items-start">
                    <div className="w-28 h-12 justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">Panee Tikka</div>
                    <div className="w-11 self-stretch text-right justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">$10</div>
                </div>
                <div className="w-40 h-0 left-[54px] top-[220px] absolute outline outline-1 outline-offset-[-0.50px] outline-green-950"></div>
                <div className="w-20 left-[142px] top-[237px] absolute inline-flex justify-start items-start">
                    <div className="justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">Total:</div>
                    <div className="w-10 self-stretch text-right justify-center text-white text-2xl font-normal font-['Pompiere'] tracking-wide">$10</div>
                </div>
            </div>
            <div className="w-11 h-4 left-[496px] top-[428px] absolute text-center justify-center text-yellow-300 text-2xl font-normal font-['Pompiere'] tracking-wide">Paid</div>
        </div>
    );
}

export default Orders