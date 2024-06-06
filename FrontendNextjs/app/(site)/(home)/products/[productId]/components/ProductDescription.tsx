'use client'
import React, { useState } from 'react'

const ProductDescription = ({ productDescription }: { productDescription: string }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex flex-col w-full mx-auto px-14 pb-24 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-2">Product Details</h2>
      <div className={`overflow-hidden ${expanded ? 'h-auto' : 'h-40'}`}>
        <pre className="text-gray-700 text-wrap">{productDescription}</pre>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none mt-2 mx-auto ${
          expanded ? 'bg-gray-500' : ''
        }`}
      >
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  )
}

export default ProductDescription
