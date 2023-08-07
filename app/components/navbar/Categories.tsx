"use client";

import Container from "../Container";
import {TbBeach, TbMountain, TbPool} from 'react-icons/tb';
import {GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiWindmill} from 'react-icons/gi'
import { MdOutlineVilla } from 'react-icons/md'
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import {FaSkiing} from 'react-icons/fa';
import {BsSnow} from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5'

export const categories = [
    {
        label: "Playa",
        icon: TbBeach,
        description: 'Esta propiedad está cerca de la playa¡¡'
    },
    {
        label: "Molinos de viento",
        icon: GiWindmill,
        description: 'Esta propiedad tiene molinos de viento'
    },
    {
        label: "Moderna",
        icon: MdOutlineVilla,
        description: 'Esta propiedad es Moderna'
    },
    {
        label: "Campo",
        icon: TbMountain,
        description: 'Esta propiedad esta en el campo'
    },
    {
        label: "Piscinas",
        icon: TbPool,
        description: 'Esta propiedad tiene piscinas'
    },
    {
        label: "Islas",
        icon: GiIsland,
        description: 'Esta propiedad esta en una isla'
    },
    {
        label: "Lagos",
        icon: GiBoatFishing,
        description: 'Esta propiedad esta en una isla'
    },
    {
        label: "Esquiar",
        icon: FaSkiing,
        description: 'Esta propiedad tiene actividades de esqui'
    },
    {
        label: "Castillos",
        icon: GiCastle,
        description: 'Esta propiedad esta en un castillo'
    },
    {
        label: "Camping",
        icon: GiForestCamp,
        description: 'Esta propiedad cuenta con actividades para acampar'
    },
    {
        label: "Artico",
        icon: BsSnow,
        description: 'Esta propiedad cuenta con actividades para acampar'
    },
    {
        label: "Cueva",
        icon: GiCaveEntrance,
        description: 'Esta propiedad esta en una cueva'
    },
    {
        label: "Desierto",
        icon: GiCactus,
        description: 'Esta propiedad esta en el desierto'
    },
    {
        label: "Graneros",
        icon: GiBarn,
        description: 'Esta propiedad esta en un granero'
    },
    {
        label: "Lujo",
        icon: IoDiamond,
        description: 'Esta propiedad es de lujo'
    },



]


const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();
    const isMainPage = pathname === '/';

    if(!isMainPage){
        return null;
    }
    return ( 
        <Container>
            <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
                {categories.map((item) =>(
                    <CategoryBox key={item.label} label={item.label} selected={category === item.label} icon={item.icon}/>
                ))}
            </div>
        </Container>
     );
}
 
export default Categories;