import NavBar  from "../components/NavBar.jsx";

function Home() {
  return (
    <>

          <div className="w-[100%] h-[25%] left-0 top-[63.7%] absolute bg-stone-900 overflow-hidden">
            <div className="w-[54%] left-[5%] top-[4%] absolute text-white font-normal font-['Pompiere'] tracking-wide text-[clamp(1rem,3.3vw,3rem)] leading-tight">
              Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.
            </div>
          </div>

          <div className="w-[49.5%]  flex-col justify-start items-start inline-flex">    
                        <div className="self-stretch left-[5%] top-[32.2%] absolute text-yellow-300 font-normal font-['Notable'] tracking-[0.25vw] text-[clamp(4rem,12.5vw,11.25rem)] leading-tight">Amor</div>
            <div className="self-stretch left-[5%] top-[32.2%] absolute text-white font-normal font-['Fleur_De_Leah'] tracking-[0.4vw] [text-shadow:_0px_0.5vw_0.5vw_rgb(0_0_0_/_1.00)] text-[clamp(2.5rem,6.9vw,6.25rem)] leading-tight">Restro</div>
          </div>

          <img 
              className=" h-full right-0 top-0 absolute object-contain overflow-hidden" 
              src="/bowl.png" 
              alt="Interior of a restaurant"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1024x1024'; }}
          />
          
          {/* Logo Text - Top Left */}
          <div className="left-[3.5%] top-[3%] absolute text-yellow-300 font-normal font-['Notable'] tracking-wide text-[clamp(1.5rem,2.7vw,2.5rem)]">Amor</div>
          <div className="left-[3.2%] top-[2.8%] absolute text-white font-normal font-['Fleur_De_Leah'] tracking-wider [text-shadow:_0px_0.1vw_0.1vw_rgb(0_0_0_/_1.00)] text-[clamp(1rem,1.6vw,1.5rem)]">Restro</div>
        
    </>
  );
}

export default Home;
