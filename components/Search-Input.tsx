"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Loader, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

interface SearchResults {
  id: number;
  title: string;
  image: string;
}

const SearchInput = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>();
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);

  const onSelectFood = (food: SearchResults) => {
    sessionStorage.setItem("selectedFood", JSON.stringify(food));
    router.push(`/track/${food.id}`);
  };

  const handleInputValue = async () => {
    setIsPopoverOpen(true);
    setIsLoading(true);
    // Send API request
    try {
      const res = await fetch(`${baseUrl}/api/search-meal?query=${inputValue}`);
      const data = await res.json();
      if (!data) return;
      setSearchResults(data.results);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  const mockSearchResults = [
    {
      id: 1095889,
      title: "Creamy Homemade Tomato Soup",
      image: "https://img.spoonacular.com/recipes/1095889-312x231.jpg",
      imageType: "jpg",
    },
    {
      id: 642583,
      title: "Farfalle with Peas, Ham and Cream",
      image: "https://img.spoonacular.com/recipes/642583-312x231.jpg",
      imageType: "jpg",
    },
    {
      id: 637184,
      title: "Carrot Cake Pancakes",
      image: "https://img.spoonacular.com/recipes/637184-312x231.jpg",
      imageType: "jpg",
    },
    {
      id: 660185,
      title: "Singapore Curry",
      image: "https://img.spoonacular.com/recipes/660185-312x231.jpg",
      imageType: "jpg",
    },
    {
      id: 652497,
      title: "Mouthwatering Mushroom Pie",
      image: "https://img.spoonacular.com/recipes/652497-312x231.jpg",
      imageType: "jpg",
    },
    {
      id: 653886,
      title: "Orange Honey Madeleines",
      image: "https://img.spoonacular.com/recipes/653886-312x231.jpg",
      imageType: "jpg",
    },
    {
      id: 636177,
      title: "Broccoli Cheddar Soup",
      image: "https://img.spoonacular.com/recipes/636177-312x231.jpg",
      imageType: "jpg",
    },
    {
      id: 638893,
      title: "Chocolate Cherry Cheesecake",
      image: "https://img.spoonacular.com/recipes/638893-312x231.jpg",
      imageType: "jpg",
    },
    {
      id: 635217,
      title: "Blackberry Grilled Cheese Sandwich",
      image: "https://img.spoonacular.com/recipes/635217-312x231.jpg",
      imageType: "jpg",
    },
    {
      id: 651140,
      title: "Marshmallow S'mores Bites",
      image: "https://img.spoonacular.com/recipes/651140-312x231.jpg",
      imageType: "jpg",
    },
  ];

  return (
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <Input
                  className="pl-10"
                  onChange={(e) => setInputValue(e.target.value)}
                />
                {isLoading ? (
                  <Loader className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                ) : (
                  <Search
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:cursor-pointer"
                    onClick={handleInputValue}
                  />
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="max-h-[300px] overflow-y-auto rounded-b-md bg-white">
                {searchResults.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => onSelectFood(food)}
                    className="w-full cursor-pointer items-center justify-between px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <div className="font-medium">{food.title}</div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
  );
};

export default SearchInput;
