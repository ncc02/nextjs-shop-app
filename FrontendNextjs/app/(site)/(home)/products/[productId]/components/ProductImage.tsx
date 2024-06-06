'use client'
import Image from 'next/image'
import { useState } from 'react'
const ProductImage = ({ images }: { images: string[] }) => {
  const [activeImg, setActiveImage] = useState<string>(
    images[0] || 'https://img.lovepik.com/element/40021/7866.png_1200.png',
  )
  return (
    <div className="flex flex-col gap-6 lg:w-[40%] mt-6">
      <div className="w-[30rem] h-[30rem] relative">
        <Image
          src={activeImg}
          width={500}
          height={500}
          alt=""
          className="w-full h-full aspect-square object-cover rounded-xl border border-gray-200"
        />
      </div>
      <div className="flex flex-row gap-5 h-25 overflow-x-auto">
        {images.length > 1
          ? images.map((image: string, index) => (
              <Image
                src={image}
                alt=""
                key={index}
                width={100}
                height={100}
                className="w-24 h-24 rounded-md cursor-pointer border border-gray-200"
                onClick={() => {
                  setActiveImage(image)
                }}
                onError={() =>
                  setActiveImage('https://img.lovepik.com/element/40021/7866.png_1200.png')
                }
              />
            ))
          : ''}
      </div>
    </div>
  )
}

export default ProductImage
