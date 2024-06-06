'use client'

interface ButtonProps {
    title:String;
    icon?:any;
    reverse?:boolean;
    size?:String|'sm'|'md'|'lg';
    disabled?:boolean;
    //color enum
    color?:String|'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light';
    onClick?:(event:any)=>void;
}

const Button: React.FC<ButtonProps> = ({title, icon,color,reverse,size,disabled,onClick}) => {
  return (
    <button
        type="submit"
        onClick={onClick}
        disabled={disabled}
        className={`ml-2
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            ${
                color === 'primary' ? 'text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300' :
            
                color === 'secondary' ? 'bg-slate-500 hover:bg-slate-400 focus:ring-4 focus:outline-none focus:ring-slate-300' : 
           
                color === 'success' ? 'bg-green-500 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300' : 
           
                color === 'danger' ? 'bg-red-500 hover:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300' : 
           
          
                color === 'info' ? 'bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300' :
           
                color === 'dark' ? 'bg-slate-800 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-700' :
            
                color === 'light' ? 'text-slate-500 border-slate-300 hover:bg-slate-300 hover:text-slate-100  focus:ring-4 focus:outline-none focus:ring-slate-300 ' : 'text-white'
            }
            ${
                size === 'sm' ? 'px-2 py-1 text-sm' :
                size === 'md' ? 'px-3 py-2 text-sm' :
                size === 'lg' ? 'px-4 py-3 text-base' : 
                'px-3 py-2 text-sm'
            }
            border font-medium rounded-lg text-sm w-full sm:w-auto text-center flex items-center justify-center`
        }
    >
        <div className={`flex items-center ${icon && reverse ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className='mx-1 text-xl font-semibold'>
                {icon}
            </span>
            {
                title &&
                <span className="mx-1">
                    {title}
                </span>
            }
        </div>
    </button>
  )
}

export default Button;