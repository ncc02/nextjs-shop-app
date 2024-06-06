'use client'
import Link from 'next/link'

interface SideBarItemProps {
    title?:String;
    to:String;
    active:Boolean;
    icon?: JSX.Element;
    onClick?:()=>void;
}

const SideBarItem: React.FC<SideBarItemProps> = ({title,active,to,icon,onClick}) => {
    return (
        <Link 
            href={`${to}`} 
            className={`
                flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group
                ${active ? 'text-gray-500  bg-gray-100 ' : 'text-gray-900  hover:bg-gray-100 '}
            `}
            onClick={onClick}
        >
            {icon}
            <span className="flex-1 ms-3 text-md whitespace-nowrap">{title}</span>
        </Link>
    )
}

export default SideBarItem;
