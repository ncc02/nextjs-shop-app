'use client'
import { Category } from "@prisma/client";
import Categorie from "./FilterCategorys";
import Price from "./FilterPrice";

const ShopSideNav = ({categorys}:{categorys:Category[]}) => {
    return (
      <div className="w-full flex flex-col gap-6 bg-white h-[100vh] px-6 py-9 rounded-md">
        <Categorie categorys={categorys} />
        <Price />
      </div>
    );
  };
  
  export default ShopSideNav;