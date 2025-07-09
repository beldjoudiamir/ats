import { useState } from "react";
import { MagnifyingGlassIcon, FolderIcon } from "@heroicons/react/24/outline";

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Recherche:", searchTerm);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-200 dark:bg-gray-700 rounded-lg mt-2 p-2 gap-2 sm:gap-4 w-full">
     
    </div>
  );
};

export default SearchForm;



