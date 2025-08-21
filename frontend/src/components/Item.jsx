export default function Item({ id,name, imageSrc, status, quantity,price, description,addQuantity,subQuantity }) {
  const cardBaseStyles = "w-64 h-64 rounded-tl-3xl rounded-br-3xl bg-black/30 shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-0.50px] outline-white/20 backdrop-blur-[2px]";

  return (
    <div className="group h-56 w-64 [perspective:1000px] mb-12 ">
      
      <div className="relative h-full w-full rounded-tl-3xl rounded-br-3xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:rotate-y-180">
        
        <div className={`absolute inset-0 ${cardBaseStyles} [backface-visibility:hidden]`}>
          <div className="inline-flex h-full w-full flex-col items-center justify-start gap-5 px-7 py-8">
            <div className="self-stretch text-center font-['Pompiere'] text-3xl font-normal tracking-wide text-yellow-300">
                {name}
            </div>
            <div className="relative self-stretch flex-1 bg-stone-500 rounded overflow-hidden">
                <img className="w-full h-full object-cover" src={`/${imageSrc}`} alt={name} />

                <div className="absolute bottom-2 right-2 px-3 py-1 bg-yellow-300 rounded-md shadow-lg">
                    <span className="text-stone-900 font-bold font-['Pompiere'] text-lg">
                        ${price}
                    </span>
                </div>
            </div>
          
          </div>
        </div>

        <div className={`absolute inset-0 ${cardBaseStyles} [backface-visibility:hidden] [transform:rotateY(180deg)]`}>
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 text-center">
            <h3 className="font-['Pompiere'] text-3xl text-yellow-300 px-7 py-4">{name}</h3>
            <p className="flex-grow font-['Pompiere'] text-lg text-white place-content-center">
              {description || "No description available."}
            </p>
              <div className="inline-flex items-start justify-center self-stretch px-2 pb-2">
              <div className={`flex-1 self-stretch justify-center font-['Pompiere'] text-2xl font-normal tracking-wide ${status === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                {status}
              </div>
              <div className="flex items-center justify-start gap-3 overflow-hidden rounded bg-stone-900 p-0.5 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)]">
                <div onClick={() => {subQuantity(id)}} className="relative h-6 w-6 cursor-pointer overflow-hidden">
                  <div className="absolute left-[5px] top-[12.50px] h-0 w-3 outline outline-1 outline-offset-[-0.50px] outline-yellow-300" />
                </div>
                <div id={id} className="text-center font-['Pompiere'] text-xl font-normal tracking-tight text-yellow-300">
                    {quantity}
                </div>
                <div onClick={() => {addQuantity(id)}} className="w-6 h-6 relative cursor-pointer">
                    <div className="w-3.5 h-[2px] bg-yellow-300 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <div className="w-[2px] h-3.5 bg-yellow-300 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}