//data table component using tsx nextjs
//data in props

import useLoading from '@/app/hooks/useLoading'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BsImageFill } from 'react-icons/bs'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import Button from './Button'
import Image from 'next/image'

interface DataTableProps {
  data: any
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
  handleNextPage,
  handlePrevPage,
  handleShowing,
}: DataTableProps) => {
  const { loading } = useLoading()
  const [dataList, setDataList] = useState<[]>(data)
  useEffect(() => {
    setDataList(data)
  }, [data])
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
                <div className="flex font-medium">Category</div>
              </th>
              <th className="px-2 py-6 uppercase">
                <div className="flex font-medium">Price</div>
              </th>
              <th className="px-2 py-6 uppercase">
                <div className="flex font-medium">Status</div>
              </th>
              <th className="px-2 py-6 uppercase">
                <div className="flex font-medium">Stock</div>
              </th>
              <th className="px-2 py-6 uppercase">
                <div className="flex font-medium">Sold</div>
              </th>
              <th className="w-[25px]  px-2 py-6 uppercase">
                <div className="flex font-medium">Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {dataList?.map((item: any, index: number) => {
              return (
                <tr
                  key={index}
                  className="border-b border-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  <td
                    className="px-2 py-1 flex items-center"
                    onClick={() => {
                      if (handleClickItem) {
                        handleClickItem(item.id)
                      }
                    }}
                  >
                    <div className="w-20 h-16 mr-3 my-2  rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex justify-center items-center">
                      {item.images.length === 0 ? (
                        <BsImageFill />
                      ) : (
                        <Image
                          className="h-full w-auto"
                          src={item.images[0]}
                          alt=""
                          width={100}
                          height={100}
                        />
                      )}
                    </div>
                    <span className="font-bold">{item.name}</span>
                  </td>
                  <td className="px-2 py-1">
                    <div className="">
                      {item.category && item.category.length > 0
                        ? item.category[0].name
                        : 'No Category'}
                    </div>
                  </td>

                  <td className="px-2 py-1">
                    <div className="">{item.price}</div>
                  </td>
                  <td className="px-2 py-1">
                    <div className="">{item.isActive ? 'Active' : 'Inactive'}</div>
                  </td>
                  <td className="px-2 py-1">
                    <div className="">{item.quantity}</div>
                  </td>
                  <td className="px-2 py-1">
                    <div className="">{item.sold}</div>
                  </td>
                  <td className="px-2 py-y">
                    <Link
                      href={`/admin/imports/${item.id}`}
                      className="bg-blue-500 rounded-md hover:bg-blue-400 p-2 px-3 text-white"
                      onClick={loading}
                    >
                      Import
                    </Link>
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
