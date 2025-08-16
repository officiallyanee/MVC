function ItemList() {
    return (
        <div className="w-[1440px] h-[1024px] relative overflow-hidden">
            <div className="left-[413px] top-[41px] absolute inline-flex justify-start items-center gap-10">
                <div className="w-28 h-10 text-center justify-center text-white text-5xl font-normal font-['Pompiere'] tracking-wide">HOME</div>
                <div className="w-28 h-10 text-center justify-center text-white text-5xl font-normal font-['Pompiere'] tracking-wide">MENU</div>
                <div className="text-center justify-center text-white text-5xl font-normal font-['Pompiere'] tracking-wide">ORDERS</div>
                <div className="text-center justify-center text-yellow-300 text-5xl font-normal font-['Pompiere'] tracking-wide">ITEMLIST</div>
            </div>
            <div className="w-40 h-12 left-[50.55px] top-[34.42px] absolute justify-start text-yellow-300 text-4xl font-normal font-['Notable'] tracking-wide">Amor</div>
            <div className="w-40 h-12 left-[47px] top-[32px] absolute justify-start text-white text-2xl font-normal font-['Fleur_De_Leah'] tracking-wider [text-shadow:_0px_1px_1px_rgb(0_0_0_/_1.00)]">Restro</div>
            <img className="w-[1170px] h-[768px] left-[129px] top-[169px] absolute opacity-50 rounded-[32px]" src="https://placehold.co/1170x768" />
            <div className="w-[1170px] h-[768px] left-[129px] top-[169px] absolute opacity-90 bg-stone-900/90 rounded-[32px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_0px_4px_0px_rgba(255,255,255,0.25)] backdrop-blur-[2px] overflow-hidden">
                <div className="w-80 h-12 left-[413px] top-[55px] absolute text-center justify-center text-yellow-300 text-4xl font-normal font-['Pompiere'] tracking-wide">ItemList</div>
                <div className="w-[995px] h-0 left-[83px] top-[123px] absolute outline outline-1 outline-offset-[-0.50px] outline-stone-800"></div>
                <div className="w-[927px] left-[117px] top-[193px] absolute inline-flex justify-between items-start">
                    <div className="w-44 h-12 justify-center text-white text-4xl font-normal font-['Pompiere'] tracking-wide">Panee Tikka</div>
                    <div className="w-24 self-stretch text-right justify-center text-white text-4xl font-normal font-['Pompiere'] tracking-wide">$10</div>
                </div>
                <div className="w-[927px] left-[117px] top-[263px] absolute inline-flex justify-between items-start">
                    <div className="w-44 h-12 justify-center text-white text-4xl font-normal font-['Pompiere'] tracking-wide">Panee Tikka</div>
                    <div className="w-24 self-stretch text-right justify-center text-white text-4xl font-normal font-['Pompiere'] tracking-wide">$10</div>
                </div>
                <div className="w-[927px] left-[117px] top-[333px] absolute inline-flex justify-between items-start">
                    <div className="w-44 h-12 justify-center text-white text-4xl font-normal font-['Pompiere'] tracking-wide">Panee Tikka</div>
                    <div className="w-24 self-stretch text-right justify-center text-white text-4xl font-normal font-['Pompiere'] tracking-wide">$10</div>
                </div>
                <div className="w-[995px] h-0 left-[83px] top-[403px] absolute outline outline-1 outline-offset-[-0.50px] outline-stone-800"></div>
                <div className="w-[927px] h-12 left-[117px] top-[423px] absolute inline-flex justify-between items-center">
                    <div className="w-[862px] text-right justify-center text-white text-4xl font-normal font-['Pompiere'] tracking-wide">Total :</div>
                    <div className="text-right justify-center text-white text-4xl font-normal font-['Pompiere'] tracking-wide">$10</div>
                </div>
                <div className="w-56 h-14 left-[895px] top-[651px] absolute bg-yellow-300 rounded-3xl overflow-hidden">
                    <div className="w-40 h-10 left-[29px] top-[10px] absolute text-right justify-center text-stone-900 text-4xl font-normal font-['Pompiere'] tracking-wide">Place order</div>
                </div>
            </div>
        </div>
    )
}

export default ItemList