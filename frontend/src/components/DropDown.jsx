import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function CustomDropdown({ categories, onSelectCategory, setMenuItems }) {
    const [isOpen, setIsOpen] = useState(false);
    // Initialize with the first category or a placeholder
    const [selectedCategory, setSelectedCategory] = useState(categories.length > 0 ? categories[0] : null);
    const dropdownRef = useRef(null);

    // Effect to handle clicks outside of the dropdown to close it
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const handleSelect = async (category) => {
      setSelectedCategory(category.category);
      setIsOpen(false);
      const response = await axios.get(`http://localhost:8080/menu/${category.category}`);
      setMenuItems(response.data);
      console.log(response.data);
      if (onSelectCategory) {
        onSelectCategory(category.category);
      }
    };

    return (
      <div className="relative w-52" ref={dropdownRef}>
        {/* This is the main button, styled with your specific classes */}
        <div
          className="w-52 h-14 relative bg-black/30 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shadow-[inset_0px_2px_8px_0px_rgba(255,255,255,0.20)] backdrop-blur-[2px] overflow-hidden cursor-pointer flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="text-center text-white text-3xl font-normal font-['Pompiere'] tracking-wide">
            {selectedCategory ? selectedCategory.category : 'Select...'}
          </div>
          {/* Arrow icon inspired by your second example */}
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className={`-mr-1 size-5 text-gray-300 absolute right-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
        </div>

        {/* This is the dropdown panel */}
        {isOpen && (
          <div className="absolute top-full mt-2 w-52 z-10 origin-top-right rounded-md bg-black/50 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-[2px] outline-1 -outline-offset-1 outline-white/10">
            <div className="py-1">
              {categories.map((category) => (
                <a
                  href="#"
                  key={category.id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelect(category);
                  }}
                  className="block px-4 py-2 text-center text-2xl font-['Pompiere'] text-gray-200 hover:bg-white/10 focus:bg-white/10 focus:text-white focus:outline-none"
                >
                  {category.category}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  export default CustomDropdown;