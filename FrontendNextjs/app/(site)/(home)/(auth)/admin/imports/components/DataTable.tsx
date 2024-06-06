//data table component using tsx nextjs
//data in props

import Button from './Button'
import { GrFormPrevious } from 'react-icons/gr'
import { GrFormNext } from 'react-icons/gr'
import { BsImageFill } from 'react-icons/bs'
import { Import, Product } from '@prisma/client'
import { format } from 'date-fns'
import Image from 'next/image'

interface DataTableProps {
  data?: (Import & { product: Product })[]
  showing?: number | 10
  isPrevPage?: boolean
  isNextPage?: boolean
  handleClickItem?: (id: string) => void
  handleActionClick?: (id: string) => void
  handleNextPage?: () => void
  handlePrevPage?: () => void
  handleShowing?: (event: any) => void
}

const DataTable = ({
  data,
  showing,
  isPrevPage,
  isNextPage,
  handleClickItem,
  handleActionClick,
  handleNextPage,
  handlePrevPage,
  handleShowing,
}: DataTableProps) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full">
        <table className="text-slate-500 table-auto w-full mb-3 ">
          <thead>
            <tr className="border-y border-slate-300">
              <th className="px-2 py-6 uppercase">
                <div className="flex font-medium">Product Name</div>
              </th>
              <th className="px-2 py-6 uppercase">
                <div className="flex font-medium">Quantity</div>
              </th>
              <th className="px-2 py-6 uppercase">
                <div className="flex font-medium">At</div>
              </th>

              <th className="w-[25px]  px-2 py-6 uppercase">
                <div className="flex font-medium">Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map(({ product, id, createdAt, quantity }) => {
              return (
                <tr
                  key={id}
                  className="border-b border-slate-300 hover:bg-slate-100 cursor-pointer"
                  onClick={() => {
                    if (handleClickItem) handleClickItem(product.id)
                  }}
                >
                  <td className="px-2 py-1 flex items-center">
                    <div className="w-20 h-16 mr-3 my-2  rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex justify-center items-center">
                      {product.images.length === 0 ? (
                        <BsImageFill />
                      ) : (
                        <Image
                          width={50}
                          height={50}
                          className="h-full w-auto"
                          src={product.images[0]}
                          alt=""
                        />
                      )}
                    </div>
                    <span className="font-bold">{product.name}</span>
                  </td>
                  <td className="px-2 py-1">
                    <div className="">{quantity}</div>
                  </td>
                  <td className="px-2 py-1">
                    <div className="">{format(createdAt, 'hh:mm dd/MM/yyyy')}</div>
                  </td>
                  <td className="px-2 py-y">
                    <Button
                      title="Import"
                      color="primary"
                      onClick={() => {
                        if (handleActionClick) handleActionClick(product.id)
                      }}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="w-full">
          <div className="w-full flex justify-between py-3">
            <div className="flex ">
              <div className="flex items-center">
                <select
                  id="isActive"
                  name="isActive"
                  value={String(showing)}
                  onChange={handleShowing}
                  className="bg-transparent text-slate-500 text-sm rounded-lg focus:ring-4 focus:outline-none focus:ring-slate-300 block w-full p-1"
                  required
                >
                  <option value="10">Showing: 10</option>
                  <option value="20">Showing: 20</option>
                  <option value="50">Showing: 50</option>
                </select>
              </div>
            </div>
            <div className="flex">
              <Button
                title="Prev"
                size="md"
                onClick={handlePrevPage}
                icon={<GrFormPrevious />}
                disabled={!isPrevPage}
                color="light"
              />

              <Button
                title="Next"
                size="md"
                reverse={true}
                onClick={handleNextPage}
                icon={<GrFormNext />}
                disabled={!isNextPage}
                color="light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable
