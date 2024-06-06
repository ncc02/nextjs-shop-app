//data table component using tsx nextjs
//data in props

import React, { useState, useEffect } from 'react'
import Button from './Button'
import { GrFormPrevious } from 'react-icons/gr'
import { GrFormNext } from 'react-icons/gr'
import { BsImageFill } from 'react-icons/bs'
import Image from 'next/image'
import { format } from 'date-fns'

interface DataTableProps {
  data: any
  showing?: number | 10
  isPrevPage?: boolean
  isNextPage?: boolean
  handleClickItem?: (id: string) => void
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
                <div className="flex font-medium">Category Name</div>
              </th>
              <th className="px-2 py-6 uppercase">
                <div className="flex font-medium">Description</div>
              </th>
              <th className="px-2 py-6 uppercase">
                <div className="flex font-medium">Num products</div>
              </th>
              <th className="px-2 py-6 uppercase">
                <div className="flex font-medium">Created at</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {dataList?.map((item: any, index: number) => {
              return (
                <tr
                  key={index}
                  className="border-b border-slate-300 hover:bg-slate-100 cursor-pointer"
                  onClick={() => {
                    if (handleClickItem) {
                      handleClickItem(item.id)
                    }
                  }}
                >
                  <td className="px-2 py-1 flex items-center">
                    <div className="w-20 h-16 mr-3 my-2  rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex justify-center items-center">
                      {!item.image ? (
                        <BsImageFill />
                      ) : (
                        <Image
                          width={50}
                          height={50}
                          className="h-full w-auto"
                          src={item.image}
                          alt=""
                        />
                      )}
                    </div>
                    <span className="font-bold">{item.name}</span>
                  </td>
                  <td className="px-2 py-1">
                    <div className="">{item?.description}</div>
                  </td>

                  <td className="px-2 py-1">
                    <div className="">{item?.productIds?.length}</div>
                  </td>
                  <td className="px-2 py-1">
                    <div className="">{format(new Date(item?.createdAt), 'hh:mm dd-MM-yyyy')}</div>
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
