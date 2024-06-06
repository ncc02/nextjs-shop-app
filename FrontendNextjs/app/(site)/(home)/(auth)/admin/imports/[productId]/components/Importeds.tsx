'use client'

import { Import } from '@prisma/client'
import { format } from 'date-fns'

const Importeds = ({ imports }: { imports?: Import[] }) => {
  return (
    <div className="xl:w-1/2 w-full mb-3">
      <div className="mx-2 h-full">
        <div className="border rounded-lg h-full p-4">
          <label className="block mb-2  text-sm text-gray-500 font-semibold">History import</label>

          <div className="flex flex-col divide-y">
            {imports?.map(i => (
              <div
                key={i.id}
                className="flex items-center p-2 hover:bg-gray-200 hover:rounded-md text-sm text-gray-500 font-semibold justify-between"
              >
                <span>Quantity: {i.quantity}</span>
                <span>At: {format(i.createdAt, 'hh:mm dd-MM-yyyy')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Importeds
