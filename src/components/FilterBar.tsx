import { Filter } from 'lucide-react';

interface FilterBarProps {
    selectedBrand: string;
    onBrandChange: (brand: string) => void;
    // Using category instead of generation from example, as that fits my data
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    brands?: string[];
    categories?: string[];
}

const DEFAULT_BRANDS = ['All', 'Nintendo', 'Sega', 'Sony', 'Microsoft', 'Atari'];
const DEFAULT_CATEGORIES = ['All', 'Retro Consoles', 'Modern Consoles', 'Handhelds', 'Accessories', 'Limited Edition', 'Mobile Gaming'];

export function FilterBar({
    selectedBrand,
    onBrandChange,
    selectedCategory,
    onCategoryChange,
    brands = DEFAULT_BRANDS,
    categories = DEFAULT_CATEGORIES
}: FilterBarProps) {
    return (
        <div className="bg-black border-y-4 border-primary px-4 py-6 mb-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Filter className="w-6 h-6 text-secondary" />
                    <h3
                        className="text-secondary uppercase"
                        style={{
                            fontFamily: '"Press Start 2P", cursive',
                            fontSize: '0.875rem'
                        }}
                    >
                        FILTERS
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brand/Category filter */}
                    <div>
                        <label
                            className="text-gray-400 uppercase block mb-3"
                            style={{
                                fontFamily: '"Press Start 2P", cursive',
                                fontSize: '0.625rem'
                            }}
                        >
                            CATEGORY
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => onCategoryChange(cat)}
                                    className={`
                    px-4 py-2 border-2 transition-all duration-200
                    ${selectedCategory === cat
                                            ? 'bg-primary text-black border-primary'
                                            : 'bg-black text-primary border-primary hover:bg-primary/20'
                                        }
                  `}
                                    style={{
                                        fontFamily: '"Press Start 2P", cursive',
                                        fontSize: '0.625rem',
                                        boxShadow: selectedCategory === cat ? '0 0 15px rgba(0, 255, 0, 0.5)' : 'none'
                                    }}
                                >
                                    {cat === 'All' ? 'ALL' : cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Brand filter (Optional if you have brands in data) */}
                    {/* For now keeping layout but calling it BRAND to match screenshot, but functionality might be mock if no brand data */}
                    {/*
          <div>
            <label 
              className="text-gray-400 uppercase block mb-3"
              style={{ 
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '0.625rem'
              }}
            >
              BRAND
            </label>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => onBrandChange(brand)}
                  className={`
                    px-4 py-2 border-2 transition-all duration-200
                    ${selectedBrand === brand
                      ? 'bg-secondary text-black border-secondary'
                      : 'bg-black text-secondary border-secondary hover:bg-secondary/20'
                    }
                  `}
                  style={{ 
                    fontFamily: '"Press Start 2P", cursive',
                    fontSize: '0.625rem',
                    boxShadow: selectedBrand === brand ? '0 0 15px rgba(255, 0, 255, 0.5)' : 'none'
                  }}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
          */}
                </div>
            </div>
        </div>
    );
}
